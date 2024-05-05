/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

const Detector = {
  canvas: 'CanvasRenderingContext2D' in window,
  webgl: (function() {
    try {
      const canvas = document.createElement('canvas');
      return 'WebGLRenderingContext' in window && canvas.getContext('experimental-webgl');
    } catch(e) {
      return false;
    }
  })(),
  workers: 'Worker' in window,
  fileapi: 'File' in window && 'FileReader' in window && 'FileList' in window && 'Blob' in window,

  getWebGLErrorMessage: function() {
    const element = document.createElement('div');
    element.id = 'webgl-error-message';
    element.style.fontFamily = 'monospace';
    element.style.fontSize = '13px';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.background = '#fff';
    element.style.color = '#000';
    element.style.padding = '1.5em';
    element.style.width = '400px';
    element.style.margin = '5em auto 0';

    if (!this.webgl) {
      const message = this.webgl = window.WebGLRenderingContext
        ? ['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
          'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.']
        .join('\n')
        : ['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
          'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.']
        .join('\n');

      element.innerHTML = message.trim();
    }

    return element;
  },

  addGetWebGLMessage: function(parameters) {
    const parent = parameters.parent !== undefined ? parameters.parent : document.body;
    const id = parameters.id !== undefined ? parameters.id : 'oldie';
    const element = this.getWebGLErrorMessage();
    element.id = id;

    parent.insertBefore(element, parent.firstChild);
  }
};
