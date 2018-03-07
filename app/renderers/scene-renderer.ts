import { Injectable, Inject } from "@angular/core";

import { Mesh } from "../geometry/mesh";
import { /*PLATFORMS,*/ SKY, RGB_COLORS, SQUARE_PRIMITIVE } from "../geometry/mesh-providers";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "../physics/constant-tokens";
import { WorldState} from "../physics/world-state";
import { BoxDimensions, PlatformDimensions } from "../physics/box-dimensions";
import { ShaderProgram } from "../shaders/shader-program";
import { BASIC_SHADER } from "../shaders/shader-providers";
import { WEBGL } from "../webgl/webgl-tokens";
import { Camera2d } from "../canvas/camera-2d";
import { RenderLoop } from "../canvas/render-loop";
import { createCapsuleVertices } from "../geometry/capsule-mesh";
import { Primitive } from "../geometry/primitive";
import { Platform } from "../geometry/platform";

@Injectable()
export class SceneRenderer {

    private player_: Mesh;
    private platforms_: Platform[];

    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        @Inject(BASIC_SHADER) private shader_: ShaderProgram,
        @Inject(SKY) private sky_: Mesh,
        @Inject(SQUARE_PRIMITIVE) private square_primitive_: Primitive[],
        //@Inject(PLATFORMS) private platforms_: Mesh[],        
        @Inject(RGB_COLORS) private rgb_colors: number[][],
        @Inject(PLAYER_DIMENSIONS) private player_dimensions_: BoxDimensions,
        @Inject(PLATFORM_DIMENSIONS) private platform_dimensions_: PlatformDimensions[],
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number,
        private world_state_: WorldState,
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
        
        // Player 
        let player_primitives = createCapsuleVertices(
            this.player_dimensions_.hw, this.player_dimensions_.hh, 60

        ).map(mesh_data => new Primitive(this.gl, mesh_data));

        this.player_ = new Mesh(this.gl, player_primitives, this.main_camera_);

        this.player_.initTransform(
            this.player_dimensions_.x, this.player_dimensions_.y, 1,
            1, 1, 0
        );

        // Platforms
        this.platforms_ = this.platform_dimensions_.map((dims, index) => {
            return new Platform(dims, index, this.rgb_colors[index], this.world_state_);
        });
        
        this.platforms_.forEach(platform => platform.init(this.gl, this.square_primitive_, this.main_camera_));
        //this.platforms_.forEach((platform, index) => {
        //    platform.setUniformColor(this.rgb_colors[index], index);

        //    let dims = this.platform_dimensions_[index];
        //    platform.initTransform(dims.x, dims.y, 1, dims.hw, dims.hh, dims.r);
        //});
    };

    updateScene(dt: number) {
        this.world_state_.updateWorld(dt);
        if (this.world_state_.initialised) {
            this.player_.updateTransform(this.world_state_.getTransform(0));
            
            //this.platforms_.forEach((platform, index) => {
            //    platform.updateTransform(this.world_state_.getTransform(index + 1), true);
            //});
            this.platforms_.forEach(platform => platform.update());
        }
        this.main_camera_.updateViewDimensions();
    };

    drawScene() {
        this.shader_.useProgram();
        
        this.gl.uniformMatrix4fv(
            this.shader_.getUniform("u_projection_matrix"), false, this.main_camera_.projection
        );

        this.sky_.drawMesh(this.shader_);

        this.player_.drawMesh(this.shader_);
        this.platforms_.forEach(platform => platform.draw(this.shader_));
    };
}