import { Injectable, Inject } from "@angular/core";

import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "./constant-tokens";
import { BoxDimensions, PlatformDimensions } from "./box-dimensions";
import { InputManager } from "../canvas/input-manager";

@Injectable()
export class WorldState {

    get initialised() {
        return this.is_initialised_;
    };
    
    private is_initialised_ = false;
    private world_module_: World;

    private data_pointer_: number; //=> Byte
    private data_offset_: number; //=> Float

    private input_pointer_: number;

    private platform_count_: number;

    constructor(        
        @Inject(WORLD_WIDTH) private world_width_: number,
        @Inject(WORLD_HEIGHT) private world_height_: number,
        @Inject(PLATFORM_DIMENSIONS) private platforms_: PlatformDimensions[],
        @Inject(PLAYER_DIMENSIONS) private player_: BoxDimensions,
        private input_manager_: InputManager
    ) { };

    initWorld() {
        this.initTransforms();
        this.world_module_ = new Module.World();
        this.world_module_.init(this.world_width_, this.world_height_,
            this.input_pointer_, this.data_pointer_, this.platform_count_
        );
        this.is_initialised_ = true;
    };

    initTransforms() {
        this.platform_count_ = this.platforms_.length;
        let initial_values: number[] = [];
        initial_values.push(
            this.player_.x, this.player_.y, this.player_.hw, this.player_.hh,
            Math.cos(this.player_.r), Math.sin(this.player_.r)
        );

        this.platforms_.forEach(platform => {
            initial_values.push(
                platform.x, platform.y, platform.hw, platform.hh,
                Math.cos(platform.r), Math.sin(platform.r),
                platform.start_x, platform.start_y,
                platform.end_x, platform.end_y
            );
        });

        // Allocate memory for transforms
        this.data_pointer_ = Module._malloc(initial_values.length * 4);
        this.data_offset_ = this.data_pointer_ >> 2;
        Module.HEAPF32.set(initial_values, this.data_offset_);

        // Allocate memory for inputs
        this.input_pointer_ = Module._malloc(56);
    };

    getTransform(index: number): Float32Array {
        if (index === 0) {
            let begin = this.data_offset_;
            let end = begin + 6;
            return Module.HEAPF32.subarray(begin, end);
        }
        else {
            let begin = this.data_offset_ + 6 + (index - 1) * 10;
            let end = begin + 10;
            return Module.HEAPF32.subarray(begin, end);
        }
    };

    updateWorld(dt: number) {
        if (!this.is_initialised_) return;

        this.input_manager_.updateInputStates(this.input_pointer_);
        this.world_module_.tick(dt);
    };

    dispose() {
        Module._free(this.data_pointer_);
        Module._free(this.input_pointer_);
    };
}