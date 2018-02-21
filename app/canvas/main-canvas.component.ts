import { Component, ViewChild, AfterViewInit } from "@angular/core";

import { WebglDirective } from "../webgl/webgl.directive";
import { RenderLoop } from "./render-loop";

@Component({
    selector: "main-canvas",
    template: `
    <canvas webgl canvas-controller></canvas>
    `,
    styles: [`
    canvas {
        height: 100%;
        width: 100%;
        border: none;
        position: absolute;
        z-index: 0;
    }
    `]
})
export class MainCanvas implements AfterViewInit {

    @ViewChild(WebglDirective) webgl_context_: WebglDirective;

    constructor(private render_loop_: RenderLoop) { };
    
    ngAfterViewInit() {
        this.webgl_context_.createContext();
        //window.Module = {
        //    print: function (text: string) { alert("stdout: " + text); },
        //    onRuntimeInitialized: () => {
        //        console.log("physics module initialised");
        //        //this.webgl_context_.begin();
        //        this.render_loop_.begin();
        //    }
        //};

        //let script = document.createElement("script");
        //script.src = "wasm/physics.js";
        //document.body.appendChild(script);
    };
}