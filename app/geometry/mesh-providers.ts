import { InjectionToken, StaticProvider } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { Camera2d } from "../canvas/camera-2d";
import { Mesh } from "./mesh";
import { MeshData } from "./mesh-data";
import { Primitive } from "./primitive";
import { square_mesh_data } from "./square-mesh";
import { circle_mesh_data } from "./circle-mesh";

const SQUARE_BUFFER = new InjectionToken<Primitive[]>("square primitive");
const SQUARE_MESH = new InjectionToken<MeshData>("square mesh data");
const CIRCLE_BUFFER = new InjectionToken<Primitive[]>("circle primitive");
const CIRCLE_MESH = new InjectionToken<MeshData>("cirle mesh data");

// Platforms
export const PLATFORMS = new InjectionToken<Mesh[]>("platform mesh");
// Sky
export const SKY = new InjectionToken<Mesh>("sky mesh");
// Player
export const PLAYER = new InjectionToken<Mesh>("player mesh");

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
    { provide: SQUARE_MESH, useValue: square_mesh_data },
    {
        provide: SQUARE_BUFFER,
        useClass: Primitive,
        deps: [WEBGL, SQUARE_MESH],
        multi: true
    },
    { provide: PLATFORMS, useClass: Mesh, deps: [WEBGL, SQUARE_BUFFER, Camera2d], multi: true },
    { provide: SKY, useClass: Mesh, deps: [WEBGL, SQUARE_BUFFER, Camera2d] },
    { provide: CIRCLE_MESH, useValue: circle_mesh_data },
    {
        provide: CIRCLE_BUFFER,
        useFactory: (context: WebGLRenderingContext, mesh: MeshData) => new Primitive(context, mesh, 6),
        deps: [WEBGL, CIRCLE_MESH],
        multi: true
    },
    { provide: PLAYER, useClass: Mesh, deps: [WEBGL, SQUARE_BUFFER, Camera2d] },
];