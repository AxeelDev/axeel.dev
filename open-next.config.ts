import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Public content uses fresh, anonymous database reads. No R2/ISR cache is needed.
export default defineCloudflareConfig();
