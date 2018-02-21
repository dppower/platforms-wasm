import { Injectable } from "@angular/core";

import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "./constant-tokens";

@Injectable()
export class WorldState {

    private is_initialised_ = false;
    private world_module_: any;

    constructor() {

    };

    initWorld() {
        this.world_module_ = new window.Module.World();
        this.world_module_.init(0.2, 0.2);
        console.log(this.world_module_);
    };

    stepWorld(dt: number) {
        if (!this.is_initialised_) return;
        this.world_module_.tick(dt);
    };
}