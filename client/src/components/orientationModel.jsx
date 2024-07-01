import {useRef, useState } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { createRoot } from '@react-three/fiber';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'

const ModelPrimitive = (props) => {
    const obj = useLoader(OBJLoader, "../beast.obj");
    
    const ref = useRef();

    useFrame(() => {
        ref.current.rotation.x = props.rot[0];
        ref.current.rotation.y = props.rot[1];
        ref.current.rotation.z = props.rot[2];
    });


  
    return (
        <primitive 
            ref={ref}
            object={obj} 
            scale={0.01} />
    );
  };


function OrientationModel(props) {

    return (
      <div className='w-auto h-[70%]'>
        <Canvas style={{ background: '#DCDCDC' }}>
            <ambientLight intensity={Math.PI / 10} color={'orange'} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI/2} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI/2} />
                
            <ModelPrimitive rot={props.rot}/>

        </Canvas>
      </div>
    );
}

export default OrientationModel;


