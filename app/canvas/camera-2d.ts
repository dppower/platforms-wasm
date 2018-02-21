import { Injectable, Inject } from "@angular/core";
import { Vec2, Vec2_T } from "../maths/vec2";
import { InputManager } from "./input-manager";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../physics/constants";

@Injectable()
export class Camera2d {

    get projection() {
        return this.projection_matrix;
    };

    private xmag_: number;
    private ymag_: number;
    private world_aspect_: number;

    private position_: Vec2;

    private projection_matrix: Float32Array;

    constructor(private input_manager_: InputManager,
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number,
        private znear_: number, private zfar_: number
    ) {
        this.world_aspect_ = this.world_width_ / this.world_height_;

        this.position_ = new Vec2({ x: this.world_width_ / 2, y: this.world_height_ / 2 });

        this.projection_matrix = new Float32Array(16);
    };
    
    updateViewDimensions() {
        let canvas_aspect = this.input_manager_.canvas_aspect;

        if (canvas_aspect > this.world_aspect_) {
            this.xmag_ = this.world_height_ * canvas_aspect / 2;
            this.ymag_ = this.world_height_ / 2;
        }
        else if (canvas_aspect < this.world_aspect_) {
            this.xmag_ = this.world_width_ / 2;
            this.ymag_ = this.world_width_ / (canvas_aspect * 2);
        }
        else {
            this.xmag_ = this.world_width_ / 2;
            this.ymag_ = this.world_height_ / 2;
        }
        this.setProjectionMatrix();
    };

    applyViewTransform(transform_matrix: Float32Array, view: Float32Array) {
        view.set(transform_matrix);
        view[12] = transform_matrix[12] - this.position_.x;
        view[13] = transform_matrix[13] - this.position_.y;
        view[14] = -transform_matrix[14];
    };

    setProjectionMatrix() {
        let d = 1 / (this.znear_ - this.zfar_);
        this.projection_matrix[0] = 1 / this.xmag_;
        this.projection_matrix[5] = 1 / this.ymag_;
        this.projection_matrix[10] = 2 * d;
        this.projection_matrix[14] = (this.zfar_ + this.znear_) * d;
        this.projection_matrix[15] = 1;
    };
}