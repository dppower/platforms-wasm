import { StaticProvider } from "@angular/core";

import { WorldState } from "./world-state";
import { BoxDimensions, PlatformDimensions } from "./box-dimensions";
import { TileData } from "./tile-data";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS, TILE_DATA } from "./constant-tokens";
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
            { p: 0.8, hw: 0.8, hh: 1.4, r: 0, start_x: 4, start_y: 2, end_x: 12, end_y: 2 }
        ),
        multi: true
    },
    {
        provide: TILE_DATA,
        useValue: (<TileData[]>[
            { column: 1, row: 2, shape: 0, material: 0, flip: 0, pivot: 1 },
            { column: 1, row: 3, shape: 1, material: 1, flip: 0, pivot: 1 },
            { column: 1, row: 4, shape: 2, material: 2, flip: 0, pivot: 1 },
            { column: 1, row: 5, shape: 3, material: 3, flip: 0, pivot: 1 },
            { column: 1, row: 6, shape: 4, material: 0, flip: 0, pivot: 1 }
        ])
    },
    {
        provide: PLAYER_DIMENSIONS,
        useValue: (<BoxDimensions>{ x: 2, y: 0.9, hw: 0.4, hh: 0.5, r: 0 })
    },
    {
        provide: WorldState,
        useClass: WorldState,
        deps: [WORLD_WIDTH, WORLD_HEIGHT, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS, TILE_DATA, InputManager]
    }
];