// Primary adjustable constants
export const CUBE_SIZE = 1; // Total size of the cube

export const PYRAMID = {
	BASE_RADIUS: 0.05, // Base radius of the cone
	HEIGHT: 0.1 // Height of the cone
};

// Utility functions for derived values
export const getDerivedValues = () => {
	// Calculate the collision radius based on the pyramid's dimensions
	// Using the larger of: half the base diameter or half the height
	const collisionRadius = Math.max(PYRAMID.BASE_RADIUS, PYRAMID.HEIGHT / 2);

	return {
		// Cube
		HALF_CUBE_SIZE: CUBE_SIZE / 2,

		// Pyramid collision
		COLLISION_RADIUS: collisionRadius,

		// Safe movement bounds (where pyramids can move without clipping)
		// This ensures pyramids never clip through the cube walls
		MOVEMENT_BOUNDS: CUBE_SIZE / 2 - collisionRadius,

		// Initial position bounds (where pyramids can safely spawn)
		// More conservative than movement bounds to ensure pyramids don't spawn too close to walls
		SPAWN_BOUNDS: CUBE_SIZE / 2 - collisionRadius * 1.2
	};
};
