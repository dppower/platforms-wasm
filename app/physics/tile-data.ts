export enum Material {
    rock,
    soil,
    grass,
    ice
}

export enum Flip {
    right,
    left
}

export enum Shape {
    square,
    triangle,
    rectangle,
    trapezoid,
    wedge
}

export enum Pivot {
    bottom_left,
    bottom_right,
    top_right,
    top_left
}

export interface TileData {
    column: number;
    row: number;
    shape: Shape;
    material: Material;
    flip: Flip //=> applies to trapezoid or wedge
    pivot: Pivot; //=> 0: pivot in bottom left
}