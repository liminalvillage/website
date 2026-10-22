<script>
  import { tick } from 'svelte';
  import { fly, fade, slide } from 'svelte/transition';
  import Moon from './Moon.svelte';
  import {
    AGES,
    ROLES,
    VISIT,
    TRANSPORT,
    ACCOMMODATION,
    TASKS,
    CONTRIBUTIONS,
    missingFields,
    comesInPerson,
    hasSocials,
  } from './questions.js';

  const VIDEO_ID = 'XdhPXocPf9g';
  const DRAFT_KEY = 'lv-apply-draft';
  const BLANK = {
    email: '', name: '', location: '', x: '', linkedin: '', website: '', age: '',
    role: [], roleOther: '', intention: '', ikigai: '', background: '', community: '', wellbeing: '', referral: '',
    visit: '', arrival: '', departure: '', transport: [], transportOther: '', licence: '', accommodation: '',
    tasks: [], tasksOther: '', contribution: '', contributionOther: '', capacity: '', socials: '',
  };

  // Four steps, four phases: the moon fills as the application does.
  const STEPS = [
    { title: 'You', eyebrow: 'New moon · Arriving', lit: 0.25, intro: 'A few details so we know who you are and how to reach you.',
      keys: ['email', 'name', 'location', 'age'] },
    { title: 'Your story', eyebrow: 'Waxing · Getting to know you', lit: 0.5, intro: 'What draws you here, and what you bring with you.',
      keys: ['role', 'roleOther', 'intention', 'community', 'wellbeing'] },
    { title: 'Lunation', eyebrow: 'Gibbous · Coming to the village', lit: 0.75, intro: 'Whether you’d like to join us in person, and when.',
      keys: ['visit', 'arrival', 'departure', 'licence'] },
    { title: 'Contribution', eyebrow: 'Full moon · Giving and receiving', lit: 1, intro: 'How you’d like to take part in village life.',
      keys: ['tasks', 'contribution', 'contributionOther', 'capacity', 'socials'] },
  ];

  const ERRORS = {
    email: 'Please enter a valid e-mail address.',
    departure: 'Please choose a departure date on or after your arrival.',
    tasks: 'Choose at least one, or describe your “Other”.',
  };

  let stage = $state('intro'); // intro → form → done
  let step = $state(0);
  let a = $state(loadDraft());
  let tried = $state([false, false, false, false]);
  let sending = $state(false);
  let sendError = $state('');
  let company = $state(''); // honeypot
  const hasDraft = Object.values(a).some((v) => (Array.isArray(v) ? v.length : v));

  const missing = $derived(missingFields(a));
  const stepMissing = $derived(missing.filter((k) => STEPS[step].keys.includes(k)));
  const showError = (key) => tried[step] && stepMissing.includes(key);
  const inPerson = $derived(comesInPerson(a));
  const nights = $derived(
    a.arrival && a.departure && a.departure > a.arrival
      ? Math.round((new Date(a.departure) - new Date(a.arrival)) / 86_400_000)
      : 0
  );
  const today = new Date().toISOString().slice(0, 10);

  function loadDraft() {
    try {
      const draft = { ...BLANK, ...JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') };
      if (!Array.isArray(draft.role)) draft.role = draft.role ? [draft.role] : []; // drafts from when role was single-choice
      return draft;
    } catch {
      return { ...BLANK };
    }
  }

  $effect(() => {
    const snapshot = JSON.stringify(a);
    if (stage === 'done') return;
    try {
      localStorage.setItem(DRAFT_KEY, snapshot);
    } catch {}
  });

  function toggle(list, value) {
    a[list] = a[list].includes(value) ? a[list].filter((v) => v !== value) : [...a[list], value];
  }

  async function go(to) {
    if (to === 'intro') stage = 'intro';
    else if (to === 'form') stage = 'form';
    else step = to;
    await tick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function focusFirstMissing() {
    await tick();
    const el = document.getElementById(`q-${stepMissing[0]}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.querySelector('input, textarea, button')?.focus({ preventScroll: true });
  }

  async function next() {
    tried[step] = true;
    if (stepMissing.length) return focusFirstMissing();
    if (step < STEPS.length - 1) return go(step + 1);
    await submit();
  }

  async function submit() {
    sending = true;
    sendError = '';
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...a, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      stage = 'done';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      sendError = e.message;
    } finally {
      sending = false;
    }
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
</script>

{#snippet error(key)}
  {#if showError(key)}
    <p class="err" transition:slide={{ duration: 180 }}>{ERRORS[key] ?? 'This one is required.'}</p>
  {/if}
{/snippet}

{#snippet text(key, label, { required = false, type = 'text', placeholder = '', hint = '', autocomplete = 'off' } = {})}
  <div class="q" class:invalid={showError(key)} id="q-{key}">
    <label for="f-{key}">{label}{#if required}<span class="req" aria-hidden="true">*</span>{/if}</label>
    {#if hint}<p class="hint">{hint}</p>{/if}
    <input id="f-{key}" {type} {placeholder} {autocomplete} bind:value={a[key]} aria-required={required} aria-invalid={showError(key)} />
    {@render error(key)}
  </div>
{/snippet}

{#snippet long(key, label, { required = false, placeholder = '', hint = '' } = {})}
  <div class="q" class:invalid={showError(key)} id="q-{key}">
    <label for="f-{key}">{label}{#if required}<span class="req" aria-hidden="true">*</span>{/if}</label>
    {#if hint}<p class="hint">{hint}</p>{/if}
    <textarea id="f-{key}" rows="4" {placeholder} bind:value={a[key]} aria-required={required} aria-invalid={showError(key)}></textarea>
    {@render error(key)}
  </div>
{/snippet}

<nav class="nav">
  <div class="wrap navin">
    <a href="/" class="brand">Liminal Village</a>
    {#if stage === 'form'}
      <span class="stepcount">Step {step + 1} of {STEPS.length}</span>
    {:else}
      <div class="links">
        <a href="/dna">Our DNA</a>
        <a href="/lunations">Lunations</a>
        <a href="/apply" class="active" aria-current="page">Apply</a>
      </div>
    {/if}
  </div>
</nav>

{#if stage === 'intro'}
  <div in:fade={{ duration: 300 }}>
    <header class="hero">
      <div class="hero-img" aria-hidden="true"></div>
      <div class="wrap hero-in">
        <p class="eyebrow">Community application</p>
        <h1 class="display">Join Liminal Village</h1>
        <p class="lead">
          A community for regeneration, co-creation, shared stewardship and integral development — in the hills of
          central Italy and across a growing regenerative network.
        </p>
        <div class="cta">
          <button class="btn gold" onclick={() => go('form')}>{hasDraft ? 'Continue my application' : 'Start my application'} →</button>
          <span class="muted small">About 10 minutes · your answers are saved as you go</span>
        </div>
      </div>
    </header>

    <main class="wrap intro">
      <section class="welcome">
        <h2 class="display">Welcome</h2>
        <p>
          We care about how people live together, how we relate to place, and how personal, local and global
          transformation can support one another.
        </p>
        <p>
          This application is for joining the Liminal Village community, whether remotely or through an in-person
          visit. If you come during a <a href="/lunations">lunation</a>, community life includes shared cleaning,
          cooking and practical duties during your stay and before departure — leaving the space as beautiful as you
          found it, or more regenerative.
        </p>
        <p>We review every application personally and will get back to you shortly.</p>
      </section>

      <div class="video">
        <iframe
          src="https://www.youtube-nocookie.com/embed/{VIDEO_ID}?rel=0&modestbranding=1"
          title="Liminal Village — 2030 Vision"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <ol class="journey" aria-label="The application, step by step">
        {#each STEPS as s, i}
          <li>
            <Moon lit={s.lit} size={44} />
            <span class="jn">0{i + 1}</span>
            <strong>{s.title}</strong>
            <span class="muted">{s.intro}</span>
          </li>
        {/each}
      </ol>

      <div class="cta center">
        <button class="btn gold" onclick={() => go('form')}>{hasDraft ? 'Continue my application' : 'Start my application'} →</button>
      </div>
    </main>
  </div>
{:else if stage === 'form'}
  <nav class="progress" aria-label="Application steps">
    <div class="wrap progress-in">
      {#each STEPS as s, i}
        <button
          class="pstep"
          class:on={i === step}
          class:done={i < step}
          disabled={i > step}
          onclick={() => go(i)}
          aria-current={i === step ? 'step' : undefined}
        >
          <Moon lit={i <= step ? s.lit : 0} size={26} />
          <span>{s.title}</span>
        </button>
        {#if i < STEPS.length - 1}<span class="pline" class:done={i < step}></span>{/if}
      {/each}
    </div>
  </nav>

  <main class="wrap form">
    {#key step}
      <section class="step" in:fly={{ y: 16, duration: 380, delay: 80 }}>
        <header class="step-head">
          <p class="eyebrow">0{step + 1} · {STEPS[step].eyebrow}</p>
          <h1 class="display">{STEPS[step].title}</h1>
          <p class="muted">{STEPS[step].intro}</p>
        </header>

        {#if step === 0}
          <div class="card">
            <div class="grid2">
              {@render text('name', 'What’s your name?', { required: true, autocomplete: 'name' })}
              {@render text('email', 'E-mail', { required: true, type: 'email', autocomplete: 'email', placeholder: 'you@example.com' })}
            </div>
            {@render text('location', 'Where are you currently located?', { required: true, placeholder: 'City, country', autocomplete: 'address-level2' })}
            <div class="q" class:invalid={showError('age')} id="q-age">
              <span class="lbl">Your age range<span class="req" aria-hidden="true">*</span></span>
              <div class="pills" role="radiogroup" aria-label="Age range">
                {#each AGES as age}
                  <button type="button" role="radio" aria-checked={a.age === age} class="pill" class:sel={a.age === age} onclick={() => (a.age = age)}>{age}</button>
                {/each}
              </div>
              {@render error('age')}
            </div>
          </div>

          <div class="card">
            <p class="card-title">Where can we find you online? <span class="muted">Optional</span></p>
            <div class="grid3">
              {@render text('x', 'X', { placeholder: '@handle' })}
              {@render text('linkedin', 'LinkedIn', { placeholder: 'linkedin.com/in/…' })}
              {@render text('website', 'Other socials or website', { placeholder: 'https://…' })}
            </div>
          </div>
        {:else if step === 1}
          <div class="card">
            <div class="q" class:invalid={showError('role')} id="q-role">
              <span class="lbl">What roles do you have, or could imagine for yourself, within a regenerative network?<span class="req" aria-hidden="true">*</span> <span class="muted">Choose any</span></span>
              <div class="tiles" role="group" aria-label="Roles">
                {#each ROLES as r}
                  <button type="button" role="checkbox" aria-checked={a.role.includes(r.value)} class="tile" class:sel={a.role.includes(r.value)} onclick={() => toggle('role', r.value)}>
                    <strong>{r.label}</strong>
                    <span>{r.hint}</span>
                  </button>
                {/each}
              </div>
              {@render error('role')}
            </div>
            {#if a.role.includes('Other')}
              <div class="sub" transition:slide={{ duration: 220 }}>
                {@render text('roleOther', 'Please specify', { required: true })}
              </div>
            {/if}
          </div>

          <div class="card">
            {@render long('intention', 'What is your intention for visiting?', { required: true })}
            {@render long('ikigai', 'Tell us something about yourself. What is your Ikigai?', {
              hint: 'What you love, what you’re good at, what the world needs — e.g. healer, leader, facilitator, coach, community organizer, performer, artist…',
            })}
            {@render long('background', 'Any background you would like to share with us?')}
          </div>

          <div class="card">
            {@render long('community', 'Do you have any experience living in (intentional) communities, cohousing or ecovillages?', {
              required: true,
              hint: 'Which ones? Tell us something about your experiences — “none yet” is a fine answer too.',
            })}
            {@render long('wellbeing', 'Do you have any current wellbeing conditions (physical, emotional or psychological) we should be aware of?', {
              required: true,
              hint: 'So we can make sure your stay is appropriate and safe for you. Shared only with the people reviewing your application.',
            })}
            {@render long('referral', 'Has someone referred you to Liminal Village?', {
              hint: 'List anyone in our community who is referring you, and whether they have been here in person.',
            })}
          </div>
        {:else if step === 2}
          <div class="card">
            <div class="q" class:invalid={showError('visit')} id="q-visit">
              <span class="lbl">Do you wish to visit Liminal Village in person during a lunation?<span class="req" aria-hidden="true">*</span></span>
              <div class="tiles three" role="radiogroup" aria-label="Visit in person">
                {#each VISIT as v}
                  <button type="button" role="radio" aria-checked={a.visit === v.value} class="tile big" class:sel={a.visit === v.value} onclick={() => (a.visit = v.value)}>
                    <span class="ico" aria-hidden="true">{v.icon}</span>
                    <strong>{v.label}</strong>
                  </button>
                {/each}
              </div>
              {@render error('visit')}
            </div>
          </div>

          {#if a.visit === 'remote'}
            <div class="card soft" transition:slide={{ duration: 260 }}>
              <p>
                Lovely — you can be part of the community from wherever you are. Once we’ve read your application
                we’ll connect you with the network online. You can skip ahead to <strong>Contribution</strong>.
              </p>
            </div>
          {:else if inPerson}
            <div transition:slide={{ duration: 300 }}>
              <div class="card">
                <p class="card-title">When would you like to come?</p>
                <p class="hint">
                  Share your first ideas so we can see if we can host you then — otherwise we’ll get in touch to find
                  other dates. Guests often arrive around the new moon: see the <a href="/lunations" target="_blank" rel="noopener">village’s lunar calendar</a>.
                </p>
                <div class="grid2">
                  <div class="q" class:invalid={showError('arrival')} id="q-arrival">
                    <label for="f-arrival">Arrival<span class="req" aria-hidden="true">*</span></label>
                    <input id="f-arrival" type="date" min={today} bind:value={a.arrival} aria-required="true" />
                    {@render error('arrival')}
                  </div>
                  <div class="q" class:invalid={showError('departure')} id="q-departure">
                    <label for="f-departure">Expected departure<span class="req" aria-hidden="true">*</span></label>
                    <input id="f-departure" type="date" min={a.arrival || today} bind:value={a.departure} aria-required="true" />
                    {@render error('departure')}
                  </div>
                </div>
                {#if nights}
                  <p class="stay" transition:fade>
                    <Moon lit={Math.min(1, nights / 29.5)} size={20} />
                    {fmtDate(a.arrival)} → {fmtDate(a.departure)} · {nights} night{nights === 1 ? '' : 's'}
                    {#if nights >= 28}<span class="chip">A full lunation</span>{/if}
                  </p>
                {/if}
              </div>

              <div class="card">
                <div class="q">
                  <span class="lbl">How will you reach Liminal Village? <span class="muted">Choose any</span></span>
                  <div class="pills">
                    {#each TRANSPORT as t}
                      <button type="button" role="checkbox" aria-checked={a.transport.includes(t.value)} class="pill" class:sel={a.transport.includes(t.value)} onclick={() => toggle('transport', t.value)}>
                        <span aria-hidden="true">{t.icon}</span> {t.value}
                      </button>
                    {/each}
                  </div>
                </div>
                {#if a.transport.includes('Other')}
                  <div class="sub" transition:slide={{ duration: 220 }}>
                    {@render text('transportOther', 'Other transport')}
                  </div>
                {/if}

                <div class="q" class:invalid={showError('licence')} id="q-licence">
                  <span class="lbl">Do you have an (international) driver’s licence?<span class="req" aria-hidden="true">*</span></span>
                  <div class="pills" role="radiogroup" aria-label="Driver’s licence">
                    {#each ['Yes', 'No'] as v}
                      <button type="button" role="radio" aria-checked={a.licence === v} class="pill wide" class:sel={a.licence === v} onclick={() => (a.licence = v)}>{v}</button>
                    {/each}
                  </div>
                  {@render error('licence')}
                </div>
              </div>

              <div class="card">
                <div class="q">
                  <span class="lbl">Where would you like to stay? <span class="muted">Optional</span></span>
                  <div class="tiles four" role="radiogroup" aria-label="Accommodation">
                    {#each ACCOMMODATION as o}
                      <button type="button" role="radio" aria-checked={a.accommodation === o.value} class="tile big" class:sel={a.accommodation === o.value} onclick={() => (a.accommodation = a.accommodation === o.value ? '' : o.value)}>
                        <span class="ico" aria-hidden="true">{o.icon}</span>
                        <strong>{o.value}</strong>
                      </button>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        {:else}
          <div class="card vision">
            <p class="card-title">Our vision</p>
            <p>
              Liminal Village is part of a growing local-global regenerative network working toward a new way of living —
              more connected, balanced and life-supporting. During your stay, we ask you to contribute in ways that
              nourish yourself, the community, the commons and the village projects, keeping needs and yields in balance
              across personal, local and global scales.
            </p>
            <ul class="facts">
              <li><Moon lit={1} size={22} /><span><strong>Volunteers</strong> stay at least one lunation (1 month), offering 20 hours a week.</span></li>
              <li><span class="fico" aria-hidden="true">🤝</span><span><strong>Shorter stays</strong> are asked for a financial contribution.</span></li>
              <li><span class="fico" aria-hidden="true">🍲</span><span><strong>Daily rhythm:</strong> everyone shares cooking, cleaning and recycling throughout their stay.</span></li>
            </ul>
            <p class="small">More in the <a href="https://docs.liminalvillage.com" target="_blank" rel="noopener">Contribution Guidelines</a>.</p>
          </div>

          <div class="card">
            <div class="q" class:invalid={showError('tasks')} id="q-tasks">
              <span class="lbl">Which roles or tasks would you like to be involved in?<span class="req" aria-hidden="true">*</span> <span class="muted">Choose any</span></span>
              <div class="tiles tasks">
                {#each TASKS as t}
                  <button type="button" role="checkbox" aria-checked={a.tasks.includes(t.value)} class="tile task" class:sel={a.tasks.includes(t.value)} onclick={() => toggle('tasks', t.value)}>
                    <span class="ico" aria-hidden="true">{t.icon}</span>
                    <strong>{t.value}</strong>
                    {#if t.hint}<span>{t.hint}</span>{/if}
                  </button>
                {/each}
              </div>
              {@render error('tasks')}
            </div>
            {#if a.tasks.includes('Other')}
              <div class="sub" transition:slide={{ duration: 220 }}>
                {@render text('tasksOther', 'Other role or task', { required: !a.tasks.some((t) => t !== 'Other') })}
              </div>
            {/if}
          </div>

          <div class="card">
            <div class="q" class:invalid={showError('contribution')} id="q-contribution">
              <span class="lbl">How would you prefer to contribute to the community?<span class="req" aria-hidden="true">*</span></span>
              <div class="rows" role="radiogroup" aria-label="Contribution">
                {#each CONTRIBUTIONS as c}
                  <button type="button" role="radio" aria-checked={a.contribution === c.value} class="row" class:sel={a.contribution === c.value} onclick={() => (a.contribution = c.value)}>
                    <span class="radio" aria-hidden="true"></span>
                    <span><strong>{c.label}</strong>{#if c.hint}<em>{c.hint}</em>{/if}</span>
                  </button>
                {/each}
              </div>
              {@render error('contribution')}
            </div>
            {#if a.contribution === 'Other'}
              <div class="sub" transition:slide={{ duration: 220 }}>
                {@render text('contributionOther', 'Please specify', { required: true })}
              </div>
            {/if}
          </div>

          <div class="card">
            {@render long('capacity', 'What is your capacity to contribute?', {
              required: true,
              hint: 'How many hours per week can you offer, and how many are you currently committed to in your regular work or other obligations?',
            })}
            {#if !hasSocials(a)}
              {@render long('socials', 'Please share any websites and social media profiles', {
                required: true,
                placeholder: 'Instagram, Facebook, LinkedIn, a personal site…',
              })}
            {/if}
          </div>

          <label class="hp" aria-hidden="true">Company <input tabindex="-1" autocomplete="off" bind:value={company} /></label>
        {/if}

        {#if tried[step] && stepMissing.length}
          <p class="notice error" transition:fade>Please complete all required fields before continuing.</p>
        {/if}
        {#if sendError}
          <p class="notice error" transition:fade>Couldn’t send your application: {sendError}</p>
        {/if}

        <div class="actions">
          <button class="btn ghost" onclick={() => (step === 0 ? go('intro') : go(step - 1))}>← Back</button>
          <button class="btn" class:gold={step === STEPS.length - 1} onclick={next} disabled={sending}>
            {#if step < STEPS.length - 1}Continue to {STEPS[step + 1].title} →{:else if sending}Sending…{:else}Submit application{/if}
          </button>
        </div>
        <p class="saved muted">Your answers are saved on this device until you submit.</p>
      </section>
    {/key}
  </main>
{:else}
  <main class="wrap thanks" in:fly={{ y: 20, duration: 500 }}>
    <div class="glow"><Moon lit={1} size={120} /></div>
    <p class="eyebrow">Application received</p>
    <h1 class="display">Thank you, {a.name.split(' ')[0]}</h1>
    <p class="lead">
      Your application has been received. We review every application personally and will get back to you shortly
      at <strong>{a.email}</strong>.
    </p>
    <div class="cta center">
      <a class="btn gold" href="/">Back to liminalvillage.com</a>
      <a class="btn ghost" href="/lunations">See the lunations</a>
    </div>
  </main>
{/if}

<footer class="foot">
  <div class="wrap">© Liminal Village · Ascoli Piceno, Italy · <a href="/">liminalvillage.com</a></div>
</footer>

<style>
  .nav { position: sticky; top: 0; z-index: 20; background: rgba(250, 248, 245, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .navin { display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 16px; }
  .brand { font-size: 18px; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; color: var(--ink); white-space: nowrap; }
  .links { display: flex; gap: 22px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .links a { color: var(--muted); transition: color 0.2s; }
  .links a:hover, .links a.active { color: var(--gold-dark); }
  .stepcount { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-dark); }
  .small { font-size: 13px; }
  a:not(.btn):not(.brand) { color: var(--gold-dark); }
  main a:not(.btn), .hint a, .vision a { font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }

  /* Intro */
  .hero { position: relative; padding: 96px 0 72px; color: #fff; overflow: hidden; isolation: isolate; }
  .hero-img {
    position: absolute; inset: 0; z-index: -1;
    background: linear-gradient(180deg, rgba(20, 16, 10, 0.25), rgba(20, 16, 10, 0.65)), url('/images/droneview.jpg') center / cover;
    animation: drift 30s var(--ease) infinite alternate;
  }
  @keyframes drift { to { transform: scale(1.08); } }
  .hero .eyebrow { color: #f3d7a8; }
  .hero h1 { color: #fff; font-size: clamp(44px, 7vw, 84px); font-weight: 400; margin: 12px 0 16px; }
  .hero .lead { font-size: 18px; max-width: 54ch; color: rgba(255, 255, 255, 0.9); }
  .hero .muted { color: rgba(255, 255, 255, 0.75); }
  .cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 28px; }
  .cta.center { justify-content: center; }

  .intro { max-width: 860px; }
  .intro > .video { margin-top: 40px; }
  .video { position: relative; aspect-ratio: 16 / 9; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lift); background: #1d1a15; }
  .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .welcome { margin: 48px auto 0; max-width: 62ch; display: grid; gap: 14px; font-size: 16px; }
  .welcome h2 { font-size: 38px; }
  .journey { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 48px 0 36px; }
  .journey li { display: grid; gap: 4px; justify-items: start; padding: 18px; border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); font-size: 13.5px; }
  .journey strong { font-family: var(--display); font-size: 22px; font-weight: 500; color: var(--ink); }
  .jn { margin-top: 8px; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: var(--gold-dark); }
  .intro > .cta { margin-bottom: 72px; }

  /* Progress */
  .progress { position: sticky; top: 68px; z-index: 15; background: rgba(250, 248, 245, 0.92); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .progress-in { display: flex; align-items: center; gap: 8px; height: 58px; max-width: 760px; }
  .pstep { display: inline-flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--muted); transition: color 0.2s, background 0.2s; }
  .pstep:disabled { cursor: default; opacity: 0.6; }
  .pstep.on { color: var(--ink); background: var(--gold-soft); }
  .pstep.done { color: var(--gold-dark); }
  .pstep.done:hover { background: var(--gold-soft); }
  .pline { flex: 1; height: 2px; border-radius: 2px; background: var(--line); transition: background 0.4s; }
  .pline.done { background: var(--gold); }

  /* Form */
  .form { max-width: 760px; padding-top: 36px; padding-bottom: 72px; }
  .step { display: grid; gap: 18px; }
  .step-head { margin-bottom: 6px; }
  .step-head h1 { font-size: clamp(40px, 5.5vw, 58px); margin: 8px 0 6px; }
  .step-head .muted { font-size: 16px; }
  .card { display: grid; gap: 22px; padding: 26px; border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }
  .card.soft { background: #fffaf2; box-shadow: inset 0 0 0 1px var(--gold-soft); font-size: 15.5px; }
  .card-title { font-family: var(--display); font-size: 24px; font-weight: 500; color: var(--ink); }
  .card-title .muted, .lbl .muted { font-family: var(--body); font-size: 12px; font-weight: 500; letter-spacing: 0.5px; margin-left: 4px; }
  .card-title + .hint { margin-top: -14px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

  .q { display: grid; gap: 8px; align-content: start; }
  .q > label, .lbl { font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.45; }
  .req { color: var(--gold); margin-left: 3px; }
  .hint { font-size: 13.5px; color: var(--muted); margin-top: -2px; }
  .q input, .q textarea {
    width: 100%; padding: 13px 15px; border: 1px solid var(--line); border-radius: 12px; background: #fffdfa; font-size: 15px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .q textarea { resize: vertical; min-height: 104px; line-height: 1.55; }
  .q input:focus, .q textarea:focus { outline: none; background: #fff; border-color: var(--gold); box-shadow: 0 0 0 4px rgba(214, 161, 91, 0.18); }
  .q.invalid input, .q.invalid textarea { border-color: #e2a79d; background: #fffaf9; }
  .err { font-size: 13px; color: var(--danger); font-weight: 500; }
  .sub { padding-left: 16px; border-left: 3px solid var(--gold); margin-top: -8px; }

  .pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .pill { min-height: 42px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: #fffdfa; font-size: 14px; font-weight: 500; color: var(--text); transition: all 0.18s var(--ease); }
  .pill.wide { min-width: 96px; }
  .pill:hover { border-color: var(--gold); }
  .pill.sel { background: var(--ink); border-color: var(--ink); color: #fff; }

  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .tiles.three { grid-template-columns: repeat(3, 1fr); }
  .tiles.four { grid-template-columns: repeat(4, 1fr); }
  .tiles.tasks { grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); }
  .tile {
    position: relative; display: grid; gap: 4px; align-content: start; text-align: left; padding: 14px 16px; border-radius: 14px;
    border: 1px solid var(--line); background: #fffdfa; font-size: 13px; color: var(--muted); line-height: 1.45;
    transition: border-color 0.18s, background 0.18s, transform 0.18s var(--ease), box-shadow 0.18s;
  }
  .tile strong { font-size: 14.5px; font-weight: 600; color: var(--ink); }
  .tile:hover { border-color: var(--gold); transform: translateY(-1px); }
  .tile.sel { border-color: var(--gold); background: #fff6e8; box-shadow: 0 0 0 3px rgba(214, 161, 91, 0.2); }
  .tile.sel::after {
    content: '✓'; position: absolute; top: 10px; right: 10px; width: 20px; height: 20px; border-radius: 50%;
    display: grid; place-items: center; background: var(--gold); color: #fff; font-size: 11px; font-weight: 700;
  }
  .tile.big { justify-items: center; text-align: center; padding: 20px 14px; gap: 8px; }
  .tile.task { padding: 14px; }
  .ico { font-size: 26px; line-height: 1; }
  .tile.task .ico { font-size: 22px; margin-bottom: 2px; }

  .rows { display: grid; gap: 8px; }
  .row { display: flex; align-items: center; gap: 14px; text-align: left; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--line); background: #fffdfa; transition: border-color 0.18s, background 0.18s; }
  .row strong { display: block; font-weight: 600; color: var(--ink); font-size: 14.5px; }
  .row em { display: block; font-style: normal; font-size: 13px; color: var(--muted); }
  .row:hover { border-color: var(--gold); }
  .row.sel { border-color: var(--gold); background: #fff6e8; }
  .radio { flex: none; width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--line); transition: all 0.18s; }
  .row.sel .radio { border-color: var(--gold); box-shadow: inset 0 0 0 4px #fff6e8; background: var(--gold); }

  .stay { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 14px; font-weight: 600; color: var(--ink); }

  .vision { background: linear-gradient(160deg, #fffaf2, #fff 60%); font-size: 15px; }
  .facts { list-style: none; display: grid; gap: 12px; }
  .facts li { display: flex; gap: 12px; align-items: flex-start; }
  .facts strong { color: var(--ink); }
  .fico { width: 22px; text-align: center; font-size: 18px; line-height: 1.3; }

  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
  .actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }
  .saved { font-size: 12px; text-align: center; }

  /* Done */
  .thanks { max-width: 640px; text-align: center; padding: 80px 24px 96px; display: grid; justify-items: center; gap: 14px; }
  .thanks h1 { font-size: clamp(42px, 6vw, 64px); }
  .thanks .lead { font-size: 17px; }
  .glow { margin-bottom: 18px; border-radius: 50%; animation: glow 4s ease-in-out infinite alternate; }
  @keyframes glow { from { box-shadow: 0 0 40px rgba(214, 161, 91, 0.25); } to { box-shadow: 0 0 90px rgba(214, 161, 91, 0.5); } }

  .foot { padding: 28px 0; border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); }

  @media (max-width: 760px) {
    .journey { grid-template-columns: 1fr 1fr; }
    .grid2, .grid3, .tiles.three { grid-template-columns: 1fr; }
    .tiles.four { grid-template-columns: 1fr 1fr; }
    .pstep span { display: none; }
    .pstep.on span { display: inline; }
  }
  @media (max-width: 640px) {
    .wrap { padding: 0 16px; }
    .brand { font-size: 15px; letter-spacing: 3px; }
    .links a:not(.active) { display: none; }
    .hero { padding: 64px 0 64px; }
    .hero .lead { font-size: 16px; }
    .card { padding: 20px 16px; border-radius: 16px; }
    .tiles.tasks { grid-template-columns: 1fr 1fr; }
    .actions .btn { padding: 0 16px; }
    .actions .btn:last-child { flex: 1; white-space: normal; }
  }
</style>
