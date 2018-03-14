import { Mesh } from "./mesh";
import { Primitive } from "./primitive";
import { TileData, Material, Shape } from "../physics/tile-data";
import { Camera2d } from "../canvas/camera-2d";
import { ShaderProgram } from "../shaders/shader-program";
import { PrimitiveMap } from "./mesh-providers";

export class Tile {

    private mesh_: Mesh;

    constructor(private tile_data_: TileData, private tile_width_: number, private tile_height_: number) { };

    init(context: WebGLRenderingContext, primitive_map: PrimitiveMap, camera: Camera2d) {
        let data = this.tile_data_;
        let x = this.tile_width_ * (data.column + 0.5);
        let y = this.tile_height_ * (data.row + 0.5);

        this.constructMesh(context, primitive_map, camera);
        this.setColor();
        this.mesh_.initTransform(x, y, 4, this.tile_width_ / 2, this.tile_height_/ 2, this.getRotation());
    };   

    constructMesh(context: WebGLRenderingContext, primitive_map: PrimitiveMap, camera: Camera2d) {
        switch (this.tile_data_.shape) {           
            case Shape.triangle:
            case Shape.wedge:
                this.mesh_ = new Mesh(context, primitive_map.get("triangle"), camera);
                break;
            case Shape.trapezoid:
                this.mesh_ = new Mesh(context, primitive_map.get("trapezoid"), camera);
            case Shape.square:
            default:
                this.mesh_ = new Mesh(context, primitive_map.get("square"), camera);
                break;
        }
    };

    getRotation() {
        return 0;
    };

    setColor() {
        switch (this.tile_data_.material) {
            case Material.rock:
                this.mesh_.setUniformColor([0.518, 0.498, 0.588, 1.0]);
                break;
            case Material.soil:
                this.mesh_.setUniformColor([0.718, 0.478, 0.122, 1.0]);
                break;
            case Material.grass:
                this.mesh_.setUniformColor([0.169, 0.529, 0.216, 1.0]);
                break;
            case Material.ice:
                this.mesh_.setUniformColor([0.957, 0.973, 1.0, 1.0]);
                break;
            default:
                this.mesh_.setUniformColor([1.0, 0.0, 0.0, 1.0]);
        }
    };

    draw(shader: ShaderProgram) {
        this.mesh_.drawMesh(shader);
    };
}