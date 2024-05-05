/**
 * RGB Halftone shader for three.js.
 * 
 * @author meatbags / xavierburrow.com, github/meatbags
 *
 * Shader parameters:
 * 	shape (1 = Dot, 2 = Ellipse, 3 = Line, 4 = Square)
 * 	radius (size of the halftone dots)
 * 	rotateR, rotateG, rotateB (rotation of the halftone pattern for each color channel)
 * 	scatter (random displacement of the halftone dots)
 * 	width, height (resolution of the texture)
 * 	blending (blending mode for combining the halftone pattern with the input texture)
 * 	greyscale (whether to convert the output to greyscale)
 * 	disable (whether to disable the shader and use the input texture directly)
 */

const SQRT2_MINUS_ONE = 0.41421356;
const SQRT2_HALF_MINUS_ONE = 0.20710678;
const PI2 = 6.28318531;
const SHAPE_DOT = 1;
const SHAPE_ELLIPSE = 2;
const SHAPE_LINE = 3;
const SHAPE_SQUARE = 4;
const BLENDING_LINEAR = 1;
const BLENDING_MULTIPLY = 2;
const BLENDING_ADD = 3;
const BLENDING_LIGHTER = 4;
const BLENDING_DARKER = 5;

THREE.HalftoneShader = {

	uniforms: {
		"tDiffuse": { value: null },
		"shape": { value: 1 },
		"radius": { value: 4 },
		"rotateR": { value: Math.PI / 12 * 1 },
		"rotateG": { value: Math.PI / 12 * 2 },
		"rotateB": { value: Math.PI / 12 * 3 },
	
