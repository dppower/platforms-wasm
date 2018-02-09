import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";

import { RenderLoop } from "./render-loop";

@Component({
    selector: 'main-canvas',
    template: `
    <canvas canvas-controller></canvas>
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
export class MainCanvas implements OnInit, AfterViewInit, OnDestroy {
    
    constructor(private render_loop_: RenderLoop) { };

    ngOnInit() {};

    ngAfterViewInit() {
        window.Module = {
            print: function (text: string) { alert("stdout: " + text); },
            onRuntimeInitialized: () => {
                console.log("loaded module.");
                this.render_loop_.begin();
            }
        };

        let script = document.createElement("script");
        script.src = "wasm/physics.js";
        document.body.appendChild(script);
    };

    ngOnDestroy() {
        this.render_loop_.stop();
    };
}