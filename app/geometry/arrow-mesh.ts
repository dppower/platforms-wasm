import { MeshData } from "./mesh-data";

export function createArrowVertices(x: number, y: number, d1: number, d2: number): MeshData {
    return {
        vertex_count: 6,
        vertex_positions: [x - d1, 0, 0, x + d1, y + d1, 0, x + d2, 0, 0, x + d1, y - d1, 0],
        indices: [0, 1, 2, 0, 2, 3]
    };
};

export const arrow_mesh_data = createArrowVertices(0, 0, 0.5, 0.25);