import { MeshData } from "./mesh-data";

export function createCircleVertices(x: number, y: number, radius: number, vertex_count: number) {
    let vertices: number[] = [x, y, 0];
    for (let i = 0; i < vertex_count; i++) {
        let percent = i / (vertex_count - 1);
        let angle = percent * 2 * Math.PI;
        
        vertices.push(x + radius * Math.cos(angle));
        vertices.push(y + radius * Math.sin(angle));
        vertices.push(0);
    }
    return vertices;
}

export function createSemiCircleVertices(x: number, y: number, radius: number, vertex_count: number) {
    let vertices: number[] = [x, y, 0];
    for (let i = 0; i < vertex_count; i++) {
        let percent = i / vertex_count;
        let angle = percent * Math.PI;

        vertices.push(x + radius * Math.cos(angle));
        vertices.push(y + radius * Math.sin(angle));
        vertices.push(0);
    }
    return vertices;
}

export const circle_mesh_data = (vertex_count: number): MeshData => ({
    vertex_count,
    vertex_positions: createCircleVertices(0, 0, 1, vertex_count)
});