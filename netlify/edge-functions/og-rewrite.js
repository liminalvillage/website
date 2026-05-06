export default async (request, context) => {
  const url = new URL(request.url);
  if (!url.hostname.includes('casaselva')) {
    return;
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();

  html = html.replace(
    /<title>[^<]*<\/title>/,
    '<title>Casa Selva — A sanctuary for conscious ways of being human</title>'
  );
  html = html.replace(
    /<meta name="description"[^>]*>/,
    '<meta name="description" content="Casa Selva — A sanctuary for conscious ways of being human. A regenerative living space in the hills of Le Marche, Italy." />'
  );

  // Add OG tags if not present
  const ogTags = `
    <meta property="og:title" content="Casa Selva — A sanctuary for conscious ways of being human" />
    <meta property="og:description" content="A regenerative living space in the hills of Le Marche, Italy. Supporting the rise of a new humanity." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://casaselva.earth" />
    <meta property="og:image" content="https://casaselva.earth/images/casaselva/1.jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Casa Selva — A sanctuary for conscious ways of being human" />
    <meta name="twitter:description" content="A regenerative living space in the hills of Le Marche, Italy." />
    <meta name="twitter:image" content="https://casaselva.earth/images/casaselva/1.jpeg" />`;

  html = html.replace('</head>', ogTags + '\n  </head>');

  return new Response(html, {
    headers: response.headers,
  });
};

export const config = {
  path: "/*",
};
