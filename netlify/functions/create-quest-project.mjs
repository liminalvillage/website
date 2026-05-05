// Lazily creates an OpenCollective Project for a quest the first time someone
// clicks "Sponsor". Idempotent via a deterministic slug, so concurrent clicks
// converge on the same project.
//
// Required env:
//   OPENCOLLECTIVE_PERSONAL_TOKEN  Personal Token with `account` scope, owned
//                                  by an OC user that admins every parent slug.
//   OC_PARENT_SLUGS                Comma-separated allowlist of parent
//                                  Collective slugs that quests may be nested
//                                  under (e.g. "casa-selva,refactory,liminal-village").

const OC_GRAPHQL = 'https://api.opencollective.com/graphql/v2';

const CREATE_PROJECT = `
  mutation CreateProject(
    $project: ProjectCreateInput!
    $parent: AccountReferenceInput
    $disableContributions: Boolean!
    $disableExpenses: Boolean!
  ) {
    createProject(
      project: $project
      parent: $parent
      disableContributions: $disableContributions
      disableExpenses: $disableExpenses
    ) {
      slug
      name
    }
  }
`;

const GET_ACCOUNT = `
  query GetAccount($slug: String!) {
    account(slug: $slug) {
      slug
    }
  }
`;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

function makeSlug(parentSlug, questId) {
  const raw = `${parentSlug}-${questId}`
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // OC slugs must start with a letter; OC truncates around 60 chars.
  const prefixed = /^[a-z]/.test(raw) ? raw : `q-${raw}`;
  return prefixed.slice(0, 60).replace(/-+$/, '');
}

async function ocFetch(query, variables, token) {
  const res = await fetch(OC_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Personal-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

export default async (req) => {
  const origin = req.headers.get('origin') || '';

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' }, origin);
  }

  const token = process.env.OPENCOLLECTIVE_PERSONAL_TOKEN;
  if (!token) {
    return json(500, { error: 'OPENCOLLECTIVE_PERSONAL_TOKEN not configured' }, origin);
  }

  const allowlist = (process.env.OC_PARENT_SLUGS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  if (allowlist.length === 0) {
    return json(500, { error: 'OC_PARENT_SLUGS not configured' }, origin);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON' }, origin);
  }

  const { parentSlug, questId, title, description, tags } = payload || {};
  if (!parentSlug || !questId || !title) {
    return json(400, { error: 'parentSlug, questId, and title are required' }, origin);
  }
  if (!allowlist.includes(parentSlug)) {
    return json(400, { error: `parentSlug "${parentSlug}" is not allowed` }, origin);
  }

  const slug = makeSlug(parentSlug, String(questId));
  const url = `https://opencollective.com/${slug}`;

  // Read-before-create: if the project already exists, return it.
  const existing = await ocFetch(GET_ACCOUNT, { slug }, token);
  if (existing.status === 200 && existing.body?.data?.account?.slug) {
    return json(200, { slug, url, created: false }, origin);
  }

  const projectInput = {
    name: String(title).slice(0, 255),
    slug,
    description: typeof description === 'string' && description
      ? description.slice(0, 255)
      : `Sponsor the quest "${title}".`,
  };
  if (Array.isArray(tags) && tags.length) {
    projectInput.tags = tags.filter(t => typeof t === 'string').slice(0, 10);
  }

  const created = await ocFetch(CREATE_PROJECT, {
    project: projectInput,
    parent: { slug: parentSlug },
    disableContributions: false,
    disableExpenses: false,
  }, token);

  if (created.status === 200 && created.body?.data?.createProject?.slug) {
    return json(200, {
      slug: created.body.data.createProject.slug,
      url: `https://opencollective.com/${created.body.data.createProject.slug}`,
      created: true,
    }, origin);
  }

  // Race fallback: if another caller created it in between, the OC API errors
  // on slug uniqueness. Re-query and return the existing one.
  const errMsg = JSON.stringify(created.body?.errors || created.body || '');
  if (/slug.*(taken|already|exists|unique)/i.test(errMsg)) {
    const retry = await ocFetch(GET_ACCOUNT, { slug }, token);
    if (retry.status === 200 && retry.body?.data?.account?.slug) {
      return json(200, { slug, url, created: false }, origin);
    }
  }

  return json(502, {
    error: 'OpenCollective createProject failed',
    detail: created.body?.errors || created.body || null,
  }, origin);
};
