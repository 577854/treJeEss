import * as THREE from 'three';

//init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 10;
//camera.position.x = -4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//light
const pointLight = new THREE.PointLight( 0xffffff, 1000 );
pointLight.position.set( 0,20,20 );

//add objects with hitboxes
const BoxGeometry = new THREE.BoxGeometry( 1, 5, 1 );
const boxMat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const player1 = new THREE.Mesh( BoxGeometry, boxMat );

const hitbox1 = new THREE.Box3();
hitbox1.position = 10;
player1.position.x = 10;
player1.geometry.computeBoundingBox();

const BoxGeometry2 = new THREE.BoxGeometry( 1, 5, 1 );
const boxMat2 = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const player2 = new THREE.Mesh( BoxGeometry2, boxMat2 );

const hitbox2 = new THREE.Box3();
player2.position.x = -10;
player2.geometry.computeBoundingBox();

const ball = new THREE.SphereGeometry(0.25, 10, 10);
const ballMat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const ballMesh = new THREE.Mesh( ball, ballMat );

const ballHitbox = new THREE.Box3();
ballMesh.geometry.computeBoundingBox();

//debugger-----------------------------------------------------------
const wireframeHitbox1 = new THREE.Box3Helper(hitbox1, 0xffff00);
const wireframeHitbox2 = new THREE.Box3Helper(hitbox2, 0xffff00);
const wireFrameBall = new THREE.Box3Helper(ballHitbox, 0xffff00);
scene.add(wireframeHitbox1, wireframeHitbox2, wireFrameBall);
//----------------------------------------------------------------------

scene.add(player1, player2, ballMesh, pointLight);

//Functionality
let movePlayer1 = false
let movePlayer1Up = false;
let movePlayer2 = false
let movePlayer2Up = false;
let moveBallRight = true;
let moveBallLeft = false;

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

//collision starts at start of game...
function moveBall(){
    
    if(hitbox1.intersectsBox(ballHitbox)){
        console.log("collision detected!!");
        moveBallLeft = true;
        moveBallRight = false;
        randNum = doRandNum();
    }
    if (hitbox2.intersectsBox(ballHitbox)){
        console.log("collision detected again!!");
        moveBallRight = true;
        moveBallLeft = false;
        randNum = doRandNum();
    }
    
    if(moveBallRight){
        ballMesh.position.x += 0.1;
        ballMesh.position.y += randNum;
    }
    else if(moveBallLeft){
        ballMesh.position.x -= 0.1;
        ballMesh.position.y += randNum;
    }

    if(randNum > 0){
        randNum += 0.0001; 
    }
    else{
        randNum -= 0.0001;
    }
}

function doRandNum(){
    let rand = THREE.MathUtils.randFloatSpread(0.001); 
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
})

//Animate
function animate(){

    hitbox1.copy(player1.geometry.boundingBox).applyMatrix4(player1.matrixWorld);
    hitbox2.copy(player2.geometry.boundingBox).applyMatrix4(player2.matrixWorld);
    ballHitbox.copy(ballMesh.geometry.boundingBox).applyMatrix4(ballMesh.matrixWorld);

    camera.lookAt(ballMesh.position);
    ballMesh.attach(camera);

    movePlayer1Direction();
    movePlayer2Direction();
    moveBall();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();