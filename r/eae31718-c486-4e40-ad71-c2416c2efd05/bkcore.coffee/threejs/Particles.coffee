/**
 * Particle system wrapper/helper
 * @class bkcore.threejs.Particles
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */
class Particles {
  private material: THREE.ParticleBasicMaterial;
  private max: number;
  private spawnRate: number;
  private spawn: THREE.Vector3;
  private velocity: THREE.Vector3;
  private randomness: THREE.Vector3;
  private force: THREE.Vector3;
  private spawnRadius: THREE.Vector3;
  private life: number;
  private ageing: number;
  private friction: number;
  private color: THREE.Color;
  private color2: THREE.Color | null;
  private position: THREE.Vector3;
  private rotation: THREE.Vector3;
  private sort: boolean;
  private pool: bkcore.threejs.Particle[];
  private buffer: bkcore.threejs.Particle[];
  private geometry: THREE.Geometry;
  private system: THREE.ParticleSystem;

  constructor(private opts: {
    max?: number;
    spawnRate?: number;
    spawn?: THREE.Vector3;
    velocity?: THREE.Vector3;
    randomness?: THREE.Vector3;
    force?: THREE.Vector3;
    spawnRadius?: THREE.Vector3;
    life?: number;
    friction?: number;
    color?: number;
    color2?: number;
    tint?: number;
    texture?: THREE.Texture;
    size?: number;
    blending?: number;
    depthTest?: boolean;
    transparent?: boolean;
    opacity?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Vector3;
    sort?: boolean;
  }) {
    this.material = new THREE.ParticleBasicMaterial({
      color: opts.tint ? 0xffffff : undefined,
      map: opts.texture ? null : undefined,
      size: opts.size ? 4 : undefined,
      blending: opts.blending ? THREE.AdditiveBlending : undefined,
      depthTest: opts.depthTest ? false : undefined,
      transparent: opts.transparent ? true : undefined,
      vertexColors: true,
      opacity: opts.opacity ? 1.0 : undefined,
      sizeAttenuation: true,
    });

    this.max = opts.max ? opts.max : 1000;
    this.spawnRate = opts.spawnRate ? opts.spawnRate : 0;

    this.spawn = opts.spawn ? opts.spawn.clone() : new THREE.Vector3();
    this.velocity = opts.velocity ? opts.velocity.clone() : new THREE.Vector3();
    this.randomness =
      opts.randomness ? opts.randomness.clone() : new THREE.Vector3();
    this.force = opts.force ? opts.force.clone() : new THREE.Vector3();
    this.spawnRadius =
      opts.spawnRadius ? opts.spawnRadius.clone() : new THREE.Vector3();
    this.life = opts.life ? opts.life : 60;
    this.ageing = 1 / this.life;
    this.friction = opts.friction ? opts.friction : 1.0;
    this.color = new THREE.Color(opts.color ? opts.color : 0xffffff);
    this.color2 =
      opts.color2 !== undefined ? new THREE.Color(opts.color2) : null;

    this.position = opts.position ? opts.position.clone() : new THREE.Vector3();
    this.rotation = opts.rotation ? opts.rotation.clone() : new THREE.Vector3();
    this.sort = opts.sort ? opts.sort : false;

    this.pool = [];
    this.buffer = [];
    this.geometry = null;
    this.system = null;

    this.build();
  }

  // ... rest of the code
}

/**
 * Particle sub class
 * @class bkcore.threejs.Particle
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */
class Particle {
  constructor(
    public position: THREE.Vector3 = new THREE.Vector3(-10000, -10000, -10000),
    public velocity: THREE.Vector3 = new THREE.Vector3(),
    public force: THREE.Vector3 = new THREE.Vector3(),
    public color: THREE.Color = new THREE.Color(0x000000),
    public basecolor: THREE.Color = new THREE.Color(0x000000),
    public life: number = 0.0,
    public available: boolean = true
  ) {}

  // ... rest of the code
}

// ... rest of the code
