<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import { EdgesGeometry, BoxGeometry } from 'three';

	let boxGeometry = new BoxGeometry(1, 1, 1);
	let edgesGeometry = new EdgesGeometry(boxGeometry);

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
		<T.BufferGeometry attributes={{position: edgesGeometry.attributes.position}} />
		<T.LineBasicMaterial color="#ffffff" linewidth={2} />
	</T.LineSegments>
{/snippet}

{@render cube({ position: [0, 0, 0] })}
