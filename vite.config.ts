// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   // base: '/ZXEQzzg_Csy.github.io/',
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // GitHub Actions 构建时自动设置这个变量
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  
  return {
    base: isGitHubPages ? '/ZXEQzzg_Csy.github.io/' : '/',
    plugins: [react()],
  };
});
