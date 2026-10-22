<script>
  // Steward view of community applications at /apply/admin: same password
  // and session as /services/admin. Read, filter, mark a status, export.
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { LABELS, SECTIONS, answer } from './questions.js';

  const STATUS_LABELS = { new: 'New', reviewing: 'Reviewing', accepted: 'Accepted', declined: 'Declined' };

  let authed = $state(null); // null = checking
  let password = $state('');
  let apps = $state([]);
  let selectedId = $state(new URLSearchParams(location.search).get('id') ?? '');
  let status = $state('all');
  let visit = $state('all');
  let query = $state('');
  let msg = $state(null); // { kind, text }
  let busy = $state(false);
  let note = $state('');
  let author = $state(stored('lv-apply-author'));

  function stored(key) {
    try {
      return localStorage.getItem(key) ?? '';
    } catch {
      return '';
    }
  }

  const byStatus = (s) => apps.filter((a) => s === 'all' || (a.status ?? 'new') === s);
  const shown = $derived(
    byStatus(status).filter((a) => {
      if (visit !== 'all' && a.visit !== visit) return false;
      const q = query.trim().toLowerCase();
      return !q || [a.name, a.email, a.location].some((v) => v?.toLowerCase().includes(q));
    })
  );
  const selected = $derived(apps.find((a) => a.id === selectedId) ?? null);

  async function call(path, body) {
    const res = await fetch(`/api/apply/admin${path}`, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function flash(kind, text) {
    msg = { kind, text };
    setTimeout(() => msg?.text === text && (msg = null), 4000);
  }

  async function load() {
    try {
      apps = (await call('')).applications;
      authed = true;
    } catch (e) {
      if (e.status === 401) authed = false;
      else flash('error', e.message);
    }
  }

  async function login(e) {
    e.preventDefault();
    busy = true;
    try {
      await call('/login', { password });
      password = '';
      await load();
    } catch (err) {
      flash('error', err.message);
    } finally {
      busy = false;
    }
  }

  async function logout() {
    await call('/logout', {}).catch(() => {});
    authed = false;
    apps = [];
  }

  function select(id) {
    selectedId = id;
    note = '';
    history.replaceState(null, '', id ? `/apply/admin?id=${encodeURIComponent(id)}` : '/apply/admin');
    if (id && window.innerWidth < 900) document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function setStatus(app, next) {
    const prev = app.status;
    app.status = next;
    try {
      await call('/status', { id: app.id, status: next });
    } catch (e) {
      app.status = prev;
      flash('error', e.message);
    }
  }

  async function addComment(e, app) {
    e.preventDefault();
    if (!note.trim()) return;
    busy = true;
    try {
      const { comment } = await call('/comment', { id: app.id, text: note, author });
      app.comments = [...(app.comments ?? []), comment];
      note = '';
      try {
        localStorage.setItem('lv-apply-author', author);
      } catch {}
    } catch (err) {
      flash('error', err.message);
    } finally {
      busy = false;
    }
  }

  async function removeComment(app, c) {
    if (!confirm('Delete this comment?')) return;
    try {
      await call('/delete-comment', { id: app.id, commentId: c.id });
      app.comments = app.comments.filter((x) => x.id !== c.id);
    } catch (err) {
      flash('error', err.message);
    }
  }

  const when = (at) => new Date(at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  async function sync(app) {
    busy = true;
    try {
      app.holons = (await call('/sync', { id: app.id })).holons;
      flash('success', 'Saved to Holons.');
    } catch (e) {
      flash('error', e.message);
      await load();
    } finally {
      busy = false;
    }
  }

  async function remove(app) {
    if (!confirm(`Delete ${app.name}’s application for good?`)) return;
    try {
      await call('/delete', { id: app.id });
      apps = apps.filter((a) => a.id !== app.id);
      select('');
      flash('success', 'Application deleted.');
    } catch (e) {
      flash('error', e.message);
    }
  }

  function exportCsv() {
    const keys = SECTIONS.flatMap((s) => s.keys);
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Applied', 'Status', ...keys.map((k) => LABELS[k])],
      ...shown.map((a) => [a.at, STATUS_LABELS[a.status ?? 'new'], ...keys.map((k) => answer(a, k))]),
    ];
    const blob = new Blob([rows.map((r) => r.map(cell).join(',')).join('\n')], { type: 'text/csv' });
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `liminal-applications-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const fmt = (d, opts) => new Date(d).toLocaleDateString('en-GB', opts);
  const applied = (at) => fmt(at, { day: 'numeric', month: 'short', year: 'numeric' });
  const stay = (a) =>
    a.visit === 'remote' ? 'Remote' : a.arrival ? `${fmt(a.arrival, { day: 'numeric', month: 'short' })} – ${a.departure ? fmt(a.departure, { day: 'numeric', month: 'short' }) : '?'}` : a.visit === 'unsure' ? 'Not sure yet' : 'In person';

  onMount(() => {
    document.title = 'Applications · Liminal Village';
    load();
  });
</script>

<nav class="nav">
  <div class="wrap navin">
    <a href="/" class="brand">Liminal Village</a>
    <div class="links">
      <a href="/services/admin">Services admin</a>
      <a href="/apply/admin" class="active" aria-current="page">Applications</a>
      {#if authed}<button class="out" onclick={logout}>Sign out</button>{/if}
    </div>
  </div>
</nav>

<main class="wrap page">
  {#if msg}
    <p class="notice {msg.kind} toast" transition:fade>{msg.text}</p>
  {/if}

  {#if authed === null}
    <p class="muted">Loading…</p>
  {:else if !authed}
    <form class="card login" onsubmit={login}>
      <p class="eyebrow">Stewards</p>
      <h1 class="display">Applications</h1>
      <div class="field">
        <label for="pw">Admin password</label>
        <input id="pw" type="password" bind:value={password} autocomplete="current-password" required />
      </div>
      <button class="btn gold block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <p class="muted small">The same password as the services admin.</p>
    </form>
  {:else}
    <header class="head">
      <div>
        <p class="eyebrow">Stewards</p>
        <h1 class="display">Applications</h1>
      </div>
      <div class="head-actions">
        <button class="btn ghost small" onclick={load}>Refresh</button>
        <button class="btn ghost small" onclick={exportCsv} disabled={!shown.length}>Export CSV</button>
      </div>
    </header>

    <div class="filters">
      <div class="tabs" role="tablist" aria-label="Status">
        {#each ['all', ...Object.keys(STATUS_LABELS)] as s}
          <button role="tab" aria-selected={status === s} class:on={status === s} onclick={() => (status = s)}>
            {s === 'all' ? 'All' : STATUS_LABELS[s]} <span>{byStatus(s).length}</span>
          </button>
        {/each}
      </div>
      <select bind:value={visit} aria-label="Visit">
        <option value="all">Any visit</option>
        <option value="visit">In person</option>
        <option value="unsure">Not sure yet</option>
        <option value="remote">Remote only</option>
      </select>
      <input type="search" placeholder="Search name, e-mail, place…" bind:value={query} aria-label="Search" />
    </div>

    <div class="split" class:has-detail={!!selected}>
      <ul class="list">
        {#each shown as a (a.id)}
          <li>
            <button class="item" class:sel={a.id === selectedId} onclick={() => select(a.id)}>
              <span class="who">
                <strong>{a.name}</strong>
                <span class="muted">{a.location}</span>
              </span>
              <span class="meta">
                <span class="badge s-{a.status ?? 'new'}">{STATUS_LABELS[a.status ?? 'new']}</span>
                <span class="muted">{stay(a)}</span>
                {#if a.comments?.length}<span class="muted" title="Steward comments">💬 {a.comments.length}</span>{/if}
                <span class="muted small">{applied(a.at)}</span>
              </span>
            </button>
          </li>
        {:else}
          <li class="empty muted">{apps.length ? 'No applications match these filters.' : 'No applications yet.'}</li>
        {/each}
      </ul>

      {#if selected}
        <article class="card detail" id="detail">
          <header class="dhead">
            <div>
              <h2 class="display">{selected.name}</h2>
              <p class="muted">
                <a href="mailto:{selected.email}">{selected.email}</a> · applied {applied(selected.at)}
              </p>
            </div>
            <button class="close" onclick={() => select('')} aria-label="Close">×</button>
          </header>

          <p class="holons" class:ok={selected.holons?.syncedAt}>
            {#if selected.holons?.syncedAt}
              ✓ Sealed in the village holon’s <code>applications</code> lens
            {:else}
              Not in Holons yet{#if selected.holons?.error} — {selected.holons.error}{/if}
              <button class="btn ghost small" onclick={() => sync(selected)} disabled={busy}>Retry</button>
            {/if}
          </p>

          <div class="statuses" role="radiogroup" aria-label="Status">
            {#each Object.entries(STATUS_LABELS) as [value, label]}
              <button role="radio" aria-checked={(selected.status ?? 'new') === value} class="badge s-{value}" class:on={(selected.status ?? 'new') === value} onclick={() => setStatus(selected, value)}>{label}</button>
            {/each}
          </div>

          {#each SECTIONS as sec}
            {@const rows = sec.keys.map((k) => [k, answer(selected, k)]).filter(([, v]) => v)}
            {#if rows.length}
              <section>
                <h3 class="eyebrow">{sec.title}</h3>
                <dl>
                  {#each rows as [k, v]}
                    <dt>{LABELS[k]}</dt>
                    <dd>{v}</dd>
                  {/each}
                </dl>
              </section>
            {/if}
          {/each}

          <section class="comments">
            <h3 class="eyebrow">Steward comments</h3>
            {#each selected.comments ?? [] as c (c.id)}
              <div class="comment">
                <p class="cmeta"><strong>{c.author || 'Steward'}</strong> · {when(c.at)}
                  <button class="cdel" onclick={() => removeComment(selected, c)} aria-label="Delete comment">Delete</button>
                </p>
                <p class="ctext">{c.text}</p>
              </div>
            {:else}
              <p class="muted small">No comments yet. Only stewards can see these.</p>
            {/each}
            <form class="cform" onsubmit={(e) => addComment(e, selected)}>
              <textarea rows="3" placeholder="Add a note for the other stewards…" bind:value={note} aria-label="Comment"></textarea>
              <div class="crow">
                <input placeholder="Your name" bind:value={author} aria-label="Your name" />
                <button class="btn small" disabled={busy || !note.trim()}>Add comment</button>
              </div>
            </form>
          </section>

          <footer class="dfoot">
            <a class="btn small" href="mailto:{selected.email}?subject={encodeURIComponent('Your application to Liminal Village')}">Reply by e-mail</a>
            <button class="btn danger small" onclick={() => remove(selected)}>Delete</button>
          </footer>
        </article>
      {/if}
    </div>
  {/if}
</main>

<style>
  .nav { position: sticky; top: 0; z-index: 20; background: rgba(250, 248, 245, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .navin { display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 16px; }
  .brand { font-size: 18px; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; color: var(--ink); white-space: nowrap; }
  .links { display: flex; align-items: center; gap: 22px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .links a, .out { color: var(--muted); transition: color 0.2s; white-space: nowrap; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .links a:hover, .links a.active, .out:hover { color: var(--gold-dark); }
  .small { font-size: 13px; }

  .page { padding-top: 32px; padding-bottom: 72px; position: relative; }
  .toast { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 30; box-shadow: var(--shadow); }
  .card { background: var(--card); border-radius: 20px; box-shadow: var(--shadow); padding: 24px; }
  .login { max-width: 380px; margin: 40px auto; display: grid; gap: 16px; }
  .login h1, .head h1 { font-size: 40px; }

  .head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .head-actions { display: flex; gap: 8px; }
  .filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 22px 0 18px; }
  .tabs { display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; border-radius: 999px; background: var(--card); box-shadow: var(--shadow); }
  .tabs button { padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--muted); }
  .tabs button span { font-weight: 500; opacity: 0.7; margin-left: 2px; }
  .tabs button.on { background: var(--ink); color: #fff; }
  .filters select, .filters input { padding: 9px 14px; border: 1px solid var(--line); border-radius: 999px; background: #fff; font-size: 14px; }
  .filters input { flex: 1; min-width: 200px; }

  .split { display: grid; gap: 18px; align-items: start; }
  .split.has-detail { grid-template-columns: minmax(280px, 380px) 1fr; }
  .list { list-style: none; display: grid; gap: 8px; }
  .item { width: 100%; display: grid; gap: 8px; text-align: left; padding: 14px 16px; border-radius: 14px; background: var(--card); box-shadow: var(--shadow); border: 1px solid transparent; transition: border-color 0.15s; }
  .item:hover { border-color: var(--gold-soft); }
  .item.sel { border-color: var(--gold); background: #fffaf2; }
  .who { display: grid; }
  .who strong { color: var(--ink); font-size: 15px; }
  .who .muted { font-size: 13px; }
  .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; font-size: 13px; }
  .meta .small { margin-left: auto; font-size: 12px; }
  .empty { padding: 24px; text-align: center; }

  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .s-new { background: var(--gold-soft); color: var(--gold-dark); }
  .s-reviewing { background: #e7eef7; color: #3d628f; }
  .s-accepted { background: var(--green-soft); color: var(--green); }
  .s-declined { background: #f3ebe9; color: #8a5a52; }

  .detail { position: sticky; top: 88px; max-height: calc(100vh - 108px); overflow: auto; display: grid; gap: 20px; }
  .dhead { display: flex; justify-content: space-between; gap: 12px; }
  .dhead h2 { font-size: 34px; }
  .dhead a { color: var(--gold-dark); font-weight: 600; }
  .close { font-size: 28px; line-height: 1; color: var(--muted); width: 36px; height: 36px; border-radius: 50%; }
  .close:hover { background: var(--gold-soft); }
  .statuses { display: flex; flex-wrap: wrap; gap: 6px; }
  .statuses .badge { padding: 6px 14px; font-size: 13px; opacity: 0.45; transition: opacity 0.15s; }
  .statuses .badge:hover { opacity: 0.8; }
  .statuses .badge.on { opacity: 1; box-shadow: inset 0 0 0 1.5px currentColor; }
  section { display: grid; gap: 8px; padding-top: 16px; border-top: 1px solid var(--line); }
  dl { display: grid; grid-template-columns: 170px 1fr; gap: 8px 16px; font-size: 14px; }
  dt { color: var(--muted); }
  dd { color: var(--ink); white-space: pre-wrap; overflow-wrap: anywhere; }
  .holons { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 13px; color: var(--danger); margin-top: -8px; }
  .holons.ok { color: var(--green); }
  .holons code { font-size: 12px; background: var(--green-soft); padding: 1px 6px; border-radius: 6px; }
  .comment { padding: 12px 14px; border-radius: 12px; background: #fffaf2; border: 1px solid var(--gold-soft); }
  .cmeta { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
  .cmeta strong { color: var(--ink); }
  .cdel { margin-left: auto; font-size: 12px; color: var(--muted); }
  .cdel:hover { color: var(--danger); }
  .ctext { font-size: 14px; color: var(--ink); white-space: pre-wrap; overflow-wrap: anywhere; margin-top: 4px; }
  .cform { display: grid; gap: 8px; }
  .cform textarea, .cform input { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: #fff; font-size: 14px; }
  .cform textarea { resize: vertical; }
  .cform textarea:focus, .cform input:focus { outline: none; border-color: var(--gold); }
  .crow { display: flex; gap: 8px; }
  .crow input { flex: 1; }
  .dfoot { display: flex; justify-content: space-between; gap: 8px; padding-top: 16px; border-top: 1px solid var(--line); }

  @media (max-width: 900px) {
    .split.has-detail { grid-template-columns: 1fr; }
    .detail { position: static; max-height: none; }
  }
  @media (max-width: 640px) {
    .wrap { padding: 0 16px; }
    .brand { font-size: 15px; letter-spacing: 3px; }
    .links a:not(.active) { display: none; }
    dl { grid-template-columns: 1fr; gap: 2px; }
    dd { margin-bottom: 8px; }
  }
</style>
