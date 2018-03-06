﻿export interface BoxDimensions {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
}

export interface PlatformDimensions extends BoxDimensions {
    start_x: number;
    start_y: number;
    end_x: number;
    end_y: number;
}