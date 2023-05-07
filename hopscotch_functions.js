import * as THREE from 'three';

export function createWireframeGeometry(vertices, edges) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (const [i, j] of edges) {
      positions.push(...vertices[i], ...vertices[j]);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }

export let currentFaceIndex = null;

export function onMouseMove(event, camera, solid, min_opacity, max_opacity) {
  const mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  
  if (solid) { // add a check for solid
      const intersects = raycaster.intersectObject(solid);
      
      if (intersects.length > 0) {
          const faceIndex = Math.floor(intersects[0].faceIndex / 2);
          if (faceIndex !== currentFaceIndex) {
              if (currentFaceIndex !== null) {
                  solid.material[currentFaceIndex].opacity = min_opacity;
              }
              solid.material[faceIndex].opacity = max_opacity;
              currentFaceIndex = faceIndex;
          }
      } else {
          if (currentFaceIndex !== null) {
              solid.material[currentFaceIndex].opacity = min_opacity;
              currentFaceIndex = null;
          }
      }
  }
}

export function addBezierCurve(vertices, curvePoints, scene, material) {
  const curve = new THREE.Curve();

  curve.getPoint = function (t) {
    const p0 = curvePoints[0];
    const p1 = curvePoints[1];
    const p2 = curvePoints[2];
    const p3 = curvePoints[3];

    const ti = 1 - t;
    const ti2 = ti * ti;
    const t2 = t * t;

    const p = new THREE.Vector3();

    p.x = ti2 * ti * p0.x + 3 * ti2 * t * p1.x + 3 * ti * t2 * p2.x + t2 * t * p3.x;
    p.y = ti2 * ti * p0.y + 3 * ti2 * t * p1.y + 3 * ti * t2 * p2.y + t2 * t * p3.y;
    p.z = ti2 * ti * p0.z + 3 * ti2 * t * p1.z + 3 * ti * t2 * p2.z + t2 * t * p3.z;

    return p;
  };

  const path = new THREE.CurvePath();
  path.add(curve);
  
  const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
  const curveObject = new THREE.Line(geometry, material);

  scene.add(curveObject);
}