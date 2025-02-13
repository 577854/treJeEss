import '../style.css'

import * as THREE from 'three';
import { Wireframe } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 30;

//Lights 
const pointLight = new THREE.PointLight( 0xffffff, 5000 );
pointLight.position.set( 20,20,20 );
const ambientLight = new THREE.AmbientLight( 0x8888ff, 1 );

//Box
const BoxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
const boxMat = new THREE.MeshStandardMaterial( { color: 0xE41E2E } );
const box = new THREE.Mesh( BoxGeometry, boxMat );

//sphere
const coneGeometry = new THREE.ConeGeometry( 5, 10  );
const coneMat = new THREE.MeshStandardMaterial( { color: 0x0AEE01 } );
const cone = new THREE.Mesh( coneGeometry, coneMat );
cone.position.x = 20;

//Donut
const donutGeometry = new THREE.TorusGeometry( 4, 1.5, 16, 100 );
const donutMat = new THREE.MeshStandardMaterial( { color: 0x3214ee } );
const donut = new THREE.Mesh( donutGeometry, donutMat );
donut.position.x = -20;


//sphere
const sphereGeometry = new THREE.SphereGeometry( 8, 32, 16 );
const sphereMat = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } ); 
const sphere = new THREE.Mesh( sphereGeometry, sphereMat );
sphere.position.y = -52;

//cube
const cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
const cubeMat = new THREE.ShaderMaterial({
    uniforms: {
        glowColor: { value: new THREE.Color(0x00ffff) },
    },
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        void main() {
            gl_FragColor = vec4(glowColor, 1.0);
        }
    `,
    wireframe: true,
    transparent: true
});
const cube = new THREE.Mesh( cubeGeometry, cubeMat );
cube.position.y = -82;

//translatingBox
const transBoxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
const transBoxMat = new THREE.MeshStandardMaterial( { color: 0xE41E2E } );
const transBox = new THREE.Mesh( transBoxGeometry, transBoxMat );

//sphere
const scaleSpereGeometry = new THREE.SphereGeometry( 5, 32, 16  );
const scaleSphereMat = new THREE.MeshStandardMaterial( { color: 0x0AEE01 } );
const scaleSphere = new THREE.Mesh( scaleSpereGeometry, scaleSphereMat );
scaleSphere.position.x = 20;

//Donut
const rotDonutGeometry = new THREE.TorusGeometry( 4, 1.5, 16, 100 );
const rotDonutMat = new THREE.MeshStandardMaterial( { color: 0x3214ee } );
const rotDonut = new THREE.Mesh( rotDonutGeometry, rotDonutMat );
rotDonut.position.x = -20;

scaleSphere.position.y = -100;
rotDonut.position.y = -100;

//textureBox
const texture = new THREE.TextureLoader().load('../guddi.webp');

const texBoxGeometry = new THREE.SphereGeometry( 7, 7, 7 );
const texBoxMat = new THREE.MeshBasicMaterial( { map: texture} );
const texBox = new THREE.Mesh( texBoxGeometry, texBoxMat );
texBox.position.y = -130;

//ADD TO SCENE
scene.add(camera, pointLight, ambientLight, box, cone, donut, sphere, cube, transBox, scaleSphere, rotDonut, texBox);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    pointLight.position.y = t * 0.03;
    camera.position.y = t *  0.03;
  }
  
  document.body.onscroll = moveCamera;
  moveCamera();

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

// Starfield
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 10000;
const positions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Nebula-like effect (fog)
scene.fog = new THREE.FogExp2(0x000011, 0.002);

let projector = null;

const loader = new GLTFLoader();
loader.load(
    "../low_poly_projector.glb",
    function (gltf) {
        projector = gltf.scene;
        projector.position.set(-15, -155, 0);  // Adjust position if needed
        projector.scale.set(100, 100, 100);     // Adjust scale if needed
        scene.add(projector);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function (error) {
        console.error("Error loading GLTF model:", error);
    }
);

const screenGeometry = new THREE.PlaneGeometry(15, 15);
const screenMat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide} )
const screen = new THREE.Mesh(screenGeometry, screenMat);
screen.position.y = -155;
screen.position.x = 15;
screen.rotation.y = 15;

scene.add(screen);

let moveRenrerer = false;
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        moveRenrerer = !moveRenrerer;
    }
});

loader.load(
    "../island.glb",
    function(gltf){
        const model = gltf.scene;
        model.position.set(-10, -205, 0);
        model.scale.set(0.015, 0.015, 0.015);
        model.rotation.y = 100;
        scene.add(model);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function (error) {
        console.error("Error loading GLTF model:", error);
    }
);

//Camera info
const planeTexture = new THREE.TextureLoader().load('../Perpective_Camera.png');
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMat = new THREE.MeshBasicMaterial({map: planeTexture, side: THREE.DoubleSide} )
const plane = new THREE.Mesh(planeGeometry, planeMat);
plane.position.y = -230;
plane.position.x = -10;

scene.add(plane);

//const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame( animate );

    const time = clock.getElapsedTime();
    
    box.rotation.x += 0.01;
    box.rotation.z += 0.01;
    cone.rotation.x += 0.01;
    cone.rotation.y += 0.01;
    donut.rotation.x += 0.01;
    donut.rotation.y += 0.01;
    donut.rotation.z += 0.01;
    sphere.rotation.x += 0.005;
    sphere.rotation.y += 0.005;
    sphere.rotation.z += 0.005;
    cube.rotation.z += 0.003;
    cube.rotation.x += 0.003;

    transBox.position.y = (Math.sin(time * 2) * 2) - 100;
    rotDonut.rotation.y += 0.01;
    const scaleValue = (Math.sin(time * 3) + 1) / 2 * (1.5 - 0.5) + 0.5; 
    scaleSphere.scale.set(1, scaleValue, 1)

    texBox.rotation.x += 0.01;
    texBox.rotation.y += 0.01;
    texBox.rotation.z += 0.01;

    //controls.update();
    //rotateCamera();

    if(moveRenrerer){
        screen.position.y -= 0.5;
        projector.position.y -= 0.5;
    }

    renderer.render(scene, camera);
}

animate();