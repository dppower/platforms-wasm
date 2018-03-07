import { Mesh } from "./mesh";
import { Primitive } from "./primitive";
import { PlatformDimensions } from "../physics/box-dimensions";
import { WorldState } from "../physics/world-state";
import { Camera2d } from "../canvas/camera-2d";
import { ShaderProgram } from "../shaders/shader-program";

export class Platform {

    private platform_mesh_: Mesh;

    constructor(private dimensions_: PlatformDimensions, private index_: number,
        private color_: number[], private world_state_: WorldState
    ) { };

    init(context: WebGLRenderingContext, square_primitive: Primitive[], camera: Camera2d) {
        this.platform_mesh_ = new Mesh(context, square_primitive, camera);
        this.platform_mesh_.setUniformColor(this.color_, this.index_);

        let dims = this.dimensions_;
        this.platform_mesh_.initTransform(dims.x, dims.y, 1, dims.hw, dims.hh, dims.r);
    };

    update() {
        this.platform_mesh_.updateTransform(this.world_state_.getTransform(this.index_ + 1), true);
    };

    draw(shader: ShaderProgram) {
        this.platform_mesh_.drawMesh(shader);
    };
}