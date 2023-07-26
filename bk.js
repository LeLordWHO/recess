import * as THREE from 'three';

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000000, 0);
document.body.appendChild(renderer.domElement);

// Declare variables for the hopscotch's wireframe and solid mesh
let wireframe;
let solid;

// Load the hopscotch's geometry from a JSON file
fetch('hopscotch.json')
  .then(response => response.json())
  .then(data => {
    // Set the vertices and faces of the hopscotch's geometry
    const vertices = data.vertices.flat();
    const indices = data.faces.flat();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Create an array of materials for every other face
    const materials = [];
    for (let i = 0; i < indices.length / 3; i += 2) {
      materials.push(new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff , opacity: 1, transparent: true}));
    }

    // Assign each pair of subsequent faces to the same material index
    const solidGeometry = new THREE.BufferGeometry().copy(geometry);
    solidGeometry.clearGroups();
    for (let i = 0; i < materials.length; i++) {
      solidGeometry.addGroup(i * 6, 6, i);
    }
    solidGeometry.groupsNeedUpdate = true;
    solidGeometry.computeVertexNormals();
    solid = new THREE.Mesh(solidGeometry, materials);
    scene.add(solid);

    // Create the wireframe mesh and add it to the scene
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10, opacity: 1, transparent: true });
    const edges = new THREE.EdgesGeometry(geometry);
    wireframe = new THREE.LineSegments(edges, wireframeMaterial);

    scene.add(wireframe);
  })
  .catch(error => console.error(error));
  
camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);

  if (wireframe && solid) {
    // Apply rotation to wireframe and solid separately
    //wireframe.rotation.y += 0.01
    //solid.rotation.y += 0.01
  }

  renderer.render(scene, camera);
}

animate();
