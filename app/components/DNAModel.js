import { useEffect, useRef, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export default function DNAModel({ hover }) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, "/model/human_dna.glb");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (gltf && group.current) {
      // Clone the scene to avoid reusing the same instance
      gltf.scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;

      gltf.scene.position.sub(center);
      gltf.scene.scale.multiplyScalar(scale);
      gltf.scene.rotation.x = Math.PI * 0.15;
      gltf.scene.rotation.z = Math.PI * 0.1;
      //   group.current.rotation.z = Math.PI / 4;

      group.current.add(gltf.scene);
    }

    return () => {
      if (group.current) {
        group.current.clear();
      }
    };
  }, [gltf]);

  // Rotate the model continuously (reverse direction on hover)
  useFrame((_, delta) => {
    if (group.current) {
      const rotationSpeed = hover ? -0.4 : 0.4;
      group.current.rotation.y += delta * rotationSpeed;
      //   gltf.scene.rotation.z += delta * 0.5;
      //   group.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 10]} intensity={0.4} />
    </group>
  );
}
