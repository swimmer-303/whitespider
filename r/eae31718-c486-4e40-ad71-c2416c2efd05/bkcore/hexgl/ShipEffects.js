/*
 * HexGL
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * @license This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *          To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/.
 */

const bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.ShipEffects = function({
  scene,
  shipControls,
  booster,
  boosterLight,
  boosterSprite,
  useParticles,
  textureSpark,
  textureCloud
}) {
  this.scene = scene;
  this.shipControls = shipControls;

  this.booster = booster;
  this.boosterLight = boosterLight;
  this.boosterSprite = boosterSprite;

  this.useParticles = useParticles;

  if (this.useParticles) {
    const pVel = new THREE.Vector3(0.5, 0, 0);
    const pOffset = new THREE.Vector3(-3, -0.3, 0);
    const pRad = new THREE.Vector3(0, 0, 1.5);

    this.shipVelocity = new THREE.Vector3();

    const pVelS = pVel.length();
    const pOffsetS = pOffset.length();
    const pRadS = pRad.length();

    pVel.normalize();
    pOffset.normalize();
    pRad.normalize();

    const particles = {
      leftSparks: new bkcore.threejs.Particles({
        randomness: new THREE.Vector3(0.4, 0.4, 0.4),
        tint: 0xffffff,
        color: 0xffc000,
        color2: 0xffffff,
        texture: textureSpark,
        size: 2,
        life: 60,
        max: 200
      }),

      leftClouds: new bkcore.threejs.Particles({
        opacity: 0.8,
        tint: 0xffffff,
        color: 0x666666,
        color2: 0xa4f1ff,
        texture: textureCloud,
        size: 6,
        blending: THREE.NormalBlending,
        life: 60,
        max: 200,
        spawn: new THREE.Vector3(3, -0.3, 0),
        spawnRadius: new THREE.Vector3(1, 1, 2),
        velocity: new THREE.Vector3(0, 0, -0.4),
        randomness: new THREE.Vector3(0.05, 0.05, 0.1)
      }),

      rightSparks: new bkcore.threejs.Particles({
        randomness: new THREE.Vector3(0.4, 0.4, 0.4),
        tint: 0xffffff,
        color: 0xffc000,
        color2: 0xffffff,
        texture: textureSpark,
        size: 2,
        life: 60,
        max: 200
      }),

      rightClouds: new bkcore.threejs.Particles({
        opacity: 0.8,
        tint: 0xffffff,
        color: 0x666666,
        color2: 0xa4f1ff,
        texture: textureCloud,
        size: 6,
        blending: THREE.NormalBlending,
        life: 60,
        max: 200,
        spawn: new THREE.Vector3(-3, -0.3, 0),
        spawnRadius: new THREE.Vector3(1, 1, 2),
        velocity: new THREE.Vector3(0, 0, -0.4),
        randomness: new THREE.Vector3(0.05, 0.05, 0.1)
      })
    };

    this.shipControls.mesh.add(particles.leftClouds.system);
    this.shipControls.mesh.add(particles.rightClouds.system);
    this.scene.add(particles.leftSparks.system);
    this.scene.add(particles.rightSparks.system);
  }
};

bkcore.hexgl.ShipEffects.prototype.update = function(dt) {
  let boostRatio, opacity, scale, intensity, random;

  if (this.shipControls.destroyed) {
    opacity = 0;
    scale = 0;
    intensity = 0;
    random = 0;
  } else {
    boostRatio = this.shipControls.getBoostRatio();
    opacity = this.shipControls.key.forward ? 0.8 : 0.3 + boostRatio * 0.4;
    scale = (this.shipControls.key.forward ? 1.0 : 0.8) + boostRatio * 0.5;
    intensity = this.shipControls.key.forward ? 4.0 : 2.0;
    random = Math.random() * 0.2;
  }

  if (this.booster) {
    this.booster.rotation.z += 1;
    this.booster.scale.set(scale, scale, scale);
    this.booster.material.opacity = Math.clamp(random + opacity, 0, 1);
    this.boosterSprite.opacity = Math.clamp(random + opacity, 0, 1);
    this.boosterLight.intensity = Math.clamp(intensity * (random + 0.8), 0, 1);
  }

  // PARTICLES
  if (this.useParticles) {
    this.shipVelocity.copy(this.shipControls.currentVelocity).multiplyScalar(0.7);

    const rightSparks = this.particles.rightSparks;
    const leftSparks = this.particles.leftSparks;

    rightSparks.velocity.copy(pVel);
    rightSparks.spawnRadius.copy(pRad);
    rightSparks.spawn.copy(pOffset);

    leftSparks.velocity.copy(pVel).x *= -1;
    leftSparks.spawn.copy(pOffset).x *= -1;

    if (this.shipControls.mesh) {
      // RIGHT
      const meshMatrix = this.shipControls.mesh.matrix;
      meshMatrix.rotateAxis(rightSparks.spawn);
      rightSparks.spawn
        .multiplyScalar(pOffsetS)
        .addSelf(this.shipControls.dummy.position);

      meshMatrix.rotateAxis(rightSparks.velocity);
      rightSparks.velocity
        .multiplyScalar(pVelS)
        .addSelf(this.shipVelocity);

      meshMatrix.rotateAxis(rightSparks.spawnRadius);
      rightSparks.spawnRadius
        .multiplyScalar(pRadS);

      // LEFT
      meshMatrix.rotateAxis(leftSparks.spawn);
      leftSparks.spawn
        .multiplyScalar(pOffsetS)
        .addSelf(this.shipControls.dummy.position);

      meshMatrix.rotateAxis(leftSparks.velocity);
      leftSparks.velocity
        .multiplyScalar(pVelS)
        .addSelf(this.shipVelocity);

      leftSparks.spawnRadius.copy(rightSparks.spawnRadius);
    }

    if (this.shipControls.collision.right) {
      rightSparks.emit(10);
      this.particles.rightClouds.emit(5);
    }

    if (this.shipControls.collision.left) {
      leftSparks.emit(10);
      this.particles.leftClouds.emit(5);
    }

    rightSparks.update(dt);
    this.particles.rightClouds.update(dt);
    leftSparks.update(dt);
    this.particles.leftClouds.update(dt);
  }
};
