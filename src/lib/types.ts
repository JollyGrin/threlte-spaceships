export type Vector3 = {
    x: number;
    y: number;
    z: number;
};

export type PyramidState = {
    id: string;
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    color?: string;
};

export type PyramidStates = Record<string, PyramidState>;
