import { Rot2 } from "./rot2";
import { Vec2, Vec2_T } from "./vec2";

export class Transform {
   
    get matrix() {
        return this.transform_matrix_;
    };
    
    private position_: Vec2;
    private scale_: Vec2;
    private rotation_: Rot2;

    private transform_matrix_ = new Float32Array(9);

    constructor(position: Vec2_T, scale: Vec2_T, rotation: number) {
        this.position_ = new Vec2(position);
        this.scale_ = new Vec2(scale);
        this.rotation_ = Rot2.fromAngle(rotation);
    };

    update() {
    };

    applyTransform(point: Vec2_T): Vec2_T {
        return Vec2.add(this.rotation_.rotatePoint(point), this.position_);
    };

    applyInverse(point: Vec2_T): Vec2_T {
        return this.rotation_.inverseRotate(Vec2.subtract(point, this.position_));
    };
}