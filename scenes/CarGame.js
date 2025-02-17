import '../style.css'

import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let clock = new THREE.Clock();

camera.position.x = 10;
camera.position.y = 9;

//Lights 
const pointLight = new THREE.PointLight( 0xffffff, 100 );
pointLight.position.set( 20,20,20 );
const ambientLight = new THREE.AmbientLight( 0xffffff ); // white ambient light
const lighthelper = new THREE.PointLightHelper( pointLight ); //shows where light is
const axesHelper = new THREE.AxesHelper(8);

scene.add(ambientLight, lighthelper, axesHelper);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//------------CANNON----------------------
const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
});

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    //infinite geometry plane
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

//create sphere and box
const radius = 2;
const sphereBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0,7,0);
physicsWorld.addBody(sphereBody);
//
//const boxBody = new CANNON.Body({
//    mass: 5,
//    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
//});
//boxBody.position.set(1, 10, 0);
//physicsWorld.addBody(boxBody);

//create car
const carBody = new CANNON.Body({
    mass: 10,
    position: new CANNON.Vec3(0,6,0),
    shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
});
const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody,
});

const ex = 0;
const yy = 0;
const zet = 1;

const mass = 1;
const axisWidth = 5;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);

//Wheel1
const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial});
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4;

vehicle.addWheel({
    body: wheelBody1,
    position: new CANNON.Vec3(-2,0, axisWidth / 2),
    axis: new CANNON.Vec3(ex, yy, zet),
    direction: down,
});

//Wheel2
const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial});
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;

vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(-2,0, -axisWidth / 2),
    axis: new CANNON.Vec3(ex, yy, zet),
    direction: down,
});

//Wheel3
const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial});
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;

vehicle.addWheel({
    body: wheelBody3,
    position: new CANNON.Vec3(2,0, axisWidth / 2),
    axis: new CANNON.Vec3(ex, yy, zet),
    direction: down,
});

//Wheel4
const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial});
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;

vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(2,0, -axisWidth / 2),
    axis: new CANNON.Vec3(ex, yy, zet),
    direction: down,
});

vehicle.addToWorld(physicsWorld);

//Debugger
const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
    //color: 0xff0000,
});


//Car controls
document.addEventListener('keydown', (event) => {
    const maxSteerVal = Math.PI / 8;
    const maxForce = 100;

    switch (event.key){
      case 'w':
      case 'ArrowUp':
        vehicle.setWheelForce(maxForce, 0);
        vehicle.setWheelForce(maxForce, 1);
        break;

      case 's':
      case 'ArrowDown':
        vehicle.setWheelForce(-maxForce / 2, 0);
        vehicle.setWheelForce(-maxForce / 2, 1);
        break;

      case 'a':
      case 'ArrowLeft':
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
        break;

      case 'd':
      case 'ArrowRight':
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
        break;

    }
});

// reset car force to zero when key is released
document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        vehicle.setWheelForce(0, 0);
        vehicle.setWheelForce(0, 1);
        break;

      case 's':
      case 'ArrowDown':
        vehicle.setWheelForce(0, 0);
        vehicle.setWheelForce(0, 1);
        break;

      case 'a':
      case 'ArrowLeft':
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
        break;

      case 'd':
      case 'ArrowRight':
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
        break;
    }
});

//------------CANNON----------------------

//Box
const BoxGeometry = new THREE.BoxGeometry( 8, 1, 4 );
const boxMat = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh( BoxGeometry, boxMat );

//BALL
const geometry = new THREE.SphereGeometry(radius);
const material = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(geometry, material);

//Ground
const threePlane = new THREE.PlaneGeometry( 1000, 1000 );
const planeMat = new THREE.MeshStandardMaterial( {color: 0xffffff} );
const planeMesh = new THREE.Mesh( threePlane, planeMat );
planeMesh.rotateX(-(Math.PI / 2));

scene.add(sphereMesh, boxMesh, planeMesh);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

//function that lets camera follow boxMesh position and rotation
const cameraOffset = new THREE.Vector3(10.0,2.0,0.0);
function followBoxMesh() {
  //add some offet to the camera and rotate the camera to follow the front of the box
  //camera.position.copy(boxMesh.position).add(cameraOffset);
  //camera.rotation.copy(boxMesh.rotation);
  let rotate = 0;

  document.addEventListener('keydown', (event) => {
    switch (event.key){
      case 'a':
      case 'ArrowLeft':
        rotate += Math.PI / 2;
        break;

      case 'd':
      case 'ArrowRight':
        rotate -= Math.PI / 2;
    }
  });

  var rotZ = Math.cos(rotate)
  var rotX = Math.sin(rotate)
  camera.position.x = boxMesh.position.x - rotate;
  camera.position.y = boxMesh.position.y + 10;
  camera.position.z = boxMesh.position.z - rotate;

  camera.lookAt(boxMesh.position);
}

let rotation = 0;
function moveCamera() {
  var delta = clock.getDelta();
  var sensitivity = 0.005;
  var rotateAngle = Math.PI / 2 * delta * sensitivity;
  document.addEventListener('keydown', (event) => {
    switch (event.key){
      case 'a':
      case 'ArrowLeft':
        rotation += rotateAngle;
        break;

      case 'd':
      case 'ArrowRight':
        rotation -= rotateAngle;
        break;
    }
  });
  var rotZ = Math.cos(rotation)
  var rotX = Math.sin(rotation)
  var distance = 20;
  camera.position.x = boxMesh.position.x - (distance * rotX);
  camera.position.y = boxMesh.position.y + 10;
  camera.position.z = boxMesh.position.z - (distance * rotZ);
  camera.lookAt(boxMesh.position);
  camera.attach(boxMesh);
}

function addThing() {
  const geometry = new THREE.SphereGeometry(0.25, 10, 10);
  const material = new THREE.MeshBasicMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
//let arr = Array(200).fill().forEach(addThing);

//Animate!!
function animate(){
  physicsWorld.fixedStep();
  cannonDebugger.update();

  boxMesh.position.copy(carBody.position);
  boxMesh.quaternion.copy(carBody.quaternion);
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);
  
  camera.lookAt(boxMesh.position);
  boxMesh.attach(camera);

  requestAnimationFrame( animate );
  renderer.render(scene, camera);
}
animate();