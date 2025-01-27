<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import CameraControls from './CameraControls.svelte';
	import type { PyramidState, PyramidStates } from '$lib/types';
	import { SSEService } from '$lib/sseService';
	import { onMount } from 'svelte';

	let pyramidStates = $state<PyramidStates>({});
	let currentView = $state('MAIN');
	let connectionState = $state<'connecting' | 'connected' | 'disconnected'>('disconnected');

	function handleViewChange(view: string) {
		currentView = view;
	}

	// Create SSE service
	const sseService = new SSEService();

	// Function to update pyramid states
	function updatePyramidStates(newStates: PyramidState[]) {
		const statesMap: PyramidStates = {};
		newStates.forEach((state) => {
			statesMap[state.id] = state;
		});
		pyramidStates = statesMap;
	}

	// Start SSE connection
	onMount(() => {
		sseService.onStateUpdate(updatePyramidStates);
		sseService.onConnectionChange((state) => {
			connectionState = state;
		});
		sseService.connect();

		return () => {
			sseService.disconnect();
		};
	});

	type ConnectionProps = {
		state: 'connecting' | 'connected' | 'disconnected';
	};
</script>

{#snippet connectionStatus(props: ConnectionProps)}
	<div class="connection-status {props.state}">
		{props.state === 'connecting' ? 'Connecting...' : 'Disconnected - Attempting to reconnect...'}
	</div>
{/snippet}

<div class="relative h-screen w-screen bg-gradient-to-b from-[#0d1320] to-[#080c15]">
	<!-- Connection status indicator -->
	{#if connectionState !== 'connected'}
		{@render connectionStatus({ state: connectionState })}
	{/if}

	<Canvas>
		<Scene {pyramidStates} {currentView} />
	</Canvas>

	<CameraControls pyramids={Object.values(pyramidStates)} {currentView} onViewChange={handleViewChange} />
</div>

<style lang="postcss">
	:global(body) {
		margin: 0;
	}

	.connection-status {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		z-index: 50;
		color: white;
		text-align: center;
	}

	.connecting {
		background-color: theme(colors.yellow.500 / 75%);
	}

	.disconnected {
		background-color: theme(colors.red.500 / 75%);
	}
</style>
