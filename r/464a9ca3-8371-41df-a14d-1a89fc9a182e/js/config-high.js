// Configuration object for the application
const config: {
	base_path: string;
	logs: boolean;
	debug: boolean;
	camera: {
		fov: number;
		aspect: number;
		near: number;
		far: number;
		controls: boolean;
		helper: boolean;
	};
	renderer: {
		width: number;
		height: number;
		render_at: number;
		interval: boolean | number;
		fps_counter: boolean;
		antialias: boolean;
		shadows: boolean;
		shadows_type: any;
		fog: boolean;
		toneMapping: boolean;
		effects: boolean;
		postprocessing: {
			enable: boolean;
			sao: boolean;
		};
	};
	IS_HIDPI: boolean;
	IS_IOS: boolean;
	IS_MOBILE: boolean;
} = {
	base_path: document.baseURI,
	logs: true,
	debug: false,
	camera: {
		fov: 45,
		aspect: 0,
		near: 0.1,
		far: 200,
		controls: false,
		helper: false
	},
	renderer: {
		// half size for performance
		width: Math.max(300, window.innerWidth),
		height: Math.max(300, window.innerHeight),
		render_at: 1, // render resolution (lower - more fps at cost of quality)
		interval: false, // fps cap (false for no fps limit)
		fps_counter: true, // only works for fps cap

		// graphics settings
		antialias: true, // AA
		shadows: true, // cast shadows (2K only)?
		shadows_type: THREE.PCFSoftShadowMap,
		fog: true, // show fog?
		toneMapping: true, // enable tone mapping (Uncharted2)?
		effects: true, // daytime, rain, etc
		postprocessing: {
			enable: false, // enable postprocessing?
			sao: false, // Scaling Ambient Occlusion
		}
	},
	IS_HIDPI: window.devicePixelRatio > 1,

	// iPads are returning "MacIntel" for iOS 13 (devices & simulators).
	// Chrome on macOS also returns "MacIntel" for navigator.platform,
	// but navigator.userAgent includes /Safari/.
	// TODO(crbug.com/998999): Fix navigator.userAgent such that it reliably
	// returns an agent string containing "CriOS".
	IS_IOS: (/CriOS/.test(navigator.userAgent) ||
		/iPad|iPhone|iPod|MacIntel/.test(navigator.platform) &&
		!(/Safari/.test(navigator.userAgent))),

	IS_MOBILE: /Android/.test(navigator.userAgent) || config.IS_IOS
};

// Set the aspect ratio of the camera after the window size has been set
config.camera.aspect = config.renderer.width / config.renderer.height;

