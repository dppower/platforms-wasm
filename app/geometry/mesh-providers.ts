import { InjectionToken, StaticProvider } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { Primitive } from "./primitive";
import { square_mesh_data } from "./square-mesh";
import { circle_mesh_data } from "./circle-mesh";
import { arrow_mesh_data } from "./arrow-mesh";
import { left_trapezoid_mesh, right_trapezoid_mesh } from "./trapezoid-mesh";
import { left_wedge_tile, right_wedge_tile } from "./wedge-tile";
import { triangle_tile_mesh_data } from "./triangle-mesh";
import { rectangle_tile_mesh } from "./rectangle-tile";

// Primitives
export type PrimitiveTypes = "square" | "circle" | "arrow" | "rectangle" |
    "left-trapezoid" | "right-trapezoid" | "triangle" | "left-wedge" | "right-wedge";
export type PrimitiveMap = Map<PrimitiveTypes, Primitive[]>;
export const PRIMITIVES = new InjectionToken<PrimitiveMap>("map of primitives");

// Colors
export const HEX_COLORS = new InjectionToken<string[]>("hex colors");
export const RGB_COLORS = new InjectionToken<number[][]>("rgb colors");

function hexToRGBA(hex: string) {
    const valid_hex = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?$/i;
    let matchs = hex.match(valid_hex);

    if (matchs) {
        let r = parseInt(matchs[1], 16) / 255;
        let g = parseInt(matchs[2], 16) / 255;
        let b = parseInt(matchs[3], 16) / 255;
        let a = (matchs[4]) ? parseInt(matchs[4], 16) / 255 : 1;
        return [r, g, b, a];
    }
    else {
        return [1, 1, 1, 1];
    }
}

export const MESH_PROVIDERS: StaticProvider[] = [
    {
        provide: HEX_COLORS,
        useValue: ["#ea8d21", "#f87945", "#f2b846", "#f47d0d", "#d8a238",
            "#f37e2f", "#c9952a", "#edaa21", "#c9952a", "#e79b39"]
    },
    {
        provide: RGB_COLORS,
        useFactory: (array: string[]) => { return array.map(hex => hexToRGBA(hex)); },
        deps: [HEX_COLORS]
    },
    {
        provide: PRIMITIVES,
        useFactory: (context: WebGLRenderingContext): PrimitiveMap => {
            let map = new Map<PrimitiveTypes, Primitive[]>();
            map.set("square", [new Primitive(context, square_mesh_data)]);
            map.set("triangle", [new Primitive(context, triangle_tile_mesh_data)]);
            map.set("circle", [new Primitive(context, circle_mesh_data)]);
            map.set("arrow", [new Primitive(context, arrow_mesh_data)]);
            map.set("rectangle", [new Primitive(context, rectangle_tile_mesh)]);
            map.set("left-trapezoid", [new Primitive(context, left_trapezoid_mesh)]);
            map.set("right-trapezoid", [new Primitive(context, right_trapezoid_mesh)]);
            map.set("left-wedge", [new Primitive(context, left_wedge_tile)]);
            map.set("right-wedge", [new Primitive(context, right_wedge_tile)]);
            return map;
        },
        deps: [WEBGL]
    }
];