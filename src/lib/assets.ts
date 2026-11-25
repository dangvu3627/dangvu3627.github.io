import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** True when a root-relative path (e.g. /img/sam.jpg) exists in /public at build time. */
export function publicAssetExists(path: string): boolean {
  return existsSync(join(process.cwd(), 'public', path.replace(/^\//, '')));
}
