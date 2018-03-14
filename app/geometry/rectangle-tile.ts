import { MeshData } from "./mesh-data";

export function createRectangleTileVertices(x: number, y: number, hw: number, hh: number): MeshData {
    return {
        vertex_count: 6,
        vertex_positions: [x - hw, y - hh, 0, x - hw, 0, 0, x + hw, 0, 0, x + hw, y - hh, 0],
        indices: [0, 1, 2, 0, 2, 3]
    };
};

export const rectangle_tile_mesh = createRectangleTileVertices(0, 0, 1, 1);