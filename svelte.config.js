import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

const config = {
  preprocess: preprocess(),
  kit: {
    target: '#svelte',
    adapter: vercel()
  }
};

export default config;
