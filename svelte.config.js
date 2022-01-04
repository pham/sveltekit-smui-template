import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

const config = {
  preprocess: preprocess(),
  kit: {
    target: '#svelte',
    adapter: vercel(),
    vite: {
      ssr: {
        noExternal: [/^@material\//, /^@smui(?:-extra)?\//]
      }
    }
  }
};

export default config;
