/**
 * @class pgli.diagram.Links
 * @extends gamecore.Base
 */
var pgli = pgli || {};
pgli.diagram = pgli.diagram || {};

pgli.diagram.Links = gamecore.Base.extend('Links',
/** @lends pgli.diagram.Links.prototype */
{
	bezierOffset: 50
},
/** @lends pgli.diagram.Links.prototype */
{
	/**
	 * The diagram that this Links object belongs to.
	 * @type {pgli.diagram.Diagram}
	 */
	diagram: null,

	/**
	 * The shape representing the links on the KineticJS layer.
	 * @type {Kinetic.Shape}
	 */
	shape: null,

	/**
	 * Initializes a new instance of the pgli.diagram.Links class.
	 * @param {pgli.diagram.Diagram} diagram - The diagram that this Links object belongs to.
	 */
	init: function(diagram)
	{
		const static = pgli.diagram.Links;
		const self = this;

		this.diagram = diagram;

		this.shape = new Kinetic.Shape({
			drawFunc: function(ctx){
				ctx.beginPath();

				diagram.nodes.forEach(function(node) {
					if (!node.module || !node.module.layers || !Array.isArray(node.module.layers)) {
						return;
					}

					node.module.layers.forEach(function(layer) {
						if (!layer.use || typeof layer.use !== 'string') {
							return;
						}

						const start = node.getLayerSlot(layer.index);
						const tNode = diagram.getNode(layer.use);

						if (!tNode) {
							return;
						}

						const end = tNode.getSlot();

						ctx.moveTo(start[0], start[1]);
						ctx.bezierCurveTo(
							start[0]+static.bezierOffset, start[1],
							end[0]-static.bezierOffset, end[1],
							end[0], end[1]);
					});
				});

				this.stroke(ctx);
			},
			x: 0,
			y: 0,
			stroke: "#999",
			strokeWidth: 3,
			lineCap: "round"
		});
	}
});
