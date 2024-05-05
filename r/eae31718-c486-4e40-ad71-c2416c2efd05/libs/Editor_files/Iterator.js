/**
 * The Iterator class provides a way to iterate over a range of values.
 *
 * @class
 */
pgli.lang.Iterator = gamecore.Base.extend('Iterator',
// Static
{
	/**
	 * The maximum number of iterations allowed.
	 *
	 * @type {number}
	 */
	MAX_ITERATIONS: 1000,

	/**
	 * A map of comparison operators and their corresponding values.
	 *
	 * @type {Object}
	 */
	COMPARATORS: {
		"<": 0,
		">": 1,
		"<=": 2,
		">=": 3
	},

	/**
	 * Generates a comparator method based on the given type.
	 *
	 * @param {number} type - The type of comparator to generate.
	 * @returns {Function} - The generated comparator method.
	 */
	genComparatorMethod: (type) => {
		switch (type) {
			case 0:
				return (a, b) => a < b;
			case 1:
				return (a, b) => a > b;
			case 2:
				return (a, b) => a <= b;
			case 3:
				return (a, b) => a >= b;
			default:
				return (a, b) => false;
		}
	},

	/**
	 * Generates a step method based on the given type.
	 *
	 * @param {number} type - The type of step to generate.
	 * @param {Object} scope - The object to apply the step to.
	 * @param {string} attr - The attribute of the object to step.
	 * @returns {Function} - The generated step method.
	 */
	genStepMethod: (type, scope, attr) => {
		switch (type) {
			case 1:
			case 3:
				return () => --scope[attr];
			case 0:
			case 2:
			default:
				return () => ++scope[attr];
		}
	}
},
// Instance
{
	/**
	 * The name of the variable used for iteration.
	 *
	 * @type {string}
	 */
	varname: "i",

	/**
	 * The starting value of the iteration.
	 *
	 * @type {number}
	 */
	start: 0,

	/**
	 * The comparison operator used for iteration.
	 *
	 * @type {number}
	 */
	comparator: 0,

	/**
	 * The ending value of the iteration.
	 *
	 * @type {number}
	 */
	end: 1,

	/**
	 * The generated comparator method.
	 *
	 * @type {Function}
	 */
	compMethod: null,

	/**
	 * The generated step method.
	 *
	 * @type {Function}
	 */
	stepMethod: null,

	/**
	 * The current step value.
	 *
	 * @type {number}
	 */
	step: 0,

	/**
	 * The current iteration number.
	 *
	 * @type {number}
	 */
	iter: 0,

	/**
	 * Initializes the iterator with the given name, start, comparator, and end.
	 *
	 * @param {string} name - The name of the variable used for iteration.
	 * @param {number} start - The starting value of the iteration.
	 * @param {string|number} comparator - The comparison operator used for iteration.
	 * @param {number} end - The ending value of the iteration.
	 */
	init: function(name, start, comparator, end) {
		const static = pgli.lang.Iterator;

		if (comparator in static.COMPARATORS) {
			this.comparator = static.COMPARATORS[comparator];
		} else {
			this.comparator = static.COMPARATORS["<"];
		}

		this.start = start;
		this.end = end;

		// Make sure start is less than end
		if (this.start >= this.end) {
			throw new Error("Start value must be less than end value.");
		}

		this.varname = name;
		this.compMethod = static.genComparatorMethod(this.comparator);
		this.stepMethod = static.genStepMethod(this.comparator, this, "step");
		this.step = start;
		this.iter = 0;
	},

	/**
	 * Checks if the iterator should continue iterating.
	 *
	 * @returns {boolean} - True if the iterator should continue iterating, false otherwise.
	 */
	loop: function() {
		return (this.iter < pgli.lang.Iterator.MAX_ITERATIONS && this.compMethod(this.step, this.end));
	},

	/**
	 * Advances the iterator to the next step.
	 *
	 * @returns {number} - The new step value.
	 */
	next: function() {
		++this.iter;
		return this.stepMethod();
	},

	/**
	 * Resets the iterator to its initial state.
	 */
	reset: function() {
		this.iter = 0;
		this.step = this.start;
	},

	/**
	 * Returns a string representation of the iterator.
	 *
	 * @returns {string} - The string representation of the iterator.
	 */
	toString: function() {
		return "Iterator(" + this.varname + ") " + this.start + " - " + this.step + " - " + this.end;
	}

});
