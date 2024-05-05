/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function (shader, textureID) {
    THREE.Pass.call(this);

    this.textureID = textureID !== undefined ? textureID : "tDiffuse";

    if (shader instanceof THREE.ShaderMaterial) {
        this.uniforms = shader.uniforms;
        this.material = shader;
    } else if (shader) {
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        this.material = new THREE.ShaderMaterial({
            defines: {...shader.defines},
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });
    } else {
        console.error("Shader is not defined.");
        return;
    }

    this.fsQuad = new THREE.Pass.FullScreenQuad(this.material);
};

THREE.ShaderPass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {
    constructor: THREE.ShaderPass,

    renderToScreen: {
        value: false
    },

    clear: {
        value: true
    },

    render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        if (!this.uniforms[this.textureID]) {
            console.error("textureID not found in uniforms.");
            return;
        }

        this.uniforms[this.textureID].value = readBuffer.texture;
        this.fsQuad.material = this.material;

        this.renderFullScreenQuad(renderer, writeBuffer, this.fsQuad, deltaTime, maskActive);
    },

    renderFullScreenQuad: function (renderer, writeBuffer, fsQuad, deltaTime, maskActive) {
        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
            fsQuad.render(renderer);
        }
    }
});
