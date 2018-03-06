import { StaticProvider } from "@angular/core";

import { WorldState } from "./world-state";
import { BoxDimensions, PlatformDimensions } from "./box-dimensions";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "./constant-tokens";
import { InputManager } from "../canvas/input-manager";

export const PHYSICS_PROVIDERS: StaticProvider[] = [
    { provide: WORLD_HEIGHT, useValue: 20 },
    { provide: WORLD_WIDTH, useValue: 20 },
    {
        provide: PLATFORM_DIMENSIONS,
        useValue: (<PlatformDimensions[]>[
            { x: 10, y: 10, w: 2.5, h: 5, r: 0.6, start_x: 4, start_y: 4, end_x: 16, end_y: 16 }
        ])
    },
    {
        provide: PLAYER_DIMENSIONS,
        useValue: (<BoxDimensions>{ x: 2, y: 0.9, w: 0.8, h: 1, r: 0 })
    },
    {
        provide: WorldState,
        useClass: WorldState,
        deps: [WORLD_WIDTH, WORLD_HEIGHT, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS, InputManager]
    }
];