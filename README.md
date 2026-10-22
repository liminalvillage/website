# Liminal Village Website

A modern, responsive website for Liminal Village - an open source innovation eco-tech hub in the center of Italy.

## 🚀 Built With

- **Svelte 5** - Modern reactive framework
- **Vite** - Fast build tool and dev server
- **FontAwesome** - Icon library

## 📦 Project Structure

```
├── public/
│   └── images/       # All website images
├── src/
│   ├── lib/         # Svelte components
│   │   ├── Navbar.svelte
│   │   ├── Hero.svelte
│   │   ├── About.svelte
│   │   ├── ThreePillars.svelte
│   │   ├── Village.svelte
│   │   ├── Lunations.svelte
│   │   ├── Contact.svelte
│   │   └── Footer.svelte
│   ├── App.svelte   # Main app component
│   ├── app.css      # Global styles
│   └── main.js      # Entry point
├── index.html       # HTML template
├── package.json     # Dependencies
└── vite.config.js   # Vite configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌟 Features

- **Fully Responsive** - Works on all devices
- **Modern Design** - Clean and minimal UI
- **Smooth Animations** - Engaging user experience
- **Fast Loading** - Optimized images and code splitting
- **Accessible** - Built with accessibility in mind
- **SEO Friendly** - Proper meta tags and semantic HTML

## 🌿 Services page (`/services`)

Villagers and what they offer, with online booking (booking system ported
from `maxage`).

- **Who is listed**: members (`users` lens) of the Liminal Village holon,
  read live from the Holosphere Nostr relays by `netlify/lib/holosphere.mjs`.
- **Ikigai & LinkedIn**: collected by @HolonsBot's `/onboarding` journey
  (steps *ikigai* and *linkedin*, editable later via *Change Profile*; the
  page links straight in with `t.me/HolonsBot?start=onboarding`) and
  stored in the member's public DNA — holon = their Telegram id, lens `dna`.
  Category and values come from there too. Fallbacks: the same fields on
  their `users`/`profile` records, then their `/apply` answers.
- **Booking**: every villager can be booked. Stewards at `/services?admin`
  set a session name and price and open times → visitors pick a slot. Without
  open times (or when none fits) visitors send a **session request** (preferred
  day + time of day) that the practitioner gets on Telegram and answers by
  e-mail; requests also show in the admin. Data lives in Netlify Blobs
  (store `services`).
- **API**: `netlify/functions/services.mjs` (`/api/services/*`).

Environment variables (Netlify → Project configuration):

| Variable | Needed for |
| --- | --- |
| `SERVICES_ADMIN_PASSWORD`, `SERVICES_SESSION_SECRET` | steward areas (`/services/admin`, `/apply/admin`) |
| `TELEGRAM_BOT_TOKEN` | DM the practitioner on each booking/cancellation (HolonsBot's token) |
| `TELEGRAM_CHAT_ID` | steward chat: copies of bookings, and every new application |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | confirmation e-mail with cancel link to the client |
| `SERVICES_HOLON_ID`, `HOLOSPHERE_RELAYS` | optional overrides (default: Liminal Village, production relays) |

Run locally with functions + Blobs: `npx netlify dev`.

## ✍️ Application form (`/apply`)

- `/apply` is the community application: an intro with the 2030 Vision video,
  then four steps (You · Your story · Lunation · Contribution). Remote-only
  applicants skip the travel questions; drafts are kept in the browser.
- Questions and required-field rules live in `src/apply/questions.js`, shared
  by the page and `netlify/functions/apply.mjs` (`/api/apply`), which stores
  each application in Netlify Blobs (store `applications`), posts it to
  `TELEGRAM_CHAT_ID` and e-mails the applicant a copy (SMTP, as above).
  Set `APPLY_NOTIFY_EMAIL` to also receive applications by e-mail.
- Stewards read them at `/apply/admin`: filter, mark New / Reviewing /
  Accepted / Declined, reply, delete, export CSV. Same password and session as
  the services admin (`netlify/lib/admin.mjs`).

## 🌙 Lunations page (`/lunations`) and homepage timer

- `/lunations` is a read-only copy of the kiosk's year calendar
  (holons `apps/kiosk/src/lib/views/YearTimeline.svelte` → `src/calendar/`):
  new/full moons, solstices, equinoxes and the village holon's dated quests
  (`netlify/functions/calendar.mjs`, `/api/calendar`), plus the year's
  numbered lunations.
- The hero shows a live lunation timer (`src/lib/LunationTimer.svelte`):
  which lunation we are in, its phase, and the countdown to the next full or
  new moon, linking to `/lunations`.
- Lunation numbers come from a port of `@holons/core/flows/lunation.ts`
  (`src/calendar/lunation.js`) — the same count the bot's `/newmoon` uses.
  `src/calendar/schedule.js` ports the reading side of `@holons/core/tasks`.
  Keep both in step with holons.

## 📄 License

© 2025 Liminal Village. All Rights Reserved.

## 🔗 Links

- Website: [liminalvillage.com](https://liminalvillage.com)
- Projects: [async.hackalong.io](https://async.hackalong.io/)
- Documentation: [docs.liminalvillage.com](https://docs.liminalvillage.com/)
