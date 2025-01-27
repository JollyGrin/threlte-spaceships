<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import FloatingPyramid from './FloatingPyramid.svelte';
	import { EdgesGeometry, BoxGeometry } from 'three';
	import { CUBE_SIZE } from '$lib/constants';
	import type { PyramidState } from '$lib/types';
	import { normalizePyramidState } from '$lib/utils';

	// Box geometry setup
	let boxGeometry = $state(new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE));
	let edgesGeometry = $state(new EdgesGeometry(boxGeometry));

	let { currentView = 'MAIN', pyramidStates = [] } = $props<{
		currentView: string;
		pyramidStates: PyramidState[];
	}>();

	// Normalize pyramid states
	let pyramids = $derived(pyramidStates.map(normalizePyramidState));
	$effect(() => {
		edgesGeometry = new EdgesGeometry(boxGeometry);
	});

	// Reusable pyramid component snippet
</script>

{#snippet pyramid(pyramid: PyramidState)}
	<FloatingPyramid
		position={[pyramid.position.x, pyramid.position.y, pyramid.position.z]}
		rotation={[pyramid.rotation.x, pyramid.rotation.y, pyramid.rotation.z]}
		color={pyramid.color}
	/>
{/snippet}

<svelte:window
	on:resize={() => {
		boxGeometry = new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
	}}
/>

<Lights />
<Camera {currentView} {pyramidStates} />

<T.LineSegments position={[0, 0, 0]}>
	<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
	<T.LineBasicMaterial color="#ffffff" linewidth={2} />
</T.LineSegments>

{#each pyramids as ship (ship.id)}
	{@render pyramid(ship)}
{/each}
