<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import type { PyramidState } from '$lib/types';
	import { spring } from 'svelte/motion';
	import { CUBE_SIZE } from '$lib/constants';

	let {
		currentView = 'MAIN',
		pyramidStates = []
	} = $$props<{
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

	// Update camera position based on current view
	$$effect(() => {
		if (currentView === 'MAIN') {
			cameraPosition.set([0, 1, 2]);
			cameraRotation.set([0, 0, 0]);
		} else {
			const pyramid = pyramidStates.find(p => p.id === currentView);
			if (pyramid) {
				// Position camera slightly behind and above the pyramid
				const offset = { x: 0, y: 0.2, z: -0.5 };
				cameraPosition.set([
					pyramid.position.x + offset.x,
					pyramid.position.y + offset.y,
					pyramid.position.z + offset.z
				]);
				cameraRotation.set([
					pyramid.rotation.x,
					pyramid.rotation.y,
					pyramid.rotation.z
				]);
			}
		}
	});
</script>

<T.PerspectiveCamera 
	makeDefault 
	position={$cameraPosition} 
	rotation={$cameraRotation}
	fov={45} 
	zoom={1.75}
>
	<OrbitControls 
		autoRotate={false} 
		enableZoom={true} 
		enableDamping 
		autoRotateSpeed={0.1}
		enabled={currentView === 'MAIN'}
	/>
</T.PerspectiveCamera>
