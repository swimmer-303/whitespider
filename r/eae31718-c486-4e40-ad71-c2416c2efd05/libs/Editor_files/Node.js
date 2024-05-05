/**
 * PGLI Diagram Node class
 * @class
 * @extends gamecore.Base
 * @param {string} key - The key of the node
 * @param {object} module - The module of the node
 * @param {number} x - The x coordinate of the node
 * @param {number} y - The y coordinate of the node
 */
var pgli = pgli || {};
pgli.diagram = pgli.diagram || {};

pgli.diagram.Node = gamecore.Base.extend('Node',
{ // static
	layersWidth: 20,
	layersMargin: 20,
	layersHeight: 16,
	headerHeight: 40,
	slotX: 10,
	slotY: 14,
	slotRadius: 6
},
{ // instance
	module: null,

	key: null,

	shape: null,
	background: null,
	name: null,
	layers: null,
	slot: null,

	sockets: [],

	width: 150,
	height: 200,

	/**
	 * Initialize the node
	 * @param {string} key - The key of the node
	 * @param {object} module - The module of the node
	 * @param {number} x - The x coordinate of the node
	 * @param {number} y - The y coordinate of the node
	 */
	init: function(key, module, x, y)
	{
		var static = pgli.diagram.Node;

		this.key = key;
		if (module) {
			this.module = module;
		} else {
			console.error('Module is undefined or null');
			return;
	
