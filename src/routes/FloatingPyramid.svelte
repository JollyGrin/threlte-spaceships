<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import { ConeGeometry, EdgesGeometry } from 'three';
	import { PYRAMID, getDerivedValues } from '$lib/constants';

	let {
		position = [0, 0, 0],
		speed = 1,
		phase = 0
	}: {
		position: Vector3Tuple;
		speed: number;
		phase: number;
	} = $props();

	let time = $state(0);
	let velocity = $state({
		x: Math.sin(phase) * speed * 0.005,
		y: Math.cos(phase) * speed * 0.005,
		z: Math.sin(phase + Math.PI/4) * speed * 0.005
	});

	// Get the derived values for movement bounds
	const { MOVEMENT_BOUNDS } = getDerivedValues();

	const pyramidGeometry = new ConeGeometry(
		PYRAMID.BASE_RADIUS,
		PYRAMID.HEIGHT,
		4
	);
	const edgesGeometry = new EdgesGeometry(pyramidGeometry);

	// Create a floating animation with bouncing
	$effect(() => {
		const interval = setInterval(() => {
			time += 0.016; // Approximately 60fps

			// Update position with velocity
			let [x, y, z] = position;
			x += velocity.x;
			y += velocity.y;
			z += velocity.z;

			// Check for collisions and bounce
			if (Math.abs(x) > MOVEMENT_BOUNDS) {
				velocity.x *= -1;
				x = Math.sign(x) * MOVEMENT_BOUNDS;
			}
			if (Math.abs(y) > MOVEMENT_BOUNDS) {
				velocity.y *= -1;
				y = Math.sign(y) * MOVEMENT_BOUNDS;
			}
			if (Math.abs(z) > MOVEMENT_BOUNDS) {
				velocity.z *= -1;
				z = Math.sign(z) * MOVEMENT_BOUNDS;
			}

			position = [x, y, z];
		}, 16);

		return () => clearInterval(interval);
	});
</script>

<T.Group>
	<!-- Wireframe pyramid -->
	<T.LineSegments {position} rotation.y={time * speed * 0.5}>
		<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
		<T.LineBasicMaterial color="#00ff88" linewidth={2} />
	</T.LineSegments>
</T.Group>
