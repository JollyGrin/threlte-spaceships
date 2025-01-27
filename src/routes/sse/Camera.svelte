<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import type { PyramidState } from '$lib/types';
	import { spring } from 'svelte/motion';
	import { CUBE_SIZE, PYRAMID } from '$lib/constants';
	import { Vector3, Euler, MathUtils } from 'three';

	let { currentView = 'MAIN', pyramidStates = [] } = $props<{
		currentView: string;
		pyramidStates: PyramidState[];
	}>();

	// Camera position spring for smooth transitions
	const cameraPosition = spring([0, 1, 2], {
		stiffness: 0.1,
		damping: 0.8
	});

	const cameraRotation = spring([0, 0, 0], {
		stiffness: 0.1,
		damping: 0.8
	});

	// Helper to calculate pyramid-top position
	function getPyramidTopPosition(pyramid: PyramidState) {
		const pos = new Vector3(
			pyramid.position.x,
			pyramid.position.y + PYRAMID.HEIGHT, // Position at the top of pyramid
			pyramid.position.z
		);
		return pos;
	}

	// Helper to calculate look direction based on pyramid rotation
	function getPyramidLookRotation(pyramid: PyramidState) {
		// Convert pyramid rotation to radians if it's in degrees
		const euler = new Euler(
			MathUtils.degToRad(pyramid.rotation.x),
			MathUtils.degToRad(pyramid.rotation.y),
			MathUtils.degToRad(pyramid.rotation.z)
		);
		return euler;
	}

	// Update camera position based on current view
	$effect(() => {
		if (currentView === 'MAIN') {
			cameraPosition.set([0, 1, 2]);
			cameraRotation.set([0, 0, 0]);
		} else {
			const pyramid = pyramidStates.find((p: PyramidState) => p.id === currentView);
			if (pyramid) {
				const topPos = getPyramidTopPosition(pyramid);
				const lookRot = getPyramidLookRotation(pyramid);

				cameraPosition.set([topPos.x, topPos.y, topPos.z]);
				cameraRotation.set([lookRot.x, lookRot.y, lookRot.z]);
			}
		}
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={$cameraPosition}
	rotation={$cameraRotation}
	fov={75}
	near={0.1}
	far={100}
>
	<OrbitControls
		autoRotate={false}
		enableZoom={true}
		enableDamping
		dampingFactor={0.05}
		autoRotateSpeed={0.1}
		enabled={currentView === 'MAIN'}
	/>
</T.PerspectiveCamera>
