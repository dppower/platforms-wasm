import { Mesh } from "./mesh";
import { Primitive } from "./primitive";
import { PlatformDimensions } from "../physics/box-dimensions";
import { WorldState } from "../physics/world-state";
import { Camera2d } from "../canvas/camera-2d";
import { ShaderProgram } from "../shaders/shader-program";
import { Vec2 } from "../maths/vec2";

export class Platform {

    private platform_mesh_: Mesh;
    private pivot_mesh_: Mesh;
    private start_point_: Mesh;
    private end_point_: Mesh;

    constructor(private dimensions_: PlatformDimensions, private index_: number,
        private color_: number[], private world_state_: WorldState
    ) { };

    init(context: WebGLRenderingContext, square_primitive: Primitive[],
        arrow_primitive: Primitive[], camera: Camera2d
    ) {
        let dims = this.dimensions_;
        // Platform
        this.platform_mesh_ = new Mesh(context, square_primitive, camera);
        this.platform_mesh_.setUniformColor(this.color_);
        this.platform_mesh_.initTransform(dims.x, dims.y, 3, dims.hw, dims.hh, dims.r);

        // Path Angle
        let path = Vec2.normalise(Vec2.subtract({ x: dims.end_x, y: dims.end_y }, { x: dims.start_x, y: dims.start_y }));
        let angle = Math.atan2(path.y, path.x);
        // Start point
        this.start_point_ = new Mesh(context, arrow_primitive, camera);
        this.start_point_.initTransform(dims.start_x, dims.start_y, 1, 1, 1, angle);
        this.start_point_.setUniformColor([0.6, 0.6, 0.6, 1]);
        // End point
        this.end_point_ = new Mesh(context, arrow_primitive, camera);
        this.end_point_.initTransform(dims.end_x, dims.end_y, 1, 1, 1, Math.PI + angle);
        this.end_point_.setUniformColor([0.6, 0.6, 0.6, 1]);
        // Pivot
        this.pivot_mesh_ = new Mesh(context, square_primitive, camera);
        this.pivot_mesh_.initTransform(dims.x, dims.y, 2, 1.0, 0.75, angle);
        this.pivot_mesh_.setUniformColor([0.4, 0.4, 0.4, 1]);
    };

    update() {
        this.platform_mesh_.updateTransform(this.world_state_.getTransform(this.index_ + 1), true);
        this.pivot_mesh_.updateTransform(this.world_state_.getTransform(this.index_ + 1), false);
    };

    draw(shader: ShaderProgram) {
        this.platform_mesh_.drawMesh(shader);
        this.pivot_mesh_.drawMesh(shader);
        this.start_point_.drawMesh(shader);
        this.end_point_.drawMesh(shader);
    };
}