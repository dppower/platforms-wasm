import { InjectionToken } from "@angular/core"

import { BoxDimensions } from "./box-dimensions";

// World Dimensions
export const WORLD_WIDTH = new InjectionToken<number>("the width of the physical world");
export const WORLD_HEIGHT = new InjectionToken<number>("the height of the physical world");

// Dynamic objects
export const PLATFORM_DIMENSIONS = new InjectionToken<BoxDimensions[]>("platform dimensions");
export const PLAYER_DIMENSIONS = new InjectionToken<BoxDimensions>("player start");