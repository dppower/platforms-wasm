import { Injectable, Inject } from "@angular/core";

import { Vec2_T } from "../maths/vec2";
import { Mesh } from "../geometry/mesh";
import { PLAYER, PLATFORMS, SKY, RGB_COLORS } from "../geometry/mesh-providers";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_START, PlatformDimensions } from "../physics/constants";
import { ShaderProgram } from "../shaders/shader-program";
import { BASIC_SHADER } from "../shaders/shader-providers";
import { WEBGL } from "../webgl/webgl-tokens";
import { Camera2d } from "../canvas/camera-2d";
import { RenderLoop } from "../canvas/render-loop";

@Injectable()
export class SceneRenderer {
    
    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        @Inject(BASIC_SHADER) private shader_: ShaderProgram,
        @Inject(SKY) private sky_: Mesh,
        @Inject(PLATFORMS) private platforms_: Mesh[],
        @Inject(PLAYER) private player_: Mesh,
        @Inject(RGB_COLORS) private rgb_colors: number[][],
        @Inject(PLAYER_START) private player_start_: Vec2_T,
        @Inject(PLATFORM_DIMENSIONS) private platform_dimensions_: PlatformDimensions[],
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number,
        private main_camera_: Camera2d,
        private render_loop_: RenderLoop
    ) { };

    initScene() {
        this.shader_.initProgram();

        // Sky
        this.sky_.setUniformColor([0.729, 0.831, 0.937, 1.0], 3);
        let hw = this.world_width_ / 2;
        let hh = this.world_height_ / 2;
        this.sky_.initTransform(hw, hh, 10, hw, hh, 0);
        
        this.player_.initTransform(this.player_start_.x, this.player_start_.y, 1, 0.5, 1, 0);

        this.platforms_.forEach((platform, index) => {
            platform.setUniformColor(this.rgb_colors[index], index);

            let dims = this.platform_dimensions_[index];
            let hw = dims.w / 2;
            let hh = dims.h / 2;
            platform.initTransform(dims.x, dims.y, 1, hw, hh, dims.r);
        });
    };

    updateScene(dt: number) {
        this.main_camera_.updateViewDimensions();
    };

    drawScene() {
        this.shader_.useProgram();
        
        this.gl.uniformMatrix4fv(
            this.shader_.getUniform("u_projection_matrix"), false, this.main_camera_.projection
        );

        this.sky_.drawMesh(this.shader_);

        this.player_.drawMesh(this.shader_);
        this.platforms_.forEach(platform => platform.drawMesh(this.shader_));
    };
}