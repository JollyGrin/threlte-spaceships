import type { PyramidState } from './types';
import { CUBE_SIZE, getDerivedValues } from './constants';

export function normalizePyramidPosition(position: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    const { MOVEMENT_BOUNDS } = getDerivedValues();
    
    // Clamp each coordinate to stay within the cube bounds
    return {
        x: Math.max(-MOVEMENT_BOUNDS, Math.min(MOVEMENT_BOUNDS, position.x)),
        y: Math.max(-MOVEMENT_BOUNDS, Math.min(MOVEMENT_BOUNDS, position.y)),
        z: Math.max(-MOVEMENT_BOUNDS, Math.min(MOVEMENT_BOUNDS, position.z))
    };
}

export function normalizePyramidState(state: PyramidState): PyramidState {
    return {
        ...state,
        position: normalizePyramidPosition(state.position)
    };
}
