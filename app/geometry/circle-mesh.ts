import { MeshData } from "./mesh-data";

let vertices = [0, 0, 0];
const radius = 1;
const vertex_count = 61;

function createCircleVertices(vertices: number[]) {
    let outer_vertex_count = vertex_count - 1;
    let center_x = vertices[0];
    let center_y = vertices[1];
    for (let i = 0; i < outer_vertex_count; i++) {
        let percent = i / (outer_vertex_count - 1);
        let rad = percent * 2 * Math.PI;
        
        vertices.push(center_x + radius * Math.cos(rad));
        vertices.push(center_y + radius * Math.sin(rad));
        vertices.push(0);
    }
    return vertices;
}

export const circle_mesh_data: MeshData = {
    vertex_count,
    vertex_positions: createCircleVertices(vertices)
};