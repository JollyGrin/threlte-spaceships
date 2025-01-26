<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import FloatingPyramid from './FloatingPyramid.svelte';
	import { EdgesGeometry, BoxGeometry } from 'three';
	import { CUBE_SIZE } from '$lib/constants';
	import type { PyramidState, PyramidStates } from '$lib/types';

	// Box geometry setup
	let boxGeometry = $state(new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE));
	let edgesGeometry = $state(new EdgesGeometry(boxGeometry));

	// Pyramid states management
	let pyramidStates = $state<PyramidStates>({
		// Initial mock data
		pyramid1: {
			id: 'pyramid1',
			position: { x: 0.2, y: 0.2, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			color: '#00ff88'
		},
		pyramid2: {
			id: 'pyramid2',
			position: { x: -0.2, y: -0.2, z: 0.2 },
			rotation: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			color: '#00ff88'
		},
		pyramid3: {
			id: 'pyramid3',
			position: { x: 0, y: 0.2, z: -0.2 },
			rotation: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			color: '#00ff88'
		}
	});

	// Function to update pyramid states
	function updatePyramidStates(newStates: PyramidState[]) {
		newStates.forEach((state) => {
			pyramidStates[state.id] = state;
		});
	}

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
