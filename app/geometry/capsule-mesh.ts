import { MeshData } from "./mesh-data";
import { createCircleVertices } from "./circle-mesh";
import { createQuadVertices } from "./square-mesh";

export function createCapsuleVertices(hw: number, hh: number, vertex_count: number): MeshData[] {
    return [
        createCircleVertices(0, hh, hw, vertex_count), //=> Upper semi-circle
        createCircleVertices(0, -hh, hw, vertex_count), //=> Lower semi-circle
        createQuadVertices(0, 0, hw, hh)
    ];
}