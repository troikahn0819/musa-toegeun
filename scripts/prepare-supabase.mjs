import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const copies = [
  ['backend/functions', 'supabase/functions'],
  ['database/migrations', 'supabase/migrations'],
];

for (const [sourceRelative, targetRelative] of copies) {
  const source = resolve(root, sourceRelative);
  const target = resolve(root, targetRelative);
  if (!source.startsWith(root) || !target.startsWith(root)) throw new Error('Refusing to copy outside the project.');
  if (!existsSync(source)) throw new Error(`Missing source directory: ${sourceRelative}`);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
  console.log(`${sourceRelative} -> ${targetRelative}`);
}

