﻿import { MeshData } from "./mesh-data";

export function createTriangleVertices(x: number, y: number, hw: number, hh: number): MeshData {
    return {
        vertex_count: 3,
        vertex_positions: [x - hw, y - hh, 0, x + hw, y + hh, 0, x + hw, y - hh, 0],
        indices: [0, 1, 2]
    };
};