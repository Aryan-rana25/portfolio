import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// GLSL-style noise baked into JS (runs on GPU via shaderMaterial)
const blobVertex = /* glsl */`
  uniform float uTime;
  varying vec3 vNormal;
  varying float vNoise;

  // Classic 3-axis sine noise
  float sineNoise(vec3 p) {
    return sin(p.x * 2.8 + uTime * 0.7)
         * cos(p.y * 3.1 + uTime * 0.55)
         * sin(p.z * 2.6 + uTime * 0.65);
  }

  void main() {
    vNormal = normal;
    float n = sineNoise(position) * 0.28;
    vNoise  = n;
    vec3 displaced = position + normal * n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

const blobFrag = /* glsl */`
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying float vNoise;

  void main() {
    float t = clamp((vNoise + 0.28) / 0.56, 0.0, 1.0);
    vec3 col = mix(uColor, uColor2, t);
    float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    gl_FragColor = vec4(col, uOpacity * (0.5 + rim * 0.5));
  }
`

function Blob({ isDark }) {
  const meshRef = useRef()
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uColor:   { value: new THREE.Color(isDark ? '#2997ff' : '#0071e3') },
    uColor2:  { value: new THREE.Color(isDark ? '#6e40c9' : '#34aadc') },
    uOpacity: { value: isDark ? 0.85 : 0.75 },
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18
      meshRef.current.rotation.z = Math.sin(t * 0.22) * 0.12
    }
  })

  return (
    <>
      {/* Solid blob */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <shaderMaterial
          vertexShader={blobVertex}
          fragmentShader={blobFrag}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer wireframe ring */}
      <mesh rotation={[0.5, 0, 0.3]}>
        <torusGeometry args={[2.4, 0.008, 4, 80]} />
        <meshBasicMaterial
          color={isDark ? '#2997ff' : '#0071e3'}
          transparent
          opacity={isDark ? 0.3 : 0.2}
        />
      </mesh>
      <mesh rotation={[-0.4, 0.8, 0.1]}>
        <torusGeometry args={[2.6, 0.006, 4, 80]} />
        <meshBasicMaterial
          color={isDark ? '#2997ff' : '#0071e3'}
          transparent
          opacity={isDark ? 0.18 : 0.12}
        />
      </mesh>

      <pointLight color={isDark ? '#2997ff' : '#0071e3'} intensity={isDark ? 3 : 1.5} distance={8} />
      <ambientLight intensity={isDark ? 0.2 : 0.5} />
    </>
  )
}

export default function AboutCanvas({ isDark }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <Blob isDark={isDark} />
    </Canvas>
  )
}
