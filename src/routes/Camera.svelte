<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
</script>

<T.PerspectiveCamera makeDefault position={[0, 10, 15]} fov={45} zoom={1.75}>
	<OrbitControls autoRotate={false} enableZoom={true} enableDamping autoRotateSpeed={0.1} />
</T.PerspectiveCamera>
