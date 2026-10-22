// Booking notifications, ported from maxage. Everything is optional:
//   TELEGRAM_BOT_TOKEN   DMs the practitioner (chat id = their Telegram user
//                        id, which works once they have started the bot)
//   TELEGRAM_CHAT_ID     also copies a steward / group chat
//   SMTP_* + MAIL_FROM   confirmation e-mail with cancel link to the client
// A failed notification never breaks the booking.
import nodemailer from 'nodemailer';
import { addMinutes, formatLongDate, formatPrice } from '../../src/services/dates.js';

const env = process.env;

function describe(b, practitioner) {
  return [
    `${b.service || 'Session'} with ${practitioner}`,
    `${formatLongDate(b.date)}, ${b.time}–${addMinutes(b.time, b.duration)} (${b.duration} min)`,
    `Price: ${formatPrice(b.price, b.currency)}`,
    `Name: ${b.name}`,
    `E-mail: ${b.email}`,
    b.phone ? `Phone: ${b.phone}` : null,
    b.note ? `Note: ${b.note}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendMail(to, subject, text) {
  if (!env.SMTP_HOST || !to) return;
  const port = Number(env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({ from: env.MAIL_FROM || 'Liminal Village <no-reply@liminalvillage.com>', to, subject, text });
}

async function sendTelegram(chatId, text) {
  const token = env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

async function safely(label, fn) {
  try {
    await fn();
  } catch (e) {
    console.error(`[services] ${label} failed:`, e);
  }
}

export async function notifyNewBooking(b, practitioner, siteUrl) {
  const summary = describe(b, practitioner);
  const cancelUrl = `${siteUrl}/services?cancel=${b.cancel_token}`;
  console.log(`[services] New booking\n${summary}`);
  await Promise.all([
    safely('practitioner telegram', () => sendTelegram(b.p, `🌿 New booking\n\n${summary}`)),
    safely('steward telegram', () => sendTelegram(env.TELEGRAM_CHAT_ID, `🌿 New booking\n\n${summary}`)),
    safely('client e-mail', () =>
      sendMail(
        b.email,
        `Your session with ${practitioner} — ${formatLongDate(b.date)}`,
        [
          `Hi ${b.name},`,
          '',
          `your session at Liminal Village is booked:`,
          '',
          summary,
          '',
          `Can't make it? Cancel here: ${cancelUrl}`,
          '',
          'See you in the village 🌙',
        ].join('\n')
      )
    ),
  ]);
}

export async function notifyCancelled(b, practitioner) {
  const summary = describe(b, practitioner);
  console.log(`[services] Booking cancelled\n${summary}`);
  await Promise.all([
    safely('practitioner telegram', () => sendTelegram(b.p, `✖️ Booking cancelled\n\n${summary}`)),
    safely('steward telegram', () => sendTelegram(env.TELEGRAM_CHAT_ID, `✖️ Booking cancelled\n\n${summary}`)),
  ]);
}

export async function notifyRequest(r, practitioner) {
  const summary = [
    `${r.service || 'A session'} with ${practitioner}`,
    r.preferred ? `Preferred: ${formatLongDate(r.preferred)}${r.timeOfDay ? `, ${r.timeOfDay}` : ''}` : r.timeOfDay ? `Preferred: ${r.timeOfDay}` : 'Preferred: flexible',
    `Name: ${r.name}`,
    `E-mail: ${r.email}`,
    r.phone ? `Phone: ${r.phone}` : null,
    r.note ? `Message: ${r.note}` : null,
  ]
    .filter(Boolean)
    .join('\n');
  console.log(`[services] Session request\n${summary}`);
  await Promise.all([
    safely('practitioner telegram', () => sendTelegram(r.p, `🌱 Session request\n\n${summary}\n\nReply to them by e-mail to agree on a time.`)),
    safely('steward telegram', () => sendTelegram(env.TELEGRAM_CHAT_ID, `🌱 Session request\n\n${summary}`)),
    safely('client e-mail', () =>
      sendMail(
        r.email,
        `Your request for a session with ${practitioner}`,
        [`Hi ${r.name},`, '', `we passed your request on to ${practitioner}:`, '', summary, '', `They'll get back to you to agree on a time.`, '', 'See you in the village 🌙'].join('\n')
      )
    ),
  ]);
}
