<script lang="ts">
	import { T } from '@threlte/core';
	import type { Vector3Tuple } from 'three';
	import { ConeGeometry, EdgesGeometry } from 'three';
	import { PYRAMID } from '$lib/constants';

	let { 
		position = [0, 0, 0],
		rotation = [0, 0, 0],
		color = '#00ff88'
	} = $props<{
		position: Vector3Tuple;
		rotation: Vector3Tuple;
		color?: string;
	}>();

	const pyramidGeometry = new ConeGeometry(PYRAMID.BASE_RADIUS, PYRAMID.HEIGHT, 4, 1, false);
	const edgesGeometry = new EdgesGeometry(pyramidGeometry);
</script>

<T.Group>
	<!-- Wireframe pyramid -->
	<T.LineSegments {position} rotation={rotation}>
		<T.BufferGeometry attributes={{ position: edgesGeometry.attributes.position }} />
		<T.LineBasicMaterial {color} linewidth={2} />
	</T.LineSegments>
</T.Group>
