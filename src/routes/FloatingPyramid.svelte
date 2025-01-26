<script lang="ts">
	import { T } from '@threlte/core';
	import type { EulerOrder, Vector3Tuple } from 'three';
	import { ConeGeometry, EdgesGeometry, Vector3, Euler } from 'three';
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
		x: Math.sin(phase) * speed * 0.002,
		y: Math.cos(phase) * speed * 0.002,
		z: Math.sin(phase + Math.PI / 4) * speed * 0.002
	});

	// Get the derived values for movement bounds
	const { MOVEMENT_BOUNDS } = getDerivedValues();

	const pyramidGeometry = new ConeGeometry(PYRAMID.BASE_RADIUS, PYRAMID.HEIGHT, 4, 1, false);
	const edgesGeometry = new EdgesGeometry(pyramidGeometry);

	// Calculate rotation to face movement direction
	function calculateRotation(velocity: { x: number; y: number; z: number }): Euler {
		// Create a direction vector from velocity
		const direction = new Vector3(velocity.x, velocity.y, velocity.z).normalize();

		// Only calculate rotation if we have movement
		if (direction.length() === 0) {
			return new Euler(0, 0, 0);
		}

		const euler = new Euler();

		// Calculate angle around Y axis (yaw)
		euler.y = Math.atan2(direction.x, direction.z);
		// Calculate angle around X axis (pitch)
		euler.x = -Math.atan2(
			direction.y,
			Math.sqrt(direction.x * direction.x + direction.z * direction.z)
		);

		return euler;
	}

	let rotation = $state(calculateRotation(velocity));

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

			// Update rotation to face movement direction
			rotation = calculateRotation(velocity);

			position = [x, y, z];
		}, 16);

		return () => clearInterval(interval);
	});
</script>

<T.Group>
	<!-- Wireframe pyramid -->
	<T.LineSegments {position} rotation={[rotation.x, rotation.y, rotation.z]}>
		<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
		<T.LineBasicMaterial color="#00ff88" linewidth={2} />
	</T.LineSegments>
</T.Group>
