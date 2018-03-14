import { MeshData } from "./mesh-data";

export function createTrapezoidVertices(x: number, y: number, hw: number, hh: number, flip = false): MeshData {
    let vertices: number[];
    if (flip) {
        vertices = [x - hw, y - hh, 0, x - hw, y + hh, 0, x + hw, y + hh, 0, x + hw, 0, 0];
    }
    else {
        vertices = [x - hw, y - hh, 0, 0, y + hh, 0, x + hw, y + hh, 0, x + hw, y - hh, 0];
    }
    return {
        vertex_count: 6,
        vertex_positions: vertices,
        indices: [0, 1, 2, 0, 2, 3]
    };
};

export const left_trapezoid_mesh = createTrapezoidVertices(0, 0, 1, 1);
export const right_trapezoid_mesh = createTrapezoidVertices(0, 0, 1, 1, true);