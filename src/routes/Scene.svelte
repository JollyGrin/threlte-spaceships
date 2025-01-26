<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import FloatingPyramid from './FloatingPyramid.svelte';
	import { EdgesGeometry, BoxGeometry } from 'three';
	import { CUBE_SIZE, getDerivedValues } from '$lib/constants';

	let boxGeometry = $state(new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE));
	let edgesGeometry = $state(new EdgesGeometry(boxGeometry));

	// Get derived values for spawning pyramids
	const { SPAWN_BOUNDS } = getDerivedValues();

	type CubeProps = {
		position: Vector3Tuple;
	};

	$effect(() => {
		edgesGeometry = new EdgesGeometry(boxGeometry);
	});
</script>

<svelte:window
	on:keydown|preventDefault={(e: KeyboardEvent) => {
		console.log(e.code);
		// DEBUGGER - adjust values here to test interactions
		// e.code === "KeyA" && incrementPlayerScore("p1");
	}}
/>

<Lights />
<Camera />

{#snippet cube(props: CubeProps)}
	<T.LineSegments {...props}>
		<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
		<T.LineBasicMaterial color="#ffffff" linewidth={2} />
	</T.LineSegments>

	<!-- Add three floating pyramids with different positions, speeds, and phases -->
	<FloatingPyramid position={[SPAWN_BOUNDS * 0.5, SPAWN_BOUNDS * 0.3, 0]} speed={1.2} phase={0} />
	<FloatingPyramid position={[-SPAWN_BOUNDS * 0.5, -SPAWN_BOUNDS * 0.3, SPAWN_BOUNDS * 0.5]} speed={1.5} phase={2} />
	<FloatingPyramid position={[0, SPAWN_BOUNDS * 0.5, -SPAWN_BOUNDS * 0.5]} speed={1.8} phase={4} />
{/snippet}

{@render cube({ position: [0, 0, 0] })}
