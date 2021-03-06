import { Injectable, Inject } from "@angular/core";

import { Mesh } from "../geometry/mesh";
import { PRIMITIVES, PrimitiveMap, RGB_COLORS } from "../geometry/mesh-providers";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS, TILE_DATA } from "../physics/constant-tokens";
import { WorldState} from "../physics/world-state";
import { BoxDimensions, PlatformDimensions } from "../physics/box-dimensions";
import { TileData } from "../physics/tile-data";
import { ShaderProgram } from "../shaders/shader-program";
import { BASIC_SHADER } from "../shaders/shader-providers";
import { WEBGL } from "../webgl/webgl-tokens";
import { Camera2d } from "../canvas/camera-2d";
import { RenderLoop } from "../canvas/render-loop";
import { createCapsuleVertices } from "../geometry/capsule-mesh";
import { Primitive } from "../geometry/primitive";
import { Platform } from "../geometry/platform";
import { Tile } from "../geometry/tile";

@Injectable()
export class SceneRenderer {

    private player_: Mesh;
    private platforms_: Platform[];
    private tiles_: Tile[];
    private sky_: Mesh;

    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        @Inject(BASIC_SHADER) private shader_: ShaderProgram,
        @Inject(PRIMITIVES) private primitive_map_: PrimitiveMap,
        @Inject(RGB_COLORS) private rgb_colors: number[][],
        @Inject(PLAYER_DIMENSIONS) private player_dimensions_: BoxDimensions,
        @Inject(PLATFORM_DIMENSIONS) private platform_dimensions_: PlatformDimensions[],
        @Inject(TILE_DATA) private tile_data_: TileData[],
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number,
        private world_state_: WorldState,
        private main_camera_: Camera2d,
        private render_loop_: RenderLoop
    ) { };

    initScene() {
        this.shader_.initProgram();

        // Sky
        this.sky_ = new Mesh(this.gl, this.primitive_map_.get("square"), this.main_camera_);
        this.sky_.setUniformColor([0.729, 0.831, 0.937, 1.0]);
        let hw = this.world_width_ / 2;
        let hh = this.world_height_ / 2;
        this.sky_.initTransform(hw, hh, 10, hw, hh, 0);
        
        // Player 
        let player_primitives = createCapsuleVertices(
            this.player_dimensions_.hw, this.player_dimensions_.hh, 60

        ).map(mesh_data => new Primitive(this.gl, mesh_data));

        this.player_ = new Mesh(this.gl, player_primitives, this.main_camera_);
        this.player_.setUniformColor([0.392, 0.306, 0.878, 1.0]);
        this.player_.initTransform(
            this.player_dimensions_.x, this.player_dimensions_.y, 1,
            1, 1, 0
        );

        // Platforms
        this.platforms_ = this.platform_dimensions_.map((dims, index) => {
            return new Platform(dims, index, this.rgb_colors[index], this.world_state_);
        });
        
        this.platforms_.forEach(platform => {
            platform.init(this.gl, this.primitive_map_, this.main_camera_)
        });

        // Tiles
        this.tiles_ = this.tile_data_.map(data => {
            return new Tile(data, 1.25, 1.25);
        });

        this.tiles_.forEach(tile => {
            tile.init(this.gl, this.primitive_map_, this.main_camera_);
        });
    };

    updateScene(dt: number) {
        this.world_state_.updateWorld(dt);
        if (this.world_state_.initialised) {
            this.player_.updateTransform(this.world_state_.getTransform(0));
            
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
        this.tiles_.forEach(tile => tile.draw(this.shader_));
        this.player_.drawMesh(this.shader_);
        this.platforms_.forEach(platform => platform.draw(this.shader_));
    };
}