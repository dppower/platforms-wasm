// This is required when VertexArrayObjects are not available.
export class ActiveProgramAttributes {
    private active_attribute_count = 0;

    checkAttributeCount(attribute_count: number, gl: WebGLRenderingContext) {
        let actives_difference = attribute_count - this.active_attribute_count;

        if (actives_difference > 0) {
            for (let i = 0; i < actives_difference; i++) {
                gl.enableVertexAttribArray(this.active_attribute_count + i);
            }
        }
        else if (actives_difference < 0) {
            for (let i = 0; i > actives_difference; i--) {
                gl.disableVertexAttribArray(this.active_attribute_count - 1 + i);
            }
        }
        this.active_attribute_count = attribute_count;
    };
}