<script lang="ts">
	import { T } from '@threlte/core';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
	import { WireframeGeometry, BoxGeometry } from 'three';
</script>

<svelte:window
	on:keydown|preventDefault={(e) => {
		console.log(e.code);
		// DEBUGGER - adjust values here to test interactions
		// e.code === "KeyA" && incrementPlayerScore("p1");
	}}
/>

<Lights />
<Camera />

{#snippet cube(props)}
	<T.LineSegments {...props}>
		<T.WireframeGeometry args={[new BoxGeometry(1, 1, 1)]} />
		<T.LineBasicMaterial color="#ffffff" linewidth={2} />
	</T.LineSegments>
{/snippet}

{@render cube({ position: [0, 0, 0] })}
