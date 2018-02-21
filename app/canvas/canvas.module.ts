import { NgModule, StaticProvider } from "@angular/core";
import { CommonModule } from "@angular/common";

// Modules
import { WebglModule } from "../webgl/webgl.module";
// Components
import { MainCanvas } from "./main-canvas.component";
// Directives
import { CanvasController } from "./canvas-controller.directive";
// Providers
import { InputManager } from "./input-manager";
import { RenderLoop } from "./render-loop";
import { Camera2d } from "./camera-2d";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../physics/constant-tokens";
import { PHYSICS_PROVIDERS } from "../physics/physics-providers";

const Camera: StaticProvider = {
    provide: Camera2d,
    useFactory: (input_manager: InputManager, world_width: number, world_height: number) => {
        return new Camera2d(
            input_manager, world_width, world_height, 0.1, 10
        );
    },
    deps: [
        InputManager, WORLD_WIDTH, WORLD_HEIGHT
    ]
};

@NgModule({
    imports: [ CommonModule, WebglModule ],
    declarations: [ MainCanvas, CanvasController ],
    providers: [ InputManager, RenderLoop, PHYSICS_PROVIDERS, Camera ],
    exports: [ MainCanvas ]
})
export class CanvasModule { };