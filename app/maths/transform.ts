import { Rot2 } from "./rot2";
import { Vec2, Vec2_T } from "./vec2";

export class Transform {
   
    get has_changed() {
        return this.has_changed_;
    };

    get position() {
        return this.position_;
    };

    get rotation() {
        return this.rotation_;
    };

    get angle() {
        return this.rotation_.angle;
    };

    set position(value: Vec2_T) {
        this.position_.copy(value);
        this.has_changed_ = true;
    };

    setRotation(c: number, s: number) {
        this.rotation_.setRotation(c, s);
        this.has_changed_ = true;
    };

    set angle(angle: number) {
        this.rotation_.setAngle(angle);
        this.has_changed_ = true;
    };

    private has_changed_ = true;

    private position_: Vec2;
    private rotation_: Rot2;
    
    constructor(position: Vec2_T, rotation = 0) {
        this.position_ = new Vec2(position);
        this.rotation_ = Rot2.fromAngle(rotation);
     };

    reset() {
        this.has_changed_ = false;
    };

    applyTransform(point: Vec2_T): Vec2_T {
        return Vec2.add(this.rotation_.rotatePoint(point), this.position_);
    };

    applyInverse(point: Vec2_T): Vec2_T {
        return this.rotation_.inverseRotate(Vec2.subtract(point, this.position_));
    };
}