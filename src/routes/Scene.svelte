<script lang="ts">
	import Cube from '$lib/components/Cube.svelte';
	import Camera from './Camera.svelte';
	import Lights from './Lights.svelte';
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

<Cube position={[0, 0, 0]} />
