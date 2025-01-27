<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import FloatingPyramid from './FloatingPyramid.svelte';
	import { EdgesGeometry, BoxGeometry } from 'three';
	import { CUBE_SIZE } from '$lib/constants';
	import type { PyramidState, PyramidStates } from '$lib/types';
	import { SSEService } from '$lib/sseService';
	import { onMount } from 'svelte';

	// Box geometry setup
	let boxGeometry = $state(new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE));
	let edgesGeometry = $state(new EdgesGeometry(boxGeometry));

	// Pyramid states management
	let pyramidStates = $state<PyramidStates>({});
	let connectionState = $state<'connecting' | 'connected' | 'disconnected'>('disconnected');

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

	$effect(() => {
		edgesGeometry = new EdgesGeometry(boxGeometry);
	});
</script>

<svelte:window
	on:resize={() => {
		boxGeometry = new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
	}}
/>

<Lights />
<Camera />

<!-- Connection status indicator -->
{#if connectionState !== 'connected'}
	<div class="connection-status {connectionState}">
		{connectionState === 'connecting' ? 'Connecting...' : 'Disconnected - Attempting to reconnect...'}
	</div>
{/if}

<T.LineSegments position={[0, 0, 0]}>
	<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
	<T.LineBasicMaterial color="#ffffff" linewidth={2} />
</T.LineSegments>

{#each Object.values(pyramidStates) as pyramid (pyramid.id)}
	<FloatingPyramid
		position={[pyramid.position.x, pyramid.position.y, pyramid.position.z]}
		rotation={[pyramid.rotation.x, pyramid.rotation.y, pyramid.rotation.z]}
		color={pyramid.color}
	/>
{/each}

<style lang="postcss">
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
