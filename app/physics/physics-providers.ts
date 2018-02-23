import { StaticProvider } from "@angular/core";

import { WorldState } from "./world-state";
import { BoxDimensions } from "./box-dimensions";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "./constant-tokens";

export const PHYSICS_PROVIDERS: StaticProvider[] = [
    { provide: WORLD_HEIGHT, useValue: 50 },
    { provide: WORLD_WIDTH, useValue: 50 },
    {
        provide: PLATFORM_DIMENSIONS,
        useValue: (<BoxDimensions[]>[{ x: 20, y: 20, w: 5, h: 10, r: 0.6 }])
    },
    {
        provide: PLAYER_DIMENSIONS,
        useValue: (<BoxDimensions>{ x: 10, y: 0.9, w: 0.8, h: 1, r: 0 })
    },
    {
        provide: WorldState,
        useClass: WorldState,
        deps: [WORLD_WIDTH, WORLD_HEIGHT, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS]
    }
];