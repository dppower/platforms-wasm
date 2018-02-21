import { Inject, Injectable } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderType, compileShader, VertexShaderSource, FragmentShaderSource } from "./shader";
import { ActiveProgramAttributes } from "./active-program-attributes";

@Injectable()
export class ShaderProgram {

    get attribute_count() { return this.attribute_count_; };

    private attribute_count_: number;
    private attributes_= new Map<string, number>();
    private uniforms_ = new Map<string, WebGLUniformLocation>();
    private program_: WebGLProgram;

    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        private vertex_shader_source: VertexShaderSource,
        private fragment_shader_source: FragmentShaderSource,
        private active_attribute_counter: ActiveProgramAttributes
    ) { };

    deleteProgram() {
        this.gl.deleteProgram(this.program_);
    };

    getAttribute(name: string): number {
        return this.attributes_.get(name);
    };

    getUniform(name: string): WebGLUniformLocation {
        return this.uniforms_.get(name);
    };

    initProgram() {
        let vertex_shader = compileShader(
            this.gl, ShaderType.Vertex, this.vertex_shader_source.source
        );

        let fragment_shader = compileShader(
            this.gl, ShaderType.Fragment, this.fragment_shader_source.source
        );

        this.program_ = this.gl.createProgram();
        this.gl.attachShader(this.program_, vertex_shader);
        this.gl.attachShader(this.program_, fragment_shader);
        this.gl.linkProgram(this.program_);

        if (!this.gl.getProgramParameter(this.program_, this.gl.LINK_STATUS)) {
            console.log("Program link error: " + this.gl.getProgramInfoLog(this.program_));

            this.gl.deleteProgram(this.program_);

            this.gl.deleteShader(vertex_shader);
            this.gl.deleteShader(fragment_shader);

            alert("Unable to initialize the shader program."); 
        }

        this.gl.detachShader(this.program_, vertex_shader);
        this.gl.detachShader(this.program_, fragment_shader);

        this.gl.deleteShader(vertex_shader);
        this.gl.deleteShader(fragment_shader);

        this.setAttributeIds(this.gl);
        this.locateUniforms(this.gl);
    };

    useProgram() {
        this.gl.useProgram(this.program_);
        this.active_attribute_counter.checkAttributeCount(this.attribute_count_, this.gl);
    };

    private locateUniforms(gl: WebGLRenderingContext) {
        this.vertex_shader_source.uniforms.forEach((uniform_name) => {
            let uniform_location = this.gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });

        this.fragment_shader_source.uniforms.forEach((uniform_name) => {
            let uniform_location = this.gl.getUniformLocation(this.program_, uniform_name);
            this.uniforms_.set(uniform_name, uniform_location);
        });
    };

    private setAttributeIds(gl: WebGLRenderingContext) {
        this.vertex_shader_source.attributes.forEach((attribute_name) => {
            let attrib_id = this.gl.getAttribLocation(this.program_, attribute_name);
            this.attributes_.set(attribute_name, attrib_id);

            this.attribute_count_ = this.attributes_.size;
        });
    };
}