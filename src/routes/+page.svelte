<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import CameraControls from './CameraControls.svelte';
	import type { PyramidState } from '$lib/types';
	import { mockDataService } from '$lib/mockDataService';
	import { onMount } from 'svelte';

	let pyramidStates = $state<PyramidState[]>([]);
	let currentView = $state('MAIN');

	function handleViewChange(view: string) {
		currentView = view;
	}

	// Start mock data service
	onMount(() => {
		const unsubscribe = mockDataService.subscribe((newStates) => {
			pyramidStates = newStates;
		});
		mockDataService.start();
		return () => {
			mockDataService.stop();
			unsubscribe();
		};
	});
</script>

<div class="relative h-screen w-screen bg-gradient-to-b from-[#0d1320] to-[#080c15]">
	<Canvas>
		<Scene {pyramidStates} {currentView} />
	</Canvas>

	<CameraControls pyramids={pyramidStates} {currentView} onViewChange={handleViewChange} />
</div>

<style>
	:global(body) {
		margin: 0;
	}
</style>
