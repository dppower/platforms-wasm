import { Vec2, Vec2_T } from "./vec2";

export class Rot2 {

    get angle() {
        return Math.atan2(this.s, this.c);
    };

    constructor(private c: number, private s: number) { };

    static fromAngle(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return new Rot2(c, s);
    };

    static multiply(r1: Rot2, r2: Rot2) {
        let c = r1.c * r2.c - r1.c * r2.s;
        let s = r1.s * r2.c + r1.c * r2.s;

        return new Rot2(c, s);
    };

    setAngle(angle: number) {
        this.c = Math.cos(angle);
        this.s = Math.sin(angle);
    };

    setRotation(c: number, s: number) {
        this.c = c;
        this.s = s;
    };

    setIdentity() {
        this.c = 1;
        this.s = 0;
    };

    rotatePoint(point: Vec2_T): Vec2_T {
        return {
            x: this.c * point.x - this.s * point.y,
            y: this.s * point.x + this.c * point.y
        };
    };

    inverseRotate(point: Vec2_T): Vec2_T {
        return {
            x: this.c * point.x + this.s * point.y,
            y: -this.s * point.x + this.c * point.y
        };
    };   
};