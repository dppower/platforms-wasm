import { MeshData } from "./mesh-data";

export function createCircleVertices(
    x: number, y: number, radius: number, vertex_count: number
): MeshData {
    let vertices: number[] = [x, y, 0];
    for (let i = 0; i < vertex_count; i++) {
        let percent = i / (vertex_count - 1);
        let angle = percent * 2 * Math.PI;
        
        vertices.push(x + radius * Math.cos(angle));
        vertices.push(y + radius * Math.sin(angle));
        vertices.push(0);
    }
    return {
        vertex_count: vertex_count + 1,
        vertex_positions: vertices,
        drawing_mode: 6
    };
}

export function createSemiCircleVertices(
    x: number, y: number, radius: number, vertex_count: number
): MeshData {
    let vertices: number[] = [x, y, 0];
    for (let i = 0; i < vertex_count; i++) {
        let percent = i / vertex_count;
        let angle = percent * Math.PI;

        vertices.push(x + radius * Math.cos(angle));
        vertices.push(y + radius * Math.sin(angle));
        vertices.push(0);
    }
    return {
        vertex_count: vertex_count + 1,
        vertex_positions: vertices,
        drawing_mode: 6
    };
}

export const circle_mesh_data = createCircleVertices(0, 0, 1, 60);