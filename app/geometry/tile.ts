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
        this.constructMesh(context, primitive_map, camera);
        this.setTileTransform();
        this.setColor();       
    };   

    constructMesh(context: WebGLRenderingContext, primitive_map: PrimitiveMap, camera: Camera2d) {
        switch (this.tile_data_.shape) {           
            case Shape.triangle:
                this.mesh_ = new Mesh(context, primitive_map.get("triangle"), camera);
                break;
            case Shape.wedge:
                if (this.tile_data_.flip) {
                    this.mesh_ = new Mesh(context, primitive_map.get("right-wedge"), camera);
                }
                else {
                    this.mesh_ = new Mesh(context, primitive_map.get("left-wedge"), camera);
                }
                break;
            case Shape.trapezoid:
                if (this.tile_data_.flip) {
                    this.mesh_ = new Mesh(context, primitive_map.get("right-trapezoid"), camera);
                }
                else {
                    this.mesh_ = new Mesh(context, primitive_map.get("left-trapezoid"), camera);
                }
                break;
            case Shape.rectangle:
                this.mesh_ = new Mesh(context, primitive_map.get("rectangle"), camera);
                break;
            case Shape.square:
            default:
                this.mesh_ = new Mesh(context, primitive_map.get("square"), camera);
                break;
        }
    };

    setTileTransform() {
        let data = this.tile_data_;

        let x = this.tile_width_ * (data.column + 0.5);
        let y = this.tile_height_ * (data.row + 0.5);

        let hw = this.tile_width_ / 2;     
        let hh = this.tile_height_ / 2;

        //if (data.shape === Shape.rectangle || data.shape === Shape.wedge) {
        //    hh *= 0.5;
        //    y = this.tile_height_ * (data.row + 0.25);
        //}

        this.mesh_.initTransform(x, y, 4, hw, hh, this.getRotation());
    };

    getRotation() {
        return 0.5 * this.tile_data_.pivot * Math.PI;
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