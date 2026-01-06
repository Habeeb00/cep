import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue
scene.fog = new THREE.Fog(0x87ceeb, 0, 500);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 50, 100); // Start position - far away from campus

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Hemisphere light for better outdoor lighting
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.3);
scene.add(hemiLight);

// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);

const landingPage = document.getElementById("landing-page");
const startTourBtn = document.getElementById("start-tour-btn");
const controlsInfo = document.getElementById("controls-info");
const loadingDiv = document.getElementById("loading");

let tourStarted = false;
let cameraAnimating = false;

// Start tour button click
startTourBtn.addEventListener("click", () => {
  if (!campusModel) {
    alert("Please wait for the campus model to load!");
    return;
  }

  landingPage.classList.add("hidden");
  cameraAnimating = true;

  // Animate camera to ground level
  animateCameraToStart();
});

// Animate camera from far away to ground level
function animateCameraToStart() {
  const startPos = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  const endPos = { x: 0, y: 1.7, z: 15 }; // Ground level position
  const duration = 2000; // 2 seconds
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-in-out)
    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    camera.position.x = startPos.x + (endPos.x - startPos.x) * eased;
    camera.position.y = startPos.y + (endPos.y - startPos.y) * eased;
    camera.position.z = startPos.z + (endPos.z - startPos.z) * eased;

    // Make camera look towards campus
    camera.lookAt(0, 1, 0);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      cameraAnimating = false;
      tourStarted = true;
      controlsInfo.classList.remove("hidden");
      // Enable controls after animation
      document.body.click();
      setTimeout(() => controls.lock(), 100);
    }
  }

  animate();
}

controls.addEventListener("lock", () => {
  if (tourStarted) {
    controlsInfo.classList.add("hidden");
  }
});

controls.addEventListener("unlock", () => {
  if (tourStarted) {
    controlsInfo.classList.remove("hidden");
  }
});

scene.add(controls.getObject());

// Movement variables
const moveSpeed = 15.0;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

// Keyboard controls
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveState.forward = true;
      break;
    case "ArrowDown":
    case "KeyS":
      moveState.backward = true;
      break;
    case "ArrowLeft":
    case "KeyA":
      moveState.left = true;
      break;
    case "ArrowRight":
    case "KeyD":
      moveState.right = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveState.forward = false;
      break;
    case "ArrowDown":
    case "KeyS":
      moveState.backward = false;
      break;
    case "ArrowLeft":
    case "KeyA":
      moveState.left = false;
      break;
    case "ArrowRight":
    case "KeyD":
      moveState.right = false;
      break;
  }
});

// Load campus GLB model
const loader = new GLTFLoader();
let campusModel = null;

// IMPORTANT: Replace 'campus.glb' with your actual GLB file name
loader.load(
  "cep.glb", // <-- PUT YOUR GLB FILE HERE
  (gltf) => {
    campusModel = gltf.scene;

    // Enable shadows
    campusModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(campusModel);
    loadingDiv.classList.add("hidden");
    console.log("Campus model loaded successfully!");
  },
  (progress) => {
    const percent = ((progress.loaded / progress.total) * 100).toFixed(0);
    loadingDiv.textContent = `Loading campus model... ${percent}%`;
  },
  (error) => {
    console.error("Error loading campus model:", error);
    loadingDiv.textContent = "Error loading model. Check console.";
    loadingDiv.style.background = "rgba(244, 67, 54, 0.9)";
  }
);

// Optional: Add a simple ground plane as fallback
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x7cfc00,
  roughness: 0.8,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Add a simple stickman character (optional visual reference)
const stickmanGroup = new THREE.Group();

// Head
const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const stickmanMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const head = new THREE.Mesh(headGeometry, stickmanMaterial);
head.position.y = 1.6;
stickmanGroup.add(head);

// Body
const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
const body = new THREE.Mesh(bodyGeometry, stickmanMaterial);
body.position.y = 1.1;
stickmanGroup.add(body);

// Arms
const armGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
const leftArm = new THREE.Mesh(armGeometry, stickmanMaterial);
leftArm.position.set(-0.25, 1.2, 0);
leftArm.rotation.z = Math.PI / 4;
stickmanGroup.add(leftArm);

const rightArm = new THREE.Mesh(armGeometry, stickmanMaterial);
rightArm.position.set(0.25, 1.2, 0);
rightArm.rotation.z = -Math.PI / 4;
stickmanGroup.add(rightArm);

// Legs
const legGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8);
const leftLeg = new THREE.Mesh(legGeometry, stickmanMaterial);
leftLeg.position.set(-0.1, 0.45, 0);
stickmanGroup.add(leftLeg);

const rightLeg = new THREE.Mesh(legGeometry, stickmanMaterial);
rightLeg.position.set(0.1, 0.45, 0);
stickmanGroup.add(rightLeg);

// Position stickman slightly in front of camera
stickmanGroup.visible = false; // Hidden in first-person view
scene.add(stickmanGroup);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (controls.isLocked && !cameraAnimating) {
    direction.z = Number(moveState.forward) - Number(moveState.backward);
    direction.x = Number(moveState.right) - Number(moveState.left);
    direction.normalize();

    // Apply movement
    if (moveState.forward || moveState.backward) {
      velocity.z -= direction.z * moveSpeed * delta;
    }
    if (moveState.left || moveState.right) {
      velocity.x -= direction.x * moveSpeed * delta;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // Keep camera at eye level
    camera.position.y = 1.7;

    // Update stickman position (if visible)
    stickmanGroup.position.copy(camera.position);
    stickmanGroup.position.y = 0;
  }

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
