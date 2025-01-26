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
	on:resize={() => {
		boxGeometry = new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
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
	<FloatingPyramid position={[0.2, 0.2, 0]} speed={1} phase={0} />
	<FloatingPyramid position={[-0.2, -0.2, 0.2]} speed={1.2} phase={2} />
	<FloatingPyramid position={[0, 0.2, -0.2]} speed={0.8} phase={4} />
{/snippet}

{@render cube({ position: [0, 0, 0] })}
