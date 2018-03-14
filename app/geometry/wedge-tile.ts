import { MeshData } from "./mesh-data";

export function createWedgeVertices(x: number, y: number, hw: number, hh: number, flip = false): MeshData {
    let vertices: number[];
    if (flip) {
        vertices = [x - hw, y - hh, 0, x - hw, y + hh, 0, 0, y + hh, 0];
    }
    else {
        vertices = [x - hw, y - hh, 0, x + hw, 0, 0, x + hw, y - hh, 0];
    }
    return {
        vertex_count: 3,
        vertex_positions: vertices,
        indices: [0, 1, 2]
    };
};

export const left_wedge_tile = createWedgeVertices(0, 0, 1, 1);
export const right_wedge_tile = createWedgeVertices(0, 0, 1, 1, true);
