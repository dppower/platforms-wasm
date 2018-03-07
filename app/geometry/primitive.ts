import { Inject, Injectable } from "@angular/core"

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderProgram } from "../shaders/shader-program";
import { MeshData } from "./mesh-data";

@Injectable()
export class Primitive {
    
    private vertex_count_: number;
    private vertex_buffers_: WebGLBuffer[] = [];

    private index_buffer_: WebGLBuffer;
    private index_count_: number;
    private index_type_: number; // UNSIGNED_BYTE

    private drawing_mode_: number;

    constructor(@Inject(WEBGL) private webgl_context_: WebGLRenderingContext,
        mesh_data: MeshData, 
    ) { 
        this.drawing_mode_ = mesh_data.drawing_mode || 4;

        this.vertex_count_ = mesh_data.vertex_count;

        this.bufferData(0, mesh_data.vertex_positions);

        if (mesh_data.vertex_normals) {
            this.bufferData(1, mesh_data.vertex_normals);
        }

        if (mesh_data.vertex_colors) {
            this.bufferData(2, mesh_data.vertex_colors);
        }

        if (mesh_data.texture_coordinates) {
            this.bufferData(3, mesh_data.texture_coordinates);
        }

        if (mesh_data.indices) {
            this.index_count_ = mesh_data.vertex_count;
            this.createIndexBuffer(mesh_data.indices);
        }
    };

    createIndexBuffer(data: number[]) {
        let array = new Uint8Array(data);
        let target = this.webgl_context_.ELEMENT_ARRAY_BUFFER;
        this.index_buffer_ = this.webgl_context_.createBuffer();
        this.webgl_context_.bindBuffer(target, this.index_buffer_);
        this.webgl_context_.bufferData(
            target, array, this.webgl_context_.STATIC_DRAW
        );
    };

    bindVertexArray(shader_program: ShaderProgram) {
        this.webgl_context_.bindBuffer(this.webgl_context_.ARRAY_BUFFER, this.vertex_buffers_[0]);
        this.webgl_context_.vertexAttribPointer(
            shader_program.getAttribute("POSITION"), 3, this.webgl_context_.FLOAT, false, 0, 0
        );

        if (this.vertex_buffers_[2]) {
            this.webgl_context_.bindBuffer(this.webgl_context_.ARRAY_BUFFER, this.vertex_buffers_[2]);
            this.webgl_context_.vertexAttribPointer(
                shader_program.getAttribute("COLOR_0"), 3, this.webgl_context_.FLOAT, false, 0, 0
            );
        }

        if (this.vertex_buffers_[3]) {
            this.webgl_context_.bindBuffer(this.webgl_context_.ARRAY_BUFFER, this.vertex_buffers_[3]);
            this.webgl_context_.vertexAttribPointer(
                shader_program.getAttribute("TEXCOORD_0"), 2, this.webgl_context_.FLOAT, false, 0, 0
            );
        }
    };

    bufferData(index: number, data: number[]) {
        this.vertex_buffers_[index] = this.webgl_context_.createBuffer();
        this.webgl_context_.bindBuffer(this.webgl_context_.ARRAY_BUFFER, this.vertex_buffers_[index]);
        this.webgl_context_.bufferData(this.webgl_context_.ARRAY_BUFFER, new Float32Array(data), this.webgl_context_.STATIC_DRAW);
    };

    draw(shader: ShaderProgram) {
        this.bindVertexArray(shader);
        if (this.index_count_) {
            this.webgl_context_.bindBuffer(this.webgl_context_.ELEMENT_ARRAY_BUFFER, this.index_buffer_);
            this.webgl_context_.drawElements(this.drawing_mode_, this.index_count_, this.webgl_context_.UNSIGNED_BYTE, 0);
        }
        else {
            this.webgl_context_.drawArrays(this.drawing_mode_, 0, this.vertex_count_);
        }
    };
};