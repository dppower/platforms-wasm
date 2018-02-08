import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Modules
// Components
import { MainCanvas } from "./main-canvas.component";
// Directives
import { CanvasController } from "./canvas-controller.directive";
// Providers
import { InputManager } from "./input-manager";
import { RenderLoop } from "./render-loop";

@NgModule({
    imports: [ CommonModule ],
    declarations: [ MainCanvas, CanvasController ],
    providers: [ InputManager, RenderLoop ],
    exports: [ MainCanvas ]
})
export class CanvasModule { };