# Quest sponsorship on Open Collective — operator howto

Each portal (Casa Selva, ReFactory, Liminal Village) maps to its own parent **Collective** on opencollective.com. When a visitor clicks **Sponsor this quest** on a quest detail page, a Netlify Function creates a **Project** nested under that portal's Collective, writes the resulting slug back to Holosphere, and opens the OC project page so the visitor can contribute.

This file walks you through the one-time setup. It assumes the code in this repo is already deployed.

---

## 1. Prepare the parent Collectives on Open Collective

For each portal you want to enable:

1. Sign in at https://opencollective.com.
2. Confirm a Collective exists for the portal (or create one and apply to a fiscal host).
3. Note its **slug** (the path segment in `https://opencollective.com/<slug>`). You will need three: one for Casa Selva, one for ReFactory, one for Liminal Village.
4. Make sure **one single OC user account** has admin on all three Collectives. (If your three Collectives are admined by different people, you'll need to either add a shared admin or run separate tokens — see Troubleshooting at the bottom.)

---

## 2. Create the Personal Token

Sign in as the user that admins all three Collectives, then:

1. Open **Settings → For developers → Personal Tokens** (or go to https://opencollective.com/applications).
2. Click **Create Personal Token**.
3. Name it something like `quest-portal-server`.
4. Select scope **`account`** (required — this is what `createProject` needs).
5. Optionally set an expiration date.
6. Copy the token string. You won't see it again.

---

## 3. Configure Netlify

In the Netlify dashboard for this site, go to **Site settings → Environment variables** and add:

| Key                              | Value                                                                              |
|----------------------------------|------------------------------------------------------------------------------------|
| `OPENCOLLECTIVE_PERSONAL_TOKEN`  | The token from step 2.                                                             |
| `OC_PARENT_SLUGS`                | Comma-separated allowlist of the parent slugs, e.g. `casa-selva,refactory,liminal-village`. |

The function refuses to create projects under any parent slug not in this allowlist, so the token can't be abused to create projects under arbitrary OC collectives.

Trigger a redeploy after saving env vars (the Functions runtime reads them at cold start).

---

## 4. Wire the slugs into the portals

Open `src/lib/Quests.svelte`. Near the top there's a `SITES` object with three portal presets. Fill in the `openCollectiveSlug` fields with the parent slugs from step 1:

```js
casaselva: { ..., openCollectiveSlug: 'casa-selva' },
refactory: { ..., openCollectiveSlug: 'refactory' },
liminal:   { ..., openCollectiveSlug: 'liminal-village' },
```

The slug values must match exactly what's in `OC_PARENT_SLUGS`.

> Portals where `openCollectiveSlug` is left empty simply hide the sponsor section — useful while you roll out one portal at a time.

Commit and push. Netlify will rebuild.

---

## 5. Verify locally before going live

Install the Netlify CLI once: `npm i -g netlify-cli`.

Run the site with functions wired up:

```bash
netlify dev
```

This serves the static site **and** the function at `http://localhost:8888/.netlify/functions/create-quest-project`.

Test the function in isolation against one of your parent collectives (use a throwaway `questId` first time):

```bash
curl -X POST http://localhost:8888/.netlify/functions/create-quest-project \
  -H 'Content-Type: application/json' \
  -d '{
    "parentSlug": "<one of your parent slugs>",
    "questId": "test-howto-1",
    "title": "Howto smoke test"
  }'
```

You should get back JSON like `{"slug":"casa-selva-test-howto-1","url":"https://opencollective.com/casa-selva-test-howto-1","created":true}`.

Run the same request a second time. The response should be identical but `"created": false` — this proves the read-before-create idempotency is working. Visit the URL: a Project page should be live under your parent Collective. (You can archive it from the OC UI when you're done testing.)

---

## 6. Verify the UX end-to-end

1. Open the deployed quests portal (or `localhost:8888` while running `netlify dev`).
2. Click into any quest detail.
3. You should see a **Sponsor this quest** button below the budget table and above the Telegram CTA.
4. Click it. The button shows a spinner; on success a new tab opens to the OC Project page.
5. Reload the quest detail. The button is now a direct **Contribute on Open Collective** link, and a small backers strip appears below it (showing "Be the first sponsor" until anyone contributes).

If you also have other clients connected to the same Holosphere holon (e.g., HolonsBot or another browser tab), they will pick up the new `openCollectiveSlug` field via the live subscription within a couple of seconds.

---

## 7. Day-to-day

- **New quests** automatically get a sponsor button as soon as they appear in Holosphere. No operator action needed; the OC Project is created lazily on first sponsor click.
- **Renaming a quest** does not rename its OC project (the slug is locked in once created). Edit the project name in the OC UI if needed.
- **Cancelled or completed quests** disappear from the portal but their OC projects remain — archive them from the OC UI when funding is no longer wanted.

---

## Troubleshooting

| Symptom                                                       | Likely cause                                                                                         |
|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Sponsor button shows error "OPENCOLLECTIVE_PERSONAL_TOKEN not configured" | Env var missing in Netlify, or function deployed before env was saved. Save env, redeploy.           |
| Error "parentSlug ... is not allowed"                         | The slug in `SITES` doesn't appear in `OC_PARENT_SLUGS`. Check both, exact match.                    |
| Error "OpenCollective createProject failed"                   | Token user is not admin of the parent Collective, or token scope is wrong. Re-issue with `account` scope under an admin user. |
| Sponsor button never appears                                  | `openCollectiveSlug` is empty for that portal. Set it in `src/lib/Quests.svelte`.                    |
| Different Collectives have different admins                   | Issue separate tokens per portal and split the function (or merge admins on OC). The current setup assumes one shared admin. |

To inspect function logs in production: Netlify dashboard → **Functions → create-quest-project → Logs**.
