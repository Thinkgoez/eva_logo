import * as THREE from 'three'
import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraShake, OrbitControls, SpotLight } from '@react-three/drei'
import { useSphere, useCylinder, useDistanceConstraint, usePointToPointConstraint, Physics } from '@react-three/cannon'
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import Model from './static/Logo'

const App = () => {
  return (
    <div className='wrapper'>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15] }}>
        <color attach="background" args={['black']} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <Suspense fallback={null}>
          <Physics>
            <Model rotation={[1,0,0]} scale={[4,4,4]} />
            <Lamp position={[0, 10, 0]} />
            <EffectComposer multisampling={8}>
              <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
              <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
            </EffectComposer>
          </Physics>
        </Suspense>
        <CameraShake yawFrequency={0.2} pitchFrequency={0.2} rollFrequency={0.2} />
      </Canvas>
    </div>
  )
}

export function Lamp(props) {
  const [target] = useState(() => new THREE.Object3D())
  const [fixed] = useSphere(() => ({ collisionFilterGroup: 0, type: 'Static', args: [0.2], ...props }))
  const [lamp] = useCylinder(() => ({ mass: 1, args: [0.5, 1.5, 2, 16], angularDamping: 0.95, linearDamping: 0.95, material: { friction: 0.9 }, ...props }))
  useDistanceConstraint(fixed, lamp, { distance: 2, pivotA: [0, 0, 0], pivotB: [0, 2, 0] })
  usePointToPointConstraint(fixed, lamp, { pivotA: [0, 0, 0], pivotB: [0, 2, 0] })
  return (
    <mesh ref={lamp}>
      <cylinderGeometry args={[0.5, 1.5, 2, 32]} />
      <meshStandardMaterial />
      <SpotLight
        castShadow
        target={target}
        penumbra={0.2}
        radiusTop={0.4}
        radiusBottom={40}
        distance={80}
        angle={0.45}
        attenuation={20}
        anglePower={5}
        intensity={1}
        opacity={0.2}
      />
      <primitive object={target} position={[0, -1, 0]} />
    </mesh>
  )
}


export default App