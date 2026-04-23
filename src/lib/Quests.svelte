<script>
  import { onMount, onDestroy } from 'svelte';

  // Preset configs, selected at runtime from window.location.hostname
  // so a single built Quests page adapts to whichever domain serves it.
  const SITES = {
    casaselva: {
      holonId: '-1002964866719',
      brandName: 'Casa Selva',
      homeHref: '/',
      tagline: 'Casa Selva — living quests for inner work, stewardship, and regeneration',
      contactEmail: 'hello@casaselva.earth',
      heroImage: '/images/casaselva/1.jpeg',
      primary: '#b77a52',
      primaryDark: '#9c6542',
      accentLight: '#d69c7a',
    },
    liminal: {
      holonId: '-1003864542239',
      brandName: 'Liminal Village',
      homeHref: '/',
      tagline: 'ReGenerativa × Liminal Village — ongoing actions funded through collaborative effort',
      contactEmail: 'info@liminalvillage.com',
      heroImage: '/images/droneview.jpg',
      primary: '#D6A15B',
      primaryDark: '#b8873d',
      accentLight: '#e8c490',
    },
  };

  function detectSite() {
    if (typeof window === 'undefined') return SITES.liminal;
    const host = window.location.hostname.toLowerCase();
    if (host.includes('casaselva')) return SITES.casaselva;
    return SITES.liminal;
  }

  const detected = detectSite();

  // Props override detection (explicit > domain) for preview or overrides
  let {
    holonId = detected.holonId,
    brandName = detected.brandName,
    homeHref = detected.homeHref,
    tagline = detected.tagline,
    contactEmail = detected.contactEmail,
    heroImage = detected.heroImage,
    primary = detected.primary,
    primaryDark = detected.primaryDark,
    accentLight = detected.accentLight,
  } = $props();

  const HOLON_ID = holonId;
  const APP_NAME = 'Holons';

  if (typeof document !== 'undefined') {
    document.title = `Quests – ${brandName}`;
  }

  const TYPE_STYLES = {
    task:     { icon: 'fa-list-check',   color: primary },
    event:    { icon: 'fa-calendar-star', color: '#7B9E6B' },
    proposal: { icon: 'fa-lightbulb',    color: '#C27D4E' },
    request:  { icon: 'fa-hand-holding', color: '#8B6F5D' },
    offer:    { icon: 'fa-gift',         color: '#4a9d5f' },
    any:      { icon: 'fa-compass',      color: primary },
  };

  const STATUS_LABELS = {
    ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled',
    scheduled: 'Scheduled', active: 'Active',
  };

  const TELEGRAM_BOT = 'HolonsDevBot';

  let showBoard = $state(false);
  let quests = $state([]);
  let selectedQuestId = $state(null);
  let loading = $state(false);
  let saving = $state(false);
  let showLoginPrompt = $state(false);
  let pendingQuestId = $state(null);
  let telegramUser = $state(null);
  let raisedHands = $state(new Set());
  let holosphere = null;
  let subscription = null;

  // Derived: always get fresh quest data from the array
  let selectedQuest = $derived(selectedQuestId ? quests.find(q => String(q.id) === String(selectedQuestId)) || null : null);

  // Restore user from localStorage on load
  try {
    const stored = localStorage.getItem('telegramUser');
    if (stored) telegramUser = JSON.parse(stored);
  } catch {}

  // Telegram login callback (called by the widget)
  if (typeof window !== 'undefined') {
    window.onTelegramAuth = (user) => {
      telegramUser = user;
      localStorage.setItem('telegramUser', JSON.stringify(user));
      showLoginPrompt = false;
      // If there was a pending participation, proceed
      if (pendingQuestId) {
        raiseHand(pendingQuestId);
        pendingQuestId = null;
      }
    };
  }

  function logout() {
    telegramUser = null;
    localStorage.removeItem('telegramUser');
  }

  // Computed stats
  let totalBudget = $derived(quests.reduce((s, q) => s + q.total, 0));
  let totalParticipants = $derived(quests.reduce((s, q) => s + (q.team.current || q.participants.length || 0), 0));
  let totalNeeded = $derived(quests.reduce((s, q) => s + (q.team.needed || 0), 0));

  function parseArray(val) {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
    if (val && typeof val === 'object') {
      return Object.keys(val).filter(k => k !== '_' && k !== '#')
        .sort((a, b) => Number(a) - Number(b)).map(k => val[k]);
    }
    return [];
  }

  function normalizeQuest(raw) {
    const participants = parseArray(raw.participants);
    const typeStyle = TYPE_STYLES[raw.type] || TYPE_STYLES.any;
    return {
      id: raw.id,
      title: raw.title || 'Untitled Quest',
      icon: raw.icon || typeStyle.icon,
      color: raw.color || typeStyle.color,
      image: raw.image || raw.picture || '',
      shortDesc: raw.shortDesc || raw.description || '',
      fullDesc: raw.fullDesc || raw.description || '',
      skills: parseArray(raw.skills),
      duration: raw.duration || raw.when || '',
      tools: raw.tools || '',
      exchange: raw.exchange || '',
      type: raw.type || 'any',
      status: raw.status || 'ongoing',
      category: raw.category || '',
      progress: Number(raw.progress) || 0,
      team: raw.team
        ? (typeof raw.team === 'string' ? JSON.parse(raw.team) : raw.team)
        : { current: participants.length, needed: 0 },
      participants,
      budget: parseArray(raw.budget),
      total: Number(raw.total) || 0,
      date: raw.date || null,
      until: raw.until || '',
      initiator: raw.initiator,
      where: raw.where,
      _raw: raw,
    };
  }

  function getInfoItems(q) {
    const items = [];
    if (q.skills.length) items.push({ label: 'Skills needed', value: q.skills.join(', ') });
    if (q.duration) items.push({ label: 'Duration', value: q.duration });
    if (q.tools) items.push({ label: 'Tools & resources', value: q.tools });
    if (q.exchange) items.push({ label: 'Value exchange', value: q.exchange });
    if (q.type && q.type !== 'any') items.push({ label: 'Type', value: q.type.charAt(0).toUpperCase() + q.type.slice(1) });
    const sl = STATUS_LABELS[q.status] || q.status;
    if (sl) items.push({ label: 'Status', value: sl });
    if (q.category) items.push({ label: 'Category', value: q.category });
    if (q.until) items.push({ label: 'Until', value: q.until });
    if (q.where && (q.where.latitude || q.where.longitude)) items.push({ label: 'Location', value: `${q.where.latitude}, ${q.where.longitude}` });
    if (q.initiator && typeof q.initiator === 'string' && q.initiator) items.push({ label: 'Initiated by', value: q.initiator });
    return items;
  }

  function getParticipantNames(q) {
    return q.participants
      .filter(p => p && (p.name || p.first_name || typeof p === 'string'))
      .map(p => typeof p === 'string' ? p : (p.name || [p.first_name, p.last_name].filter(Boolean).join(' ')));
  }

  async function enterBoard() {
    showBoard = true;
    loading = true;

    try {
      holosphere = new HoloSphere(APP_NAME);
      await new Promise(r => setTimeout(r, 2500));

      const lensPath = APP_NAME + '/' + HOLON_ID + '/quests';
      const allKeys = await new Promise(resolve => {
        holosphere.gun.get(lensPath).once(data => {
          if (data) resolve(Object.keys(data).filter(k => k !== '_' && k !== '#'));
          else resolve([]);
        });
        setTimeout(() => resolve([]), 5000);
      });

      const results = await Promise.all(
        allKeys.map(key => holosphere.get(HOLON_ID, 'quests', key).catch(() => null))
      );

      const raw = results.filter(q => q && q.title);
      quests = raw
        .filter(q => q.status !== 'cancelled' && q.status !== 'completed')
        .map(normalizeQuest);

      // Subscribe for live updates (debounced)
      let updateTimer = null;
      const pendingUpdates = new Map();

      subscription = await holosphere.subscribe(HOLON_ID, 'quests', (data, key) => {
        if (!data || !key || key === '_' || key === '#') return;
        pendingUpdates.set(key, true);
        clearTimeout(updateTimer);
        updateTimer = setTimeout(async () => {
          for (const k of pendingUpdates.keys()) {
            try {
              const fullQuest = await holosphere.get(HOLON_ID, 'quests', k);
              if (!fullQuest || !fullQuest.title) continue;
              if (fullQuest.status === 'cancelled' || fullQuest.status === 'completed') {
                quests = quests.filter(q => String(q.id) !== String(k));
                continue;
              }
              const normalized = normalizeQuest(fullQuest);
              const idx = quests.findIndex(q => String(q.id) === String(normalized.id));
              if (idx !== -1) {
                quests[idx] = normalized;
                quests = quests; // trigger reactivity
              } else {
                quests = [...quests, normalized];
              }
            } catch {}
          }
          pendingUpdates.clear();
        }, 2000); // debounce 2s
      });
    } catch (err) {
      console.error('Failed to load from Holosphere:', err);
    }

    loading = false;
  }

  function requestParticipation(id) {
    if (raisedHands.has(id)) return;
    if (!telegramUser) {
      // Not logged in — show login prompt
      pendingQuestId = id;
      showLoginPrompt = true;
      return;
    }
    raiseHand(id);
  }

  async function raiseHand(id) {
    if (raisedHands.has(id) || saving || !telegramUser) return;
    saving = true;

    const q = quests.find(x => String(x.id) === String(id));
    if (!q) { saving = false; return; }

    const participant = {
      id: telegramUser.id,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name || '',
      username: telegramUser.username || '',
      date: Date.now(),
    };

    try {
      const saveData = q._raw ? { ...q._raw } : { ...q };
      delete saveData._raw;
      const newCurrent = (q.team.current || 0) + 1;
      if (saveData.team) saveData.team = { current: newCurrent, needed: q.team.needed };
      if (Array.isArray(saveData.participants)) {
        saveData.participants = [...saveData.participants, participant];
      } else {
        saveData.participants = [participant];
      }
      await holosphere.put(HOLON_ID, 'quests', saveData);

      // Update local state after successful save
      q.team.current = newCurrent;
      q.participants = [...q.participants, participant];
      quests = quests;
      raisedHands.add(id);
      raisedHands = raisedHands;
    } catch (err) {
      console.error('Failed to save:', err);
    }

    saving = false;
  }

  function askQuestion(id) {
    const q = quests.find(x => String(x.id) === String(id));
    if (q) {
      const subject = encodeURIComponent(`Question about quest: ${q.title}`);
      window.open(`mailto:${contactEmail}?subject=${subject}`, '_blank');
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') selectedQuestId = null;
  }

  function handleImageError(e) {
    e.target.style.display = 'none';
    e.target.nextElementSibling?.classList.remove('hidden');
  }

  onDestroy(() => {
    if (subscription?.unsubscribe) subscription.unsubscribe();
    if (holosphere?.close) holosphere.close();
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="quest-root"
  style="--q-primary: {primary}; --q-primary-dark: {primaryDark}; --q-accent-light: {accentLight}; --q-hero-image: url('{heroImage}');"
>
{#if !showBoard}
  <!-- Welcome Screen -->
  <div class="welcome">
    <div class="welcome-box">
      <h1>{brandName}</h1>
      <div class="subtitle">Quest Portal</div>
      <p>
        Every quest is a living invitation. A piece of work that needs hands, hearts, and minds.
        Browse what's active, find where your skills are needed, and step into the story.
      </p>
      <button class="btn-enter" onclick={() => enterBoard()}>I'm Ready</button>
    </div>
  </div>
{:else}
  <!-- Quest Board -->
  <nav class="quest-nav">
    <a href={homeHref}>{brandName}</a>
    <div class="nav-right">
      <span class="nav-link">
        Quests <span class="badge-count">{quests.length}</span>
      </span>
    </div>
  </nav>

  <div class="board-header">
    <h2>Active Quests</h2>
    <p>{tagline}</p>
  </div>

  <div class="stats-bar">
    <div class="stat">
      <div class="stat-value">{quests.length}</div>
      <div class="stat-label">Active Quests</div>
    </div>
    <div class="stat">
      <div class="stat-value">{totalBudget > 0 ? `€${totalBudget.toLocaleString('it-IT')}` : '-'}</div>
      <div class="stat-label">Total Budget</div>
    </div>
    <div class="stat">
      <div class="stat-value">{totalParticipants}</div>
      <div class="stat-label">Hands Raised</div>
    </div>
    <div class="stat">
      <div class="stat-value">{totalNeeded > 0 ? `${totalParticipants}/${totalNeeded}` : totalParticipants}</div>
      <div class="stat-label">Team Members</div>
    </div>
  </div>

  {#if loading}
    <p class="loading-msg">Loading quests from Holosphere...</p>
  {:else if quests.length === 0}
    <p class="loading-msg">No active quests found.</p>
  {:else}
    <div class="quest-grid">
      {#each quests as q (q.id)}
        {@const teamCurrent = q.team.current || q.participants.length || 0}
        {@const teamNeeded = q.team.needed || 0}
        {@const statusLabel = STATUS_LABELS[q.status] || q.status || ''}
        <div class="quest-card" onclick={() => selectedQuestId = q.id} role="button" tabindex="0">
          {#if q.image}
            <img class="hero-img" src={q.image} alt={q.title} onerror={handleImageError} />
            <div class="icon-hero hidden" style="background:{q.color}15">
              <i class="fas {q.icon}" style="color:{q.color}"></i>
            </div>
          {:else}
            <div class="icon-hero" style="background:{q.color}15">
              <i class="fas {q.icon}" style="color:{q.color}"></i>
            </div>
          {/if}
          <div class="card-body">
            <h3>{q.title}</h3>
            <p class="desc">{q.shortDesc}</p>
            {#if q.progress > 0}
              <div class="progress-wrap">
                <div class="progress-bar">
                  <div class="fill" style="width:{q.progress}%; background:{q.color}"></div>
                </div>
                <div class="progress-label">
                  <span>{q.progress}% complete</span>
                  <span>{q.duration}</span>
                </div>
              </div>
            {/if}
            <div class="card-meta">
              {#if q.total > 0}
                <span class="budget">€{q.total.toLocaleString('it-IT')}</span>
              {:else}
                <span class="budget muted">{statusLabel}</span>
              {/if}
              <span class="team">
                <i class="fas fa-user"></i> {teamCurrent}{teamNeeded > 0 ? `/${teamNeeded}` : ''}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <footer class="quest-footer">
    &copy; 2026 <a href={homeHref}>{brandName}</a>. Quest data powered by Holosphere.
  </footer>
{/if}

<!-- Detail Overlay -->
{#if selectedQuest}
  {@const q = selectedQuest}
  {@const infoItems = getInfoItems(q)}
  {@const participantNames = getParticipantNames(q)}
  {@const teamCurrent = q.team.current || q.participants.length || 0}
  {@const teamNeeded = q.team.needed || 0}
  {@const statusLabel = STATUS_LABELS[q.status] || q.status || ''}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="quest-detail active" onclick={(e) => { if (e.target === e.currentTarget) selectedQuestId = null; }} role="dialog">
    <div class="detail-card">
      {#if q.image}
        <img class="detail-hero" src={q.image} alt={q.title} onerror={handleImageError} />
        <div class="detail-icon-hero hidden" style="background:{q.color}15">
          <i class="fas {q.icon}" style="color:{q.color}"></i>
        </div>
      {:else}
        <div class="detail-icon-hero" style="background:{q.color}15">
          <i class="fas {q.icon}" style="color:{q.color}"></i>
        </div>
      {/if}
      <div class="detail-body">
        <button class="back-btn" onclick={() => selectedQuestId = null}>
          <i class="fas fa-arrow-left"></i> Back to quests
        </button>
        <h2>{q.title}</h2>
        <p class="detail-desc">{q.fullDesc}</p>

        {#if infoItems.length > 0}
          <div class="info-grid">
            {#each infoItems as item}
              <div class="info-item">
                <div class="label">{item.label}</div>
                <div class="value">{item.value}</div>
              </div>
            {/each}
          </div>
        {/if}

        {#if participantNames.length > 0}
          <div class="info-item" style="margin-bottom:1.5rem">
            <div class="label">Participants</div>
            <div class="value">{participantNames.join(', ')}</div>
          </div>
        {/if}

        {#if q.budget.length > 0}
          <table class="budget-table">
            <thead>
              <tr><th>Budget item</th><th style="text-align:right">Amount</th></tr>
            </thead>
            <tbody>
              {#each q.budget as item}
                <tr>
                  <td>{item.label || (Array.isArray(item) ? item[0] : '')}</td>
                  <td>€{Number(item.amount || (Array.isArray(item) ? item[1] : 0)).toLocaleString('it-IT')}</td>
                </tr>
              {/each}
              <tr><td>Totale</td><td>€{q.total.toLocaleString('it-IT')}</td></tr>
            </tbody>
          </table>
        {/if}

        <div class="progress-wrap" style="margin-bottom:2rem">
          <div class="progress-bar" style="height:6px">
            <div class="fill" style="width:{q.progress}%; background:{q.color}"></div>
          </div>
          <div class="progress-label">
            <span>{q.progress > 0 ? `${q.progress}% complete` : statusLabel}</span>
            <span>Team: {teamCurrent}{teamNeeded > 0 ? ` of ${teamNeeded} needed` : ` participant${teamCurrent !== 1 ? 's' : ''}`}</span>
          </div>
        </div>

        <div class="cta-section">
          <p>Interested in this quest? Raise your hand and the quest owner will reach out to you.</p>
          <button class="btn-ask" onclick={() => askQuestion(q.id)}>
            <i class="fas fa-comment"></i>&ensp;Ask a question
          </button>
          {#if raisedHands.has(String(q.id))}
            <button class="btn-raise-hand raised">
              <i class="fas fa-check"></i>&ensp;Hand raised!
            </button>
          {:else if saving}
            <button class="btn-raise-hand saving" disabled>
              <i class="fas fa-spinner fa-spin"></i>&ensp;Saving...
            </button>
          {:else}
            <button class="btn-raise-hand" onclick={() => requestParticipation(String(q.id))}>
              <i class="fas fa-hand"></i>&ensp;I'm in
            </button>
          {/if}
          {#if telegramUser}
            <div class="logged-in-as">
              <i class="fab fa-telegram"></i>
              {telegramUser.first_name}
              <button class="logout-btn" onclick={logout}>logout</button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Telegram Login Prompt -->
{#if showLoginPrompt}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="login-overlay" onclick={(e) => { if (e.target === e.currentTarget) { showLoginPrompt = false; pendingQuestId = null; } }} role="dialog">
    <div class="login-card">
      <button class="back-btn" onclick={() => { showLoginPrompt = false; pendingQuestId = null; }}>
        <i class="fas fa-times"></i> Close
      </button>
      <div class="login-icon">
        <i class="fab fa-telegram"></i>
      </div>
      <h3>Login with Telegram</h3>
      <p>To participate in this quest, please sign in with your Telegram account so we can add you to the team.</p>
      <div class="telegram-widget" id="telegram-login-container"></div>
      {#key showLoginPrompt}
        {@const _ = (() => {
          // Inject Telegram widget when prompt shows
          setTimeout(() => {
            const container = document.getElementById('telegram-login-container');
            if (!container || container.hasChildNodes()) return;
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-widget.js?22';
            script.setAttribute('data-telegram-login', TELEGRAM_BOT);
            script.setAttribute('data-size', 'large');
            script.setAttribute('data-radius', '6');
            script.setAttribute('data-onauth', 'onTelegramAuth(user)');
            script.setAttribute('data-request-access', 'write');
            script.async = true;
            container.appendChild(script);
          }, 50);
          return '';
        })()}
      {/key}
    </div>
  </div>
{/if}

</div>

<style>
  .hidden { display: none !important; }

  .welcome {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, rgba(34,34,34,0.7), rgba(214,161,91,0.3)),
      var(--q-hero-image) center/cover no-repeat fixed;
    padding: 2rem;
  }
  .welcome-box { max-width: 640px; animation: fadeInDown 1.2s ease; }
  .welcome h1 { color: #fff; font-size: 3rem; font-weight: 300; letter-spacing: 6px; margin-bottom: 0.5rem; }
  .welcome .subtitle { color: var(--q-accent-light); font-size: 1.1rem; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 2rem; font-weight: 300; }
  .welcome p { color: rgba(255,255,255,0.85); font-size: 1.05rem; line-height: 1.8; margin-bottom: 2.5rem; }
  .btn-enter { display: inline-block; padding: 16px 48px; border: 2px solid var(--q-primary); color: #fff; font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; letter-spacing: 4px; text-transform: uppercase; background: transparent; cursor: pointer; transition: all 0.4s ease; }
  .btn-enter:hover { background: var(--q-primary); color: #222; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }

  .quest-nav { position: sticky; top: 0; background: rgba(255,255,255,0.97); backdrop-filter: blur(10px); box-shadow: 0 2px 10px rgba(0,0,0,0.08); z-index: 100; padding: 0 3%; height: 70px; display: flex; align-items: center; justify-content: space-between; }
  .quest-nav a { color: #222; text-decoration: none; font-weight: 300; font-size: 20px; letter-spacing: 4px; transition: color 0.3s; }
  .quest-nav a:hover { color: var(--q-primary); }
  .nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .nav-link { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #222; }
  .badge-count { background: var(--q-primary); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 10px; margin-left: 6px; font-weight: 600; }

  .board-header { text-align: center; padding: 3rem 2rem 1rem; }
  .board-header h2 { font-size: 1.6rem; font-weight: 300; letter-spacing: 4px; color: #222; margin-bottom: 0.5rem; }
  .board-header p { color: #8a8274; font-size: 0.95rem; max-width: 600px; margin: 0 auto; }

  .stats-bar { display: flex; justify-content: center; gap: 2.5rem; padding: 1.5rem 2rem; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-value { font-size: 2rem; font-weight: 300; color: var(--q-primary); letter-spacing: 2px; }
  .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 3px; color: #8a8274; }

  .loading-msg { text-align: center; color: #8a8274; padding: 3rem; }

  .quest-grid { max-width: 1100px; margin: 0 auto; padding: 1rem 2rem 4rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }

  .quest-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.06); cursor: pointer; transition: all 0.35s ease; }
  .quest-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
  .quest-card .hero-img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .icon-hero { width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
  .card-body { padding: 1.25rem 1.5rem 1.5rem; }
  .quest-card h3 { font-size: 1rem; font-weight: 600; letter-spacing: 1px; color: #222; margin-bottom: 0.5rem; }
  .desc { font-size: 0.85rem; color: #8a8274; line-height: 1.6; margin-bottom: 1rem; }

  .progress-wrap { margin-bottom: 0.75rem; }
  .progress-bar { height: 4px; background: #eee; border-radius: 2px; overflow: hidden; }
  .fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
  .progress-label { display: flex; justify-content: space-between; font-size: 0.7rem; color: #8a8274; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }

  .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #8a8274; border-top: 1px solid #f0ede8; padding-top: 0.75rem; }
  .budget { font-weight: 600; color: var(--q-primary-dark); }
  .budget.muted { color: #8a8274; font-weight: 400; }
  .team { display: flex; align-items: center; gap: 4px; }

  .quest-detail { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); overflow-y: auto; animation: fadeIn 0.3s ease; display: flex; justify-content: center; padding: 2rem; }
  .detail-card { background: #fff; border-radius: 16px; max-width: 720px; width: 100%; margin: auto; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: slideInUp 0.4s ease; }
  .detail-hero { width: 100%; height: 240px; object-fit: cover; display: block; }
  .detail-icon-hero { width: 100%; height: 240px; display: flex; align-items: center; justify-content: center; font-size: 5rem; }
  .detail-body { padding: 2rem 2.5rem 2.5rem; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #8a8274; background: none; border: none; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.25rem; transition: color 0.3s; font-family: "Open Sans", sans-serif; }
  .back-btn:hover { color: var(--q-primary); }
  .detail-body h2 { font-size: 1.5rem; font-weight: 500; letter-spacing: 2px; margin-bottom: 1rem; color: #222; }
  .detail-desc { font-size: 0.95rem; color: #333; line-height: 1.9; margin-bottom: 2rem; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .info-item { background: #faf8f5; border-radius: 10px; padding: 1rem 1.25rem; }
  .label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: #8a8274; margin-bottom: 0.3rem; }
  .value { font-size: 0.9rem; color: #222; font-weight: 500; }

  .budget-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.85rem; }
  .budget-table th { text-align: left; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: #8a8274; padding: 0.5rem 0; border-bottom: 2px solid #eee; }
  .budget-table td { padding: 0.5rem 0; border-bottom: 1px solid #f0ede8; }
  .budget-table td:last-child { text-align: right; font-weight: 500; color: #222; }
  .budget-table tr:last-child td { border-bottom: none; font-weight: 700; color: var(--q-primary-dark); padding-top: 0.75rem; }

  .cta-section { text-align: center; padding-top: 1rem; border-top: 1px solid #f0ede8; }
  .cta-section p { font-size: 0.85rem; color: #8a8274; margin-bottom: 1rem; }
  .btn-ask { display: inline-block; padding: 14px 40px; border: 2px solid var(--q-primary); color: var(--q-primary-dark); font-family: "Open Sans", sans-serif; font-size: 0.85rem; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; background: transparent; cursor: pointer; transition: all 0.3s ease; border-radius: 6px; margin-right: 1rem; }
  .btn-ask:hover { background: var(--q-primary); color: #fff; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
  .btn-raise-hand { display: inline-block; padding: 14px 40px; border: 2px solid #4a9d5f; color: #4a9d5f; font-family: "Open Sans", sans-serif; font-size: 0.85rem; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; background: transparent; cursor: pointer; transition: all 0.3s ease; border-radius: 6px; }
  .btn-raise-hand:hover { background: #4a9d5f; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(74,157,95,0.25); }
  .btn-raise-hand.raised { background: #4a9d5f; color: #fff; cursor: default; }
  .btn-raise-hand.saving { border-color: #8a8274; color: #8a8274; cursor: wait; opacity: 0.7; }

  .logged-in-as { margin-top: 1rem; font-size: 0.8rem; color: #8a8274; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .logged-in-as i { color: #0088cc; font-size: 1rem; }
  .logout-btn { background: none; border: none; color: var(--q-primary); cursor: pointer; font-size: 0.75rem; text-decoration: underline; font-family: "Open Sans", sans-serif; }
  .logout-btn:hover { color: var(--q-primary-dark); }

  .login-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 2rem; animation: fadeIn 0.3s ease; }
  .login-card { background: #fff; border-radius: 16px; padding: 2.5rem; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: slideInUp 0.4s ease; }
  .login-icon { font-size: 3rem; color: #0088cc; margin-bottom: 1rem; }
  .login-card h3 { font-size: 1.2rem; font-weight: 500; letter-spacing: 2px; color: #222; margin-bottom: 0.75rem; }
  .login-card p { font-size: 0.9rem; color: #8a8274; line-height: 1.7; margin-bottom: 1.5rem; }
  .telegram-widget { display: flex; justify-content: center; min-height: 50px; }

  .quest-footer { background: #2c3e50; color: #bdc3c7; text-align: center; padding: 2rem; font-size: 0.9rem; }
  .quest-footer a { color: var(--q-accent-light); text-decoration: none; }
  .quest-footer a:hover { text-decoration: underline; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 768px) {
    .welcome h1 { font-size: 2rem; letter-spacing: 4px; }
    .welcome .subtitle { font-size: 0.85rem; }
    .quest-grid { grid-template-columns: 1fr; padding: 1rem; }
    .info-grid { grid-template-columns: 1fr; }
    .detail-body { padding: 1.5rem; }
    .stats-bar { gap: 1.5rem; }
    .quest-nav { height: 60px; }
    .quest-nav a { font-size: 16px; letter-spacing: 3px; }
    .cta-section .btn-ask, .cta-section .btn-raise-hand { display: block; width: 100%; margin: 0.5rem 0; }
  }
</style>
