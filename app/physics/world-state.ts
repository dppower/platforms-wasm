import { Injectable, Inject } from "@angular/core";

import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "./constant-tokens";
import { BoxDimensions } from "./box-dimensions";

@Injectable()
export class WorldState {

    get initialised() {
        return this.is_initialised_;
    };

    private is_initialised_ = false;
    private world_module_: any;

    private array_pointer_: number; //=> Byte
    private array_offset_: number; //=> Float

    private platform_count_: number;

    constructor(        
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number,
        @Inject(PLATFORM_DIMENSIONS) private platforms_: BoxDimensions[],
        @Inject(PLAYER_DIMENSIONS) private player_: BoxDimensions
    ) { };

    initWorld() {
        this.initTransforms();
        this.world_module_ = new window.Module.World();
        this.world_module_.init(this.world_width_, this.world_height_, this.array_pointer_, this.platform_count_);
        this.is_initialised_ = true;
    };

    initTransforms() {
        this.platform_count_ = this.platforms_.length;
        let initial_values: number[] = [];
        initial_values.push(
            this.player_.x, this.player_.y, this.player_.w, this.player_.h,
            Math.cos(this.player_.r), Math.sin(this.player_.r)
        );

        this.platforms_.forEach(platform => {
            initial_values.push(
                platform.x, platform.y, platform.w, platform.h,
                Math.cos(platform.r), Math.sin(platform.r)
            );
        });

        this.array_pointer_ = Module._malloc(initial_values.length * 4);
        this.array_offset_ = this.array_pointer_ >> 2;
        Module.HEAPF32.set(initial_values, this.array_offset_);
    };

    getTransform(index: number): Float32Array {
        let begin = this.array_offset_ + index * 6;
        let end = begin + 6;
        return Module.HEAPF32.subarray(begin, end);
    };

    updateWorld(dt: number) {
        if (!this.is_initialised_) return;
        this.world_module_.tick(dt);
    };

    dispose() {
        Module._free(this.array_pointer_);
    };
}