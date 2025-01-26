<script lang="ts">
	import type { PyramidState } from '$lib/types';

	let {
		pyramids = [],
		currentView = 'MAIN',
		onViewChange = (view: string) => {}
	} = $props<{
		pyramids: PyramidState[];
		currentView: string;
		onViewChange: (view: string) => void;
	}>();
</script>

{#snippet viewButton(view: string, color?: string)}
	<button
		class="rounded-lg bg-black/50 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
		onclick={() => onViewChange(view)}
		style:--pyramid-color={color ?? 'white'}
	>
		{view === 'MAIN' ? 'Main View' : `Pyramid ${view}`}
	</button>
{/snippet}

<div class="fixed left-4 top-4 z-50 flex flex-col gap-2">
	{@render viewButton('MAIN')}

	{#each pyramids as pyramid}
		{@render viewButton(pyramid.id, pyramid.color)}
	{/each}
</div>

<style lang="postcss">
	button {
		border: 1px solid color-mix(in srgb, var(--pyramid-color, white) 50%, transparent);
		min-width: 120px;
	}

	button:hover {
		border-color: var(--pyramid-color, white);
	}
</style>
