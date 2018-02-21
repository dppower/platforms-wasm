import { StaticProvider, InjectionToken } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderProgram } from "./shader-program";
import { VertexShaderSource, FragmentShaderSource } from "./shader";
import { ActiveProgramAttributes } from "./active-program-attributes";

const BASIC_VERTEX_SHADER = new InjectionToken<VertexShaderSource>("vertex-shader");
const BASIC_FRAGMENT_SHADER = new InjectionToken<FragmentShaderSource>("fragment-shader");
export const BASIC_SHADER = new InjectionToken<ShaderProgram>("uniform shader");

export const SHADER_PROVIDERS: StaticProvider[] = [
    { provide: ActiveProgramAttributes, useClass: ActiveProgramAttributes, deps: [] },
    {
        provide: BASIC_VERTEX_SHADER, useValue: {
            attributes: ["POSITION"],
            uniforms: ["u_view_matrix", "u_projection_matrix"],
            source: `
            #version 100
            attribute vec3 POSITION;
            uniform mat4 u_view_matrix;
            uniform mat4 u_projection_matrix;
            void main(void) {
            gl_Position = u_projection_matrix * u_view_matrix * vec4(POSITION, 1.0);
            }`
        }
    },
    {
        provide: BASIC_FRAGMENT_SHADER, useValue: {
            attributes: [],
            uniforms: ["u_base_color"],
            source: `
            #version 100
            precision mediump float;
            uniform vec4 u_base_color;
            //uniform sampler2D u_base_color_texture;
            void main(void) {
            gl_FragColor = u_base_color;
            }`
        }
    },
    {
        provide: BASIC_SHADER,
        useClass: ShaderProgram,
        deps: [WEBGL, BASIC_VERTEX_SHADER, BASIC_FRAGMENT_SHADER, ActiveProgramAttributes]
    }
];
