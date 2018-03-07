import { Inject, Injectable } from "@angular/core"

import { WEBGL } from "../webgl/webgl-tokens";
import { Primitive } from "./primitive";
import { ShaderProgram } from "../shaders/shader-program";
import { Camera2d } from "../canvas/camera-2d";

@Injectable()
export class Mesh {

    get color_id() {
        return this.color_id_;
    };

    get x() {
        return this.transform_matrix_[12];
    };

    get y() {
        return this.transform_matrix_[13];
    };

    set x(value: number) {
        this.transform_matrix_[12] = value;
    };

    set y(value: number) {
        this.transform_matrix_[13] = value;
    };
    
    private color_id_: number;
    private uniform_colour_ = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    private transform_matrix_: Float32Array;
    private view_matrix_: Float32Array;

    constructor(
        @Inject(WEBGL) private webgl_context_: WebGLRenderingContext,
        private primitives_: Primitive[], private camera_: Camera2d
    ) {
        this.transform_matrix_ = new Float32Array(16);
        this.view_matrix_ = new Float32Array(16);
    };

    initTransform(tx: number, ty: number, tz: number, sx = 1, sy = 1, angle = 0) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        this.transform_matrix_.set([
            sx * c, sx * -s, 0, 0,
            sy * s + 0, sy * c, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]);
        this.camera_.applyViewTransform(this.transform_matrix_, this.view_matrix_);
    };

    updateTransform(data: Float32Array, use_scale = false) {
        this.x = data[0];
        this.y = data[1];
        let sx = use_scale ? data[2] / 2 : 1;
        let sy = use_scale ? data[3] / 2 : 1;
        let c = data[4];
        let s = data[5];
        this.transform_matrix_[0] = sx * c;
        this.transform_matrix_[1] = sx * -s;
        this.transform_matrix_[4] = sy * s;
        this.transform_matrix_[5] = sy * c;
        this.camera_.applyViewTransform(this.transform_matrix_, this.view_matrix_);
    };
    
    setUniformColor(array: number[], id: number) {
        this.color_id_ = id;
        this.uniform_colour_.set(array);
    };

    drawMesh(shader_program: ShaderProgram) {       
        this.webgl_context_.uniformMatrix4fv(
            shader_program.getUniform("u_view_matrix"), false, this.view_matrix_
        );

        this.webgl_context_.uniform4fv(shader_program.getUniform("u_base_color"), this.uniform_colour_);

        this.primitives_.forEach(primitive => primitive.draw(shader_program));
    };
};