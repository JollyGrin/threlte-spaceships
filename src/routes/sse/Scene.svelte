<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import FloatingPyramid from './FloatingPyramid.svelte';
	import { EdgesGeometry, BoxGeometry } from 'three';
	import { CUBE_SIZE } from '$lib/constants';
	import type { PyramidState, PyramidStates } from '$lib/types';

	let { pyramidStates = {}, currentView = 'MAIN' } = $props<{
		pyramidStates: PyramidStates;
		currentView: string;
	}>();

	// Box geometry setup
	let boxGeometry = $state(new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE));
	let edgesGeometry = $state(new EdgesGeometry(boxGeometry));

	$effect(() => {
		edgesGeometry = new EdgesGeometry(boxGeometry);
	});

	type CubeProps = {
		position: Vector3Tuple;
	};

	type PyramidProps = {
		pyramid: PyramidState;
	};
</script>

<svelte:window
	on:resize={() => {
		boxGeometry = new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
	}}
/>

{#snippet cube(props: CubeProps)}
	<T.LineSegments position={props.position}>
		<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
		<T.LineBasicMaterial color="#ffffff" linewidth={2} />
	</T.LineSegments>
{/snippet}

{#snippet floatPyramid(props: PyramidProps)}
	<FloatingPyramid
		position={[props.pyramid.position.x, props.pyramid.position.y, props.pyramid.position.z]}
		rotation={[props.pyramid.rotation.x, props.pyramid.rotation.y, props.pyramid.rotation.z]}
		color={props.pyramid.color}
	/>
{/snippet}

<Lights />
<Camera {currentView} />

{@render cube({ position: [0, 0, 0] })}

{#each Object.values(pyramidStates as PyramidState[]) as pyramid (pyramid.id)}
	{@render floatPyramid({ pyramid })}
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
