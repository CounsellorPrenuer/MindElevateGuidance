import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';

process.env.GITHUB_PAGES = 'true';

const child = spawn(process.execPath, ['./node_modules/vite/bin/vite.js', 'build'], {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

child.on('exit', async (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
    return;
  }

  await fs.copyFile('./dist/index.html', './dist/404.html');
  process.exit(0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
