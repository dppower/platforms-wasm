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
        useValue: (<PlatformDimensions>
            { p: 0.5, hw: 1.2, hh: 2.0, r: 0.6, start_x: 4, start_y: 4, end_x: 16, end_y: 16 }
        ),
        multi: true
    },
    {
        provide: PLATFORM_DIMENSIONS,
        useValue: (<PlatformDimensions>
            { p: 0.8, hw: 0.6, hh: 1.2, r: 0, start_x: 4, start_y: 4, end_x: 16, end_y: 4 }
        ),
        multi: true
    },
    {
        provide: PLAYER_DIMENSIONS,
        useValue: (<BoxDimensions>{ x: 2, y: 0.9, hw: 0.4, hh: 0.5, r: 0 })
    },
    {
        provide: WorldState,
        useClass: WorldState,
        deps: [WORLD_WIDTH, WORLD_HEIGHT, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS, InputManager]
    }
];