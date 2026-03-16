import { createClient } from '@insforge/sdk';

const INSFORGE_BASE_URL = 'https://kt3v6qud.eu-central.insforge.app';
const INSFORGE_API_KEY  = 'ik_392304fd164f8264acdf1373bd22d2c6';

export const insforge = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_API_KEY,
});

export { INSFORGE_BASE_URL, INSFORGE_API_KEY };
