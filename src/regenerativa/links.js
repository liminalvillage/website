// docs.regenerativa.earth — the internal agreements for operating within the
// network (a Quartz site; slugs are lowercase, the em dash is kept).
export const DOCS = 'https://docs.regenerativa.earth';
export const doc = (slug) => `${DOCS}/${slug}`;

export const agreementUrl = (n, name) => doc(`agreements/agreement-${n}-%E2%80%94-${name.toLowerCase()}`);

export const docsPages = {
  overview: doc('constellation-overview'),
  intro: doc('introduction-%E2%80%94-a-constellation-of-agreements'),
  terms: doc('general-terms-and-conditions'),
  cheatsheet: doc('constellation-cheatsheet'),
  statute: doc('companion-docs/statute---regenerativa-aps'),
  statuto: doc('companion-docs/statuto---regenerativa-aps'),
  safeguarding: doc('companion-docs/safeguarding-policy-and-code-of-conduct'),
  charter: doc('companion-docs/participant-and-community-charter'),
  fund: doc('companion-docs/the-fund-in-plain-language'),
  impact: doc('companion-docs/regenerative-impact-framework'),
  passport: doc('companion-docs/network-passport'),
  faq: doc('companion-docs/constellation-faq---concerns-by-agreement'),
};

export const EMAIL = 'hello@regenerativa.earth';
export const mailto = (subject) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
