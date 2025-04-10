import '../style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;

//light
const pointLight = new THREE.PointLight( 0xffffff, 5000 );
pointLight.position.set( 20,20,20 );
const ambientLight = new THREE.AmbientLight( 0x8888ff, 1 );

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

//Box
const BoxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
const boxMat = new THREE.MeshStandardMaterial( { color: 0xFFFFFF } );
const box = new THREE.Mesh( BoxGeometry, boxMat );
box.position.y = 5;

let plane = new THREE.PlaneGeometry(100, 100);
let planeMat = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
let planeObj = new THREE.Mesh(plane, planeMat);
planeObj.rotation.x = Math.PI / 2;
scene.add(planeObj);

scene.add(camera, box, pointLight, ambientLight);

let moveboxRight = false;
let moveboxLeft = false;
let moveboxUp = false;
let moveboxDown = false;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveboxUp = true;
            moveboxRight = false;
            moveboxLeft = false;
            moveboxDown = false;
            break;
        case 'ArrowDown':
            moveboxUp = false;
            moveboxRight = false;
            moveboxLeft = false;
            moveboxDown = true;
            break;
        case 'ArrowLeft':
            moveboxUp = false;
            moveboxRight = false;
            moveboxLeft = true;
            moveboxDown = false;
            break;
        case 'ArrowRight':
            moveboxUp = false;
            moveboxRight = true;
            moveboxLeft = false;
            moveboxDown = false;
            break;
        default:
            moveboxUp = false;
            moveboxRight = false;
            moveboxLeft = false;
            moveboxDown = false;
            break;
    }
});

// Add a keyup event listener to reset all movement booleans to false when no keys are pressed
document.addEventListener('keyup', () => {
    moveboxUp = false;
    moveboxRight = false;
    moveboxLeft = false;
    moveboxDown = false;
});

// Update the animate function to stop the box when no keys are pressed
function animate(){
    requestAnimationFrame( animate );

    renderer.render(scene, camera);

    if(moveboxRight){
        box.position.x += 0.1;
    }
    else if(moveboxLeft){
        box.position.x -= 0.1;
    }
    else if(moveboxUp){
        box.position.z += 0.1;
    }
    else if(moveboxDown){
        box.position.z -= 0.1;
    }
}

animate();