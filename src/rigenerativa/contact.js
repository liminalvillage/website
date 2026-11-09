// The company mailbox and prefilled emails, shared by Contatti and Rigeneratori.
// TODO: confirm the company mailbox before going live.
import { pick } from './i18n.js';

export const EMAIL = 'info@rigenerativa.it';

const via = pick({ it: 'dal sito', en: 'from the website' });

export const mailto = (subject, body) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(`${subject} · ${via}`)}&body=${encodeURIComponent(body)}`;
