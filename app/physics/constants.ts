import { InjectionToken, StaticProvider } from "@angular/core";

import { Vec2_T } from "../maths/vec2";

export const WORLD_WIDTH = new InjectionToken<number>("the width of the physical world");
export const WORLD_HEIGHT = new InjectionToken<number>("the height of the physical world");

export interface PlatformDimensions {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
}

export const PLATFORM_DIMENSIONS = new InjectionToken<PlatformDimensions[]>("platform dimensions");

export const PLAYER_START = new InjectionToken<Vec2_T>("player start");

export const WORLD_CONSTANTS: StaticProvider[] = [
    { provide: WORLD_HEIGHT, useValue: 50 },
    { provide: WORLD_WIDTH, useValue: 50 },
    {
        provide: PLATFORM_DIMENSIONS,
        useValue: (<PlatformDimensions[]>[{ x: 20, y: 20, w: 5, h: 10, r: 0.6 }])
    },
    {
        provide: PLAYER_START,
        useValue: { x: 10, y: 1 }
    }
];