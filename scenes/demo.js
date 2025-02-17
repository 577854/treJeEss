import '../style.css'

import * as THREE from 'three';

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

//Box
const BoxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
const boxMat = new THREE.MeshStandardMaterial( { color: 0xE41E2E } );
const box = new THREE.Mesh( BoxGeometry, boxMat );

scene.add(camera, box, pointLight, ambientLight);

function animate(){
    requestAnimationFrame( animate );

    box.rotation.x += 0.01;
    renderer.render(scene, camera);

}

animate();