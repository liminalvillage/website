// The company mailbox and prefilled emails, shared by Contatti and Rigeneratori.
// TODO: confirm the company mailbox before going live.
export const EMAIL = 'info@rigenerativa.it';

export const mailto = (subject, body) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(`${subject} · dal sito`)}&body=${encodeURIComponent(body)}`;
