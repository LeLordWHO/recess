import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000000, 0);
document.body.appendChild(renderer.domElement);

let wireframe, solid;
let currentFaceIndex = null;
renderer.domElement.addEventListener('mousemove', onMouseMove);

fetch('hopscotch.json')
  .then(response => response.json())
  .then(data => {
    const vertices = data.vertices.flat();
    const indices = data.faces.flat();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const materials = [];
    for (let i = 0; i < indices.length / 3; i += 2) {
      materials.push(new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff , opacity: 0.3, transparent: true}));
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

    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10, opacity: 1, transparent: true });
    const edges = new THREE.EdgesGeometry(geometry, 0);
    wireframe = new THREE.Line(edges, wireframeMaterial);
    
    const edgePositions = edges.attributes.position.array;
    const newPositions = [];
    for (let i = 0; i < edgePositions.length; i += 6) {
      const p1 = new THREE.Vector3().fromArray(edgePositions, i);
      const p2 = new THREE.Vector3().fromArray(edgePositions, i + 3);
      if (p1.distanceTo(p2) <= 2) {
        newPositions.push(...edgePositions.slice(i, i + 6));
      }
    }
    edges.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
    
    scene.add(wireframe);
  })
  .catch(error => console.error(error));
  
camera.position.z = 20;

function animate() {
  requestAnimationFrame(animate);

  if (wireframe && solid) {
    //wireframe.rotation.y += 0.01
    //solid.rotation.y += 0.01
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

function onMouseMove(event) {
  const mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObject(solid);
  
  if (intersects.length > 0) {
    const faceIndex = Math.floor(intersects[0].faceIndex / 2);
    console.log('faceIndex:', faceIndex);
    if (faceIndex !== currentFaceIndex) {
      if (currentFaceIndex !== null) {
        solid.material[currentFaceIndex].opacity = 0.3;
      }
      solid.material[faceIndex].opacity = 1;
      currentFaceIndex = faceIndex;
    }
  } else {
    if (currentFaceIndex !== null) {
      solid.material[currentFaceIndex].opacity = 0.3;
      currentFaceIndex = null;
    }
  }
}