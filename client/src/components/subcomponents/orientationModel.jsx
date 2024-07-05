import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const OrientationModel = ({quaternionData}) => {
  const mountRef = useRef(null);
  const objModelRef = useRef(null);
  const quaternionRef = useRef(quaternionData);

  useEffect(() => {
    quaternionRef.current = quaternionData;
  }, [quaternionData]);


  var w = 256;
  var h = 500;

  useEffect(() => {

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer();

    // Set camera position
    camera.position.x = 0;
    camera.position.z = 300;
    camera.position.y = 0;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);

    mountRef.current.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0xEEEEEE); // Change to desired color

    { // Add light to the scene
    const amblight = new THREE.AmbientLight('gray');
    amblight.intensity = 0.1;
    scene.add(amblight);

    const spotLight = new THREE.SpotLight('white');
    spotLight.position.set(1000, 1000, 1000);
    spotLight.angle = 0.15;
    spotLight.penumbra = 1;
    spotLight.decay = 0;
    spotLight.intensity = 0.8;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight('white');
    pointLight.position.set(-1000, -1000, -1000);
    pointLight.decay = 0;
    pointLight.intensity = 1.57;
    scene.add(pointLight); 

    }

    { // Load the OBJ file
    const loader = new OBJLoader();
    loader.load('./rocket.obj',
      (object) => {
        objModelRef.current = object;
        scene.add(objModelRef.current);

        // This where you can change the object's location in the scene.
        objModelRef.current.position.y = 0;

      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
      }
    );
    }


    // Quaternion for rotation
    var quaternion = new THREE.Quaternion();
    
    // Render loop
    const animate = () => {
      quaternion.set(quaternionRef.current[0], 
                     quaternionRef.current[1],
                     quaternionRef.current[2],
                     quaternionRef.current[3]);

      requestAnimationFrame(animate);
      if (objModelRef.current && quaternionRef.current) {
        objModelRef.current.setRotationFromQuaternion(quaternion);
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div className="border-[#E77500] border" ref={mountRef}></div>;
};

export default OrientationModel;
