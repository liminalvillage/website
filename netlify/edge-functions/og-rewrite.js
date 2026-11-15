// Every host shares one index.html, and the app sets its title in the browser.
// Link previews (WhatsApp, Telegram, LinkedIn…) and most crawlers never run
// that JavaScript, so give each site its own title, description and OG tags here.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const SITES = [
  {
    match: (host) => host.includes('casaselva'),
    // Casa Selva has always been rewritten on every HTML page.
    rootOnly: false,
    meta: () => ({
      title: 'Casa Selva — A sanctuary for conscious ways of being human',
      description: 'Casa Selva — A sanctuary for conscious ways of being human. A regenerative living space in the hills of Le Marche, Italy.',
      ogDescription: 'A regenerative living space in the hills of Le Marche, Italy. Supporting the rise of a new humanity.',
      url: 'https://casaselva.earth',
      image: 'https://casaselva.earth/images/casaselva/1.jpeg',
    }),
  },
  {
    // regenerativa.earth, but not rigenerativa.it (the operating company's site).
    match: (host) => host.includes('regenerativa'),
    // /lunations.html, /quests.html… have titles of their own.
    rootOnly: true,
    meta: (url) => {
      const it = url.searchParams.get('lang') === 'it';
      const description = it
        ? 'ReGenerativa APS/ETS connette persone, luoghi, progetti e risorse attraverso eventi ed esperienze che rigenerano la vita. Partiamo dalle Marche, con un modello replicabile in altre bioregioni.'
        : 'ReGenerativa APS/ETS connects people, places, projects and resources through events and experiences that regenerate life. Starting in the Marche, Italy, with a model made to grow into other bioregions.';
      return {
        title: it ? 'ReGenerativa — Una rete per la rigenerazione integrale' : 'ReGenerativa — A network for integral regeneration',
        description,
        ogDescription: description,
        url: it ? 'https://regenerativa.earth/?lang=it' : 'https://regenerativa.earth/',
        image: 'https://regenerativa.earth/images/regenerativa/og.jpg',
        imageAlt: it ? 'Un cerchio di persone sul prato al Solstizio d’estate 2026, nelle Marche' : 'A circle of people on the grass at the Summer Solstice 2026 in the Marche',
        siteName: 'ReGenerativa',
        locale: it ? 'it_IT' : 'en_GB',
        altLocale: it ? 'en_GB' : 'it_IT',
        lang: it ? 'it' : 'en',
        icon: '/images/regenerativa/logo.png',
      };
    },
  },
];

export default async (request, context) => {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const site = SITES.find((s) => s.match(host));
  if (!site) return;
  if (site.rootOnly && url.pathname !== '/' && url.pathname !== '/index.html') return;

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const m = site.meta(url);
  let html = await response.text();

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(m.description)}" />`);
  if (m.lang) html = html.replace(/<html lang="[^"]*"/, `<html lang="${m.lang}"`);
  if (m.icon) html = html.replace(/<link rel="icon"[^>]*>/, `<link rel="icon" type="image/png" href="${m.icon}" />`);

  const tags = [
    `<link rel="canonical" href="${esc(m.url)}" />`,
    m.siteName && `<meta property="og:site_name" content="${esc(m.siteName)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.ogDescription)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(m.url)}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    m.imageAlt && `<meta property="og:image:width" content="1200" />`,
    m.imageAlt && `<meta property="og:image:height" content="630" />`,
    m.imageAlt && `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    m.locale && `<meta property="og:locale" content="${m.locale}" />`,
    m.altLocale && `<meta property="og:locale:alternate" content="${m.altLocale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.ogDescription)}" />`,
    `<meta name="twitter:image" content="${esc(m.image)}" />`,
  ].filter(Boolean);

  html = html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, headers });
};

export const config = {
  path: '/*',
};
