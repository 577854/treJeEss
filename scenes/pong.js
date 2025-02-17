import '../style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const _FS = `
uniform float time;

void main() {
    // Varying color based on time
    vec3 color = vec3(0.5 + 0.5 * sin(time), 0.5 + 0.5 * cos(time), 0.5 + 0.5 * sin(time + 1.0));
    
    // Output final color
    gl_FragColor = vec4(color, 1.0);
}
`;

const _VS = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

//init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;
//camera.position.x = -4;
//const axesHelper = new THREE.AxesHelper(8);
//scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//light
const pointLight1 = new THREE.PointLight( 0xffffff, 1000 );
const pointLight2 = new THREE.PointLight( 0xffffff, 1000 );
pointLight1.position.set( -10,20,20 );
pointLight2.position.set( 10,20,-20 );

//add objects with hitboxes
//Walls
const BoxGeometry3 = new THREE.BoxGeometry( 20, 1, 1 );

const uniform = {};
//uniform.time = {value: time};
const shaderMaterial = new THREE.ShaderMaterial( {
  uniforms: uniform,
  vertexShader: _VS,
  fragmentShader: _FS
});

const boxMat3 = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const wall1 = new THREE.Mesh( BoxGeometry3, shaderMaterial );
const wallHitbox1 = new THREE.Box3();
wall1.position.y = 10;
wall1.geometry.computeBoundingBox();

const boxgGeometry4 = new THREE.BoxGeometry( 20, 1, 1 );
const boxMat4 = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const wall2 = new THREE.Mesh( boxgGeometry4, boxMat4 );
const wallHitbox2 = new THREE.Box3(); 
wall2.position.y = -10;
wall2.geometry.computeBoundingBox();

//players
const BoxGeometry = new THREE.BoxGeometry( 1, 5, 1 );
const boxMat = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
const player1 = new THREE.Mesh( BoxGeometry, boxMat );

const hitbox1 = new THREE.Box3();
hitbox1.position = 10;
player1.position.x = 10;
player1.geometry.computeBoundingBox();

const BoxGeometry2 = new THREE.BoxGeometry( 1, 5, 1 );
const boxMat2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const player2 = new THREE.Mesh( BoxGeometry2, boxMat2 );

const hitbox2 = new THREE.Box3();
player2.position.x = -10;
player2.geometry.computeBoundingBox();

//ball
const ball = new THREE.SphereGeometry(0.25, 10, 10);
const ballMat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const ballMesh = new THREE.Mesh( ball, ballMat );

const ballHitbox = new THREE.Box3();
ballMesh.geometry.computeBoundingBox();

//debugger-----------------------------------------------------------
//const wireframeHitbox1 = new THREE.Box3Helper(hitbox1, 0xffff00);
//const wireframeHitbox2 = new THREE.Box3Helper(hitbox2, 0xffff00);
//const wireFrameBall = new THREE.Box3Helper(ballHitbox, 0xffff00);
//const wireframeWall1 = new THREE.Box3Helper(wallHitbox1, 0xffff00);
//const wireframeWall2 = new THREE.Box3Helper(wallHitbox2, 0xffff00);
//scene.add(wireframeHitbox1, wireframeHitbox2, wireFrameBall, wallHitbox1, wireframeWall1, wireframeWall2);
//----------------------------------------------------------------------

scene.add(player1, player2, ballMesh, pointLight1, pointLight2, wall1, wall2);

const controls = new OrbitControls(camera, renderer.domElement);

//Functionality
let movePlayer1 = false
let movePlayer1Up = false;
let movePlayer2 = false
let movePlayer2Up = false;
let moveBallRight = true;
let moveBallLeft = false;
let increaseSpeed = 1.1;

function movePlayer1Direction(){
    if (movePlayer1 && movePlayer1Up){
        player1.position.y += 0.1;
    } else if(movePlayer1 && !movePlayer1Up){
        player1.position.y -= 0.1;
    } 
}

function movePlayer2Direction(){
    if (movePlayer2 && movePlayer2Up){
        player2.position.y += 0.1;
    } else if(movePlayer2 && !movePlayer2Up){
        player2.position.y -= 0.1;
    }
}

let randNum = 0;
let previousRandNum = 0;

//collision starts at start of game...
function moveBall(){
    increaseSpeed += 0.001;

    if(wallHitbox2.intersectsBox(ballHitbox) || wallHitbox1.intersectsBox(ballHitbox)){
        if(randNum < 0){
            randNum = Math.abs(randNum);
        }
        else{
            randNum = -randNum;
        }
    }

    if(hitbox1.intersectsBox(ballHitbox)){
        console.log("collision detected!!");
        moveBallLeft = true;
        moveBallRight = false;
    }
    if (hitbox2.intersectsBox(ballHitbox)){
        console.log("collision detected again!!");
        moveBallLeft = false;
        moveBallRight = true;
    }
    
    randNum = doAngleCalc(previousRandNum);
    previousRandNum = randNum;
    
    if(moveBallRight){
        ballMesh.position.x += 0.1 * increaseSpeed;
        ballMesh.position.y += randNum;
    }
    else if(moveBallLeft){
        ballMesh.position.x -= 0.1 * increaseSpeed;
        ballMesh.position.y += randNum;
    }

    if(randNum > 0){
        randNum += 0.0001; 
    }
    else{
        randNum -= 0.0001;
    }
}

//todo coalculate angles when hitting player box...
function doAngleCalc(previousRandNum){
    let rand = previousRandNum;
    if(previousRandNum > 0){
        rand = -rand;
    }
    else{
        rand = Math.abs(rand);
    }
    console.log(rand);
    return rand
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer1 = true;
            movePlayer1Up = true;
            break;
        case 'ArrowDown':
            movePlayer1 = true;
            movePlayer1Up = false;
            break;
        case 'w':
            movePlayer2 = true;
            movePlayer2Up = true;
            break;
        case 's':
            movePlayer2 = true;
            movePlayer2Up = false;
            break;
    }
})

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer1 = false;
            movePlayer1Up = false;
            break;
        case 'ArrowDown':
            movePlayer1 = false;
            movePlayer1Up = false;
            break;
        case 'w':
            movePlayer2 = false;
            movePlayer2Up = false;
            break;
        case 's':
            movePlayer2 = false;
            movePlayer2Up = false;
            break;
    }
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

//Animate
function animate(){

    hitbox1.copy(player1.geometry.boundingBox).applyMatrix4(player1.matrixWorld);
    hitbox2.copy(player2.geometry.boundingBox).applyMatrix4(player2.matrixWorld);
    ballHitbox.copy(ballMesh.geometry.boundingBox).applyMatrix4(ballMesh.matrixWorld);

    wallHitbox1.copy(wall1.geometry.boundingBox).applyMatrix4(wall1.matrixWorld);
    wallHitbox2.copy(wall2.geometry.boundingBox).applyMatrix4(wall2.matrixWorld);

    //camera.lookAt(ballMesh.position);
    //ballMesh.attach(camera);

    movePlayer1Direction();
    movePlayer2Direction();
    moveBall();
    rotateCamera();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();