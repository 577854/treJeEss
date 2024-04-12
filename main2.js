import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 15;

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
//const radius = 1;
//const sphereBody = new CANNON.Body({
//    mass: 5,
//    shape: new CANNON.Sphere(radius),
//});
//sphereBody.position.set(0,7,0);
//physicsWorld.addBody(sphereBody);
//
//const boxBody = new CANNON.Body({
//    mass: 5,
//    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
//});
//boxBody.position.set(1, 10, 0);
//physicsWorld.addBody(boxBody);

//create car
const carBody = new CANNON.Body({
    mass: 5,
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
//const BoxGeometry = new THREE.BoxGeometry( 2, 2, 2 );
//const boxMat = new THREE.MeshNormalMaterial();
//const boxMesh = new THREE.Mesh( BoxGeometry, boxMat );
//
////BALL
//const geometry = new THREE.SphereGeometry(radius);
//const material = new THREE.MeshNormalMaterial();
//const sphereMesh = new THREE.Mesh(geometry, material);

//scene.add(sphereMesh, boxMesh);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

//Animate!!
function animate(){
    physicsWorld.fixedStep();
    cannonDebugger.update();
    //boxMesh.position.copy(boxBody.position);
    //boxMesh.quaternion.copy(boxBody.quaternion);
    //sphereMesh.position.copy(sphereBody.position);
    //sphereMesh.quaternion.copy(sphereBody.quaternion);
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
}

animate();