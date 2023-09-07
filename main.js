import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { createWireframeGeometry, onMouseMove, onFaceClick, addBezierCurve, faceColours, shuffle, words } from './hopscotch_functions.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const orbit_bool = false

let controls;
if (orbit_bool) {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000000, 0);
document.body.appendChild(renderer.domElement);

let wireframe, solid;
const wire_opacity =0.8;
const wire_width = 3;
const wire_color = 0xffffff;
const min_opacity = 0.15;
const max_opacity = 0.8;
renderer.domElement.addEventListener('mousemove', event => onMouseMove(event, camera, solid, min_opacity, max_opacity));
renderer.domElement.addEventListener('click', event => onFaceClick(event, camera, solid));

fetch('hopscotch.json')
  .then(response => response.json())
  .then(data => {
    const vertices = data.vertices.flat();
    const indices = data.faces.flat();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Create all the materials with shuffled colours
    const materials = [];
    let indicesArr = Array.from({length:  10}, (_, i) => i * 2);
    let shuffledIndices = shuffle(indicesArr);
    console.log(shuffledIndices)
    for (let j = 0; j < Math.min(words.length,10); j++) {
      let i = shuffledIndices[j];
      materials.push(new THREE.MeshBasicMaterial({ color: faceColours(i/2) , opacity: min_opacity, transparent: true}));
    }
    const solidGeometry = geometry.clone();
    solidGeometry.clearGroups();
    for (let i = 0; i < materials.length; i++) {
      solidGeometry.addGroup(i * 6, 6, i);
    }
    solidGeometry.groupsNeedUpdate = true;
    solidGeometry.computeVertexNormals();
    solid = new THREE.Mesh(solidGeometry, materials);
    scene.add(solid);

    // Create the wireframe 
    const wireframeGeometry = createWireframeGeometry(data.vertices, data.edges);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: wire_color , linewidth:wire_width, opacity: wire_opacity, transparent: true });
    wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Decorative curves 
    const curves = data.curves;
    const curvePoints = curves.map(curve => curve.map(i => new THREE.Vector3().fromArray(vertices, i * 3)));
    for (let i = 0; i < curvePoints.length; i++) {
      console.log("curvePoints: ", curvePoints[i])
      addBezierCurve(vertices, curvePoints[i], scene, wireframeMaterial);
    } 

  })
  .catch(error => console.error(error));
  
camera.position.z = 5;
camera.position.x = -1.2;
camera.position.y = 0.3; 
scene.rotation.x = -35 * Math.PI / 180;
scene.rotation.z = 45 * Math.PI / 180;
scene.position.set(-2.5, 3, 0);

let angle = 0;

function animate() {
  requestAnimationFrame(animate);

  if (wireframe && solid) {
    scene.rotation.x += 0.0001*Math.sin(angle)
    scene.rotation.y += 0.0002*Math.cos(angle)
    scene.rotation.z += 0.0002*Math.sin(angle)
    angle += 0.005
  }

  if (orbit_bool) {
    controls.update();
  }

  renderer.render(scene, camera); 
}

animate();