import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/events': {
				target: 'http://localhost:3002',
				changeOrigin: true,
				ws: true
			}
		}
	}
});
