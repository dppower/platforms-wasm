import { Directive, ElementRef, HostListener, Inject, Injector, StaticProvider } from "@angular/core";

import { Subscription } from "rxjs/Subscription";
import { SceneRenderer } from "../renderers/scene-renderer";
import { Camera2d } from "../canvas/camera-2d";
import { InputManager } from "../canvas/input-manager";
import { RenderLoop } from "../canvas/render-loop";
import { WEBGL, WEBGL_EXTENSIONS } from "./webgl-tokens";
import { SHADER_PROVIDERS, BASIC_SHADER } from "../shaders/shader-providers";
import { MESH_PROVIDERS, /*PLATFORMS,*/ SKY, RGB_COLORS, SQUARE_PRIMITIVE } from "../geometry/mesh-providers";
import { WORLD_HEIGHT, WORLD_WIDTH, PLATFORM_DIMENSIONS, PLAYER_DIMENSIONS } from "../physics/constant-tokens";
import { WorldState } from "../physics/world-state";

@Directive({
    selector: "[webgl]"
})
export class WebglDirective {

    private supported_extensions: string[];
    private enabled_extensions = new Map<string, boolean>();

    private render_context_: WebGLRenderingContext;

    private webgl_injector_: Injector;

    private scene_renderer_: SceneRenderer;

    private update_sub_: Subscription;
    private render_sub_: Subscription;

    constructor(private canvas_ref_: ElementRef, private render_loop_: RenderLoop,
        @Inject(WEBGL_EXTENSIONS) private webgl_extensions_: string[],
        private parent_injector_: Injector
    ) { };

    @HostListener("webglcontextlost", ["$event"])
    onContextLost(event: WebGLContextEvent) {
        // cancel animation loop
        // call dispose method on webgl resources.
        console.log("context lost");
        return false;
    };

    @HostListener("webglcontextrestored", ["$event"])
    onContextRestored(event: WebGLContextEvent) {
        if (this.createContext()) {
            // restart canvas loop
        };
        console.log("context restored");
        return false;
    };

    createContext() {
        let html_canvas = (<HTMLCanvasElement>this.canvas_ref_.nativeElement);
        this.render_context_ = html_canvas.getContext("webgl") || html_canvas.getContext("experimental-webgl");
        if (this.render_context_) {

            this.setExtensionAvailabilty();
            this.webgl_extensions_.forEach((extension: string) => {
                this.enableExtension(extension);
            });

            this.render_context_.clearColor(0.7, 0.7, 0.7, 1.0);
            this.render_context_.clearDepth(1.0);
            this.render_context_.enable(this.render_context_.DEPTH_TEST);
            this.render_context_.depthFunc(this.render_context_.LEQUAL);

            let providers: StaticProvider[] = [
                { provide: WEBGL, useValue: this.render_context_ },
                {
                    provide: SceneRenderer,
                    useClass: SceneRenderer,
                    deps: [WEBGL, BASIC_SHADER, SKY, SQUARE_PRIMITIVE, RGB_COLORS,
                        PLAYER_DIMENSIONS, PLATFORM_DIMENSIONS, WORLD_WIDTH, WORLD_HEIGHT,
                        WorldState, Camera2d, RenderLoop
                    ]
                },
                ...SHADER_PROVIDERS,
                ...MESH_PROVIDERS
            ];

            this.webgl_injector_ = Injector.create(providers, this.parent_injector_);
            this.scene_renderer_ = this.webgl_injector_.get(SceneRenderer);

            this.begin();
            return true;
        }
        else {
            console.log("Unable to initialise Webgl.");
            return false;
        }
    };

    begin() {
        this.scene_renderer_.initScene();
        this.update_sub_ = this.render_loop_.update_events
            .subscribe((dt) => {
                this.updateContext(dt);
            });

        this.render_sub_ = this.render_loop_.render_events
            .subscribe((factor) => {
                this.drawContext();
            });

        this.render_loop_.begin();
    };

    updateContext(dt: number) {
        this.scene_renderer_.updateScene(dt);
    };

    drawContext() {
        this.render_context_.clear(this.render_context_.COLOR_BUFFER_BIT | this.render_context_.DEPTH_BUFFER_BIT);
        this.render_context_.viewport(
            0, 0, this.render_context_.drawingBufferWidth, this.render_context_.drawingBufferHeight
        );

        this.scene_renderer_.drawScene();
    };

    isExtensionEnabled(extension: string): boolean {
        return this.enabled_extensions.get(extension);
    };

    enableExtension(extension: string) {
        if (this.supported_extensions.findIndex(x => x == extension) != -1) {
            this.render_context_.getExtension(extension);
            this.enabled_extensions.set(extension, true);
        }
        else {
            console.log("Webgl extension, " + extension + ", is not supported.");
        }
    };

    private setExtensionAvailabilty() {
        this.supported_extensions = this.render_context_.getSupportedExtensions();

        for (let i in this.supported_extensions) {
            this.enabled_extensions.set(this.supported_extensions[i], false);
        }
    };

    ngOnDestroy() {
        this.render_loop_.stop();
        this.update_sub_ && this.update_sub_.unsubscribe();
        this.render_sub_ && this.render_sub_.unsubscribe();
    };
}

