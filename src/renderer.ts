import * as THREE from "three";
import * as dat from "dat.gui";

import { DipoleConfig } from "./dipole-config";
import { DipoleState, verlet } from "./solver";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -15,
  15,
  (15 * window.innerHeight) / window.innerWidth,
  (-15 * window.innerHeight) / window.innerWidth,
  1,
  10
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();
const config = new DipoleConfig(Math.PI / 4, 1.08, 10);
gui.add(config, "theta", 0, 2 * Math.PI).onFinishChange(resetToInitial);
gui.add(config, "dipoleMoment", 0, 10).onFinishChange(resetToInitial);
gui.add(config, "electricField", 0, 100);

const lights = [
  new THREE.PointLight(0xffffff, 1, 0),
  new THREE.PointLight(0xffffff, 1, 0),
  new THREE.AmbientLight(0x7f7f7f),
];
lights[0].position.setZ(5);
lights[0].castShadow = true;
lights[1].position.setZ(-5);
lights[1].castShadow = true;
for (const light of lights) scene.add(light);

const redMaterial = new THREE.MeshLambertMaterial({ color: 0xcf3b36 });
const geometry = new THREE.SphereGeometry(1, 32, 32);
const positiveCharge = new THREE.Mesh(geometry, redMaterial);
positiveCharge.position.setX(5);
scene.add(positiveCharge);

const blueMaterial = new THREE.MeshLambertMaterial({ color: 0x337ade });
const negativeCharge = new THREE.Mesh(geometry, blueMaterial);
negativeCharge.position.setX(-5);
scene.add(negativeCharge);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const barGeometry = new THREE.BoxGeometry(10, 0.1, 0.1);
const bar = new THREE.Mesh(barGeometry, material);
scene.add(bar);

camera.position.z = 10;

let state = new DipoleState(config.theta, 0, 0);
const clock = new THREE.Clock();
function updatePosition(state: DipoleState) {
  positiveCharge.position.set(
    5 * Math.cos(state.theta),
    5 * Math.sin(state.theta),
    0
  );
  negativeCharge.position.set(
    -5 * Math.cos(state.theta),
    -5 * Math.sin(state.theta),
    0
  );
  bar.rotation.z = state.theta;
}

function resetToInitial() {
  state.theta = config.theta;
  state.omega = 0;
  state.alpha = 0;
  updatePosition(state);
}

function animate() {
  state = verlet(state, clock.getDelta(), config);
  updatePosition(state);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
