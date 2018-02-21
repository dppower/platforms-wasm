export interface MeshData {
    vertex_count: number;
    vertex_positions: number[],
    indices?: number[],
    vertex_normals?: number[],
    vertex_colors?: number[],
    texture_coordinates?: number[]
};