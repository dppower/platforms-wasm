import { NgModule } from "@angular/core";

import { WebglDirective } from "./webgl.directive";
import { WEBGL_EXTENSIONS } from "./webgl-tokens";

@NgModule({
    declarations: [ WebglDirective ],
    providers: [
        {
            provide: WEBGL_EXTENSIONS,
            useValue: ["OES_texture_float", "OES_texture_float_linear", "WEBGL_color_buffer_float"]
        }
    ],
    exports: [ WebglDirective]
})
export class WebglModule { };