import { Component } from "@angular/core";

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
export class MainCanvas { }