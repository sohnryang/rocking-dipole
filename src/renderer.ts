import * as THREE from "three";
import * as dat from "dat.gui";

import { DipoleConfig } from "./dipole-config";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();
const config = new DipoleConfig(0, 1.08);
gui.add(config, "theta", 0, 2 * Math.PI).onChange(() => {
  resetToInitial();
});
gui.add(config, "dipoleMoment", 0, 10);

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

let theta = config.theta;
function updatePosition(theta: number) {
  positiveCharge.position.set(5 * Math.cos(theta), 5 * Math.sin(theta), 0);
  negativeCharge.position.set(-5 * Math.cos(theta), -5 * Math.sin(theta), 0);
  bar.rotation.z = theta;
}

function resetToInitial() {
  theta = config.theta;
}

function animate() {
  updatePosition((theta += 0.01));
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
