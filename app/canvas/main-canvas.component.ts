import { Component, OnInit, AfterViewInit } from "@angular/core";

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
export class MainCanvas implements OnInit, AfterViewInit {

    //load_module = false;

    constructor(private render_loop_: RenderLoop) { };

    ngOnInit() {
        //this.render_loop_.loadPhysicsModule();
    };

    ngAfterViewInit() {
        //Module = {
        //    print: function (text: string) { alert("stdout: " + text); },
        //    onRuntimeInitialized: () => {
        //        console.log("loaded module.");
        //        //window.Module.main();
        //    }
        //};
        console.log(window.Module);
        //Module._main();
        //let script = document.createElement("script");
        //script.src = "wasm/hello_world.js";
        //script.type = "application/wasm";
        //document.body.appendChild(script);
    };
}