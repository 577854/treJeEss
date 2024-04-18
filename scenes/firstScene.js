import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Sky} from 'three/examples/jsm/objects/Sky'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 70;

const sky = new Sky();
sky.scale.setScalar( 45000 );
const sun = new THREE.Vector3();
sky.material.uniforms.mieCoefficient.value = 0.005;
sky.material.uniforms.mieDirectionalG.value = 0.7;

function daytime(elev, azim) {
    const phi = THREE.MathUtils.degToRad( 90 - elev );
    const theta = THREE.MathUtils.degToRad( azim );
    sun.setFromSphericalCoords( 1, phi, theta );
    sky.material.uniforms.sunPosition.value.copy( sun );
    scene.environment = sky;
}
let elevation = 0.02;
let azimuth = 180;

//Donut
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0x3214ee } );
const cube = new THREE.Mesh( geometry, material );

//Box
const BoxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
const boxMat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const box = new THREE.Mesh( BoxGeometry, boxMat );

//Lights 
const pointLight = new THREE.PointLight( 0xffffff, 100 );
pointLight.position.set( 20,20,20 );
const ambientLight = new THREE.AmbientLight( 0xffffff ); // white ambient light
const lighthelper = new THREE.PointLightHelper( pointLight ); //shows where light is

//add everything to scene
scene.add( cube, box, pointLight, ambientLight );
scene.add(sky);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 10, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

let isMouseDown = false;
// Listen for mouse down event
document.addEventListener('mousedown', () => {
    isMouseDown = true;
});
// Listen for mouse up event
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

function rotateCamera() {
    const center = new THREE.Vector3(0, 0, 0); // center of the scene
    const distance = camera.position.distanceTo(center); // distance from camera to center
    const direction = camera.position.clone().sub(center).normalize(); // direction from camera to center

    const newPosition = new THREE.Vector3()
        .copy(direction)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01)
        .multiplyScalar(distance)
        .add(center); // new camera position

    camera.position.copy(newPosition);
    camera.lookAt(center); // make camera look at center
}

function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    box.rotation.x += 0.01;
    box.rotation.z += 0.01;
    if(!isMouseDown){
        rotateCamera();
    }
    //elevation += 0.01;
    //azimuth += 0.01;
    daytime(elevation, azimuth);
	renderer.render( scene, camera );
}
animate();