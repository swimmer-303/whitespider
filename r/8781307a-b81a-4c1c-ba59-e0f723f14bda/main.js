// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = 422,
	height = 552;

canvas.width = width;
canvas.height = height;

// Variables for game
let platforms = [];
let image;
let player;
const platformCount = 10;
let position = 0;
const gravity = 0.2;
let animloop;
let flag = 0;
let broken = 0;
let dir;
let score = 0;
let firstRun = true;

// Initialize the game
function initializeGame() {
	image = document.getElementById("sprite");

	platforms = createPlatforms(platformCount);
	player = createPlayer();
	createBase();

	animloop = function() {
		update();
		requestAnimFrame(animloop);
	};

	animloop();
}

// Create a new platform object
function createPlatform(type) {
	return {
		width: 70,
		height: 17,
		x: Math.random() * (width - this.width),
		y: position,
		flag: 0,
		state: 0,
		types: getPlatformTypes(score),
		type: this.types[Math.floor(Math.random() * this.types.length)],
		cx: 0,
		cy: 0,
	
