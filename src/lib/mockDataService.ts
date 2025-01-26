import type { PyramidState } from './types';
import { CUBE_SIZE } from './constants';

class MockDataService {
    private pyramids: Map<string, PyramidState>;
    private updateCallbacks: ((states: PyramidState[]) => void)[];
    private intervalId: number | null = null;

    constructor() {
        this.pyramids = new Map();
        this.updateCallbacks = [];
        
        // Initialize with some pyramids
        this.pyramids.set('pyramid1', {
            id: 'pyramid1',
            position: { x: 0.2, y: 0.2, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            velocity: { x: 0.001, y: 0.002, z: 0.001 },
            color: '#00ff88'
        });

        this.pyramids.set('pyramid2', {
            id: 'pyramid2',
            position: { x: -0.2, y: -0.2, z: 0.2 },
            rotation: { x: 0, y: 0, z: 0 },
            velocity: { x: -0.002, y: 0.001, z: -0.001 },
            color: '#00ff88'
        });

        this.pyramids.set('pyramid3', {
            id: 'pyramid3',
            position: { x: 0, y: 0.2, z: -0.2 },
            rotation: { x: 0, y: 0, z: 0 },
            velocity: { x: 0.001, y: -0.001, z: 0.002 },
            color: '#00ff88'
        });
    }

    subscribe(callback: (states: PyramidState[]) => void) {
        this.updateCallbacks.push(callback);
        return () => {
            this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
        };
    }

    start() {
        if (this.intervalId !== null) return;

        this.intervalId = setInterval(() => {
            // Update positions and check bounds
            for (const pyramid of this.pyramids.values()) {
                // Update position
                pyramid.position.x += pyramid.velocity.x;
                pyramid.position.y += pyramid.velocity.y;
                pyramid.position.z += pyramid.velocity.z;

                // Check bounds and bounce
                const bounds = CUBE_SIZE / 2 - 0.1; // Small offset to avoid edge cases
                ['x', 'y', 'z'].forEach(axis => {
                    if (Math.abs(pyramid.position[axis]) > bounds) {
                        pyramid.position[axis] = Math.sign(pyramid.position[axis]) * bounds;
                        pyramid.velocity[axis] *= -1;
                    }
                });

                // Calculate rotation based on velocity direction
                const speed = Math.sqrt(
                    pyramid.velocity.x ** 2 + 
                    pyramid.velocity.y ** 2 + 
                    pyramid.velocity.z ** 2
                );
                if (speed > 0) {
                    pyramid.rotation.y = Math.atan2(pyramid.velocity.x, pyramid.velocity.z);
                    pyramid.rotation.x = -Math.atan2(
                        pyramid.velocity.y,
                        Math.sqrt(pyramid.velocity.x ** 2 + pyramid.velocity.z ** 2)
                    );
                }
            }

            // Notify all subscribers
            const currentStates = Array.from(this.pyramids.values());
            this.updateCallbacks.forEach(callback => callback(currentStates));
        }, 16); // ~60fps
    }

    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Export a singleton instance
export const mockDataService = new MockDataService();
