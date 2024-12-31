import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import aa from "three/examples/fonts/helvetiker_regular.typeface.json";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "/textures/matcaps/442C27_A79E90_847066_8D837C.jpg"
);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

scene.background = new THREE.Color("lightblue ");
/* fonts */
const fontLoader = new FontLoader();
let text;
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Mohammed Muhsin", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 50,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  /*  Center text positon */
  /* 1- hard way */
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );
  /* 2 */
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ side: THREE.DoubleSide });
  material.matcap = matcapTexture;
  //   const donutMaterial = new THREE.MeshPhysicalMaterial()
  //   donutMaterial.metalness = 0
  //   donutMaterial.roughness = 0
  //   donutMaterial.transmission  =1;
  //   donutMaterial.ior = 1.000293
  //   donutMaterial.thickness = 0.5
  text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  let donut;
  for (let i = 0; i < 300; i++) {
    donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

const obj = {
  selectedTexture: "442C27_A79E90_847066_8D837C.jpg",
  textures: [
    "442C27_A79E90_847066_8D837C.jpg",
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
  ],
};

const textureFolder = gui.addFolder("Texture");
textureFolder
  .add(obj, "selectedTexture", obj.textures)
  .name("Choose texture")
  .onChange((value) => {
    const textureToLoad = textureLoader.load(`/textures/matcaps/${value}`);
    textureToLoad.colorSpace = THREE.SRGBColorSpace;
    text.material.matcap = textureToLoad;
  });

/**
 * Object
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
