// The one place that says which holons this website reads and where
// Holosphere lives. Shared by the pages (src/) and the Netlify functions
// (netlify/lib/holosphere.mjs re-exports it), so moving to the next
// lunation's holon is a one-line change here.

/** The village holon of the current lunation (lunation84): quests, calendar, services. */
export const VILLAGE_HOLON = '-1004438000774';

/** Each portal's holon, picked by hostname. Empty = not connected yet. */
export const PORTAL_HOLONS = {
  liminal: VILLAGE_HOLON,
  casaselva: '-1002964866719',
  refactory: '-1003943146280',
  regenerativa: '',
};

/** Holosphere v2 relays (HOLOSPHERE_RELAYS overrides them on the server). */
export const RELAYS = ['wss://relay.holons.io', 'wss://relay.commonshub.dev'];

/** Holosphere app namespace: records outside it are ignored. */
export const APP = 'Holons';

/** The Telegram bot people join quests and edit their profile with. */
export const BOT_USERNAME = 'HolonsBot';

/** The bot's HTTP server (pictures by Telegram file_id) and the dashboard (avatars, images). */
export const BOT_SERVER = 'https://telegram.holons.io';
export const DASHBOARD = 'https://dashboard.holons.io';

/** Which portal a hostname belongs to (liminalvillage.com and anything unknown → liminal). */
export function portalFor(hostname = '') {
  const host = hostname.toLowerCase();
  if (host.includes('casaselva')) return 'casaselva';
  if (host.includes('refactory') || host.includes('brickfactory')) return 'refactory';
  if (host.includes('regenerativa')) return 'regenerativa';
  return 'liminal';
}
