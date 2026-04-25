import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

const mouse = { x: 0, y: 0 }

// ── Shader wave grid ──────────────────────────────────────────────────────────
const waveVertex = /* glsl */`
  uniform float uTime;
  varying float vElevation;

  void main() {
    vec4 mPos = modelMatrix * vec4(position, 1.0);
    float e = sin(mPos.x * 1.6 + uTime * 0.5) * 0.22
            + sin(mPos.y * 2.1 + uTime * 0.4) * 0.15
            + sin((mPos.x + mPos.y) * 1.3 + uTime * 0.65) * 0.12;
    mPos.z += e;
    vElevation = e;
    gl_Position = projectionMatrix * viewMatrix * mPos;
  }
`
const waveFrag = /* glsl */`
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vElevation;

  void main() {
    float alpha = (vElevation + 0.45) * uOpacity;
    gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 0.55));
  }
`

function WaveGrid({ isDark }) {
  const ref = useRef()
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uColor:   { value: new THREE.Color(isDark ? '#2997ff' : '#0071e3') },
    uOpacity: { value: isDark ? 0.4 : 0.22 },
  }), [])

  useEffect(() => {
    ref.current.material.uniforms.uColor.value.set(isDark ? '#2997ff' : '#0071e3')
    ref.current.material.uniforms.uOpacity.value = isDark ? 0.4 : 0.22
  }, [isDark])

  useFrame(({ clock }) => {
    ref.current.material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.6, 0, 0.3]} position={[0, -2.2, -2]}>
      <planeGeometry args={[16, 12, 42, 42]} />
      <shaderMaterial
        vertexShader={waveVertex}
        fragmentShader={waveFrag}
        uniforms={uniforms}
        transparent
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ── Icosahedron ───────────────────────────────────────────────────────────────
function IcosahedronMesh({ isDark }) {
  const outer = useRef()
  const inner = useRef()
  const group = useRef()

  useEffect(() => {
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (outer.current) {
      outer.current.rotation.y = t * 0.12
      outer.current.rotation.x = Math.sin(t * 0.18) * 0.25
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.18
      inner.current.rotation.z = Math.cos(t * 0.14) * 0.15
    }
    if (group.current) {
      group.current.rotation.y += (mouse.x * 0.4 - group.current.rotation.y) * 0.04
      group.current.rotation.x += (-mouse.y * 0.2 - group.current.rotation.x) * 0.04
      group.current.position.y = Math.sin(t * 0.5) * 0.12
    }
  })

  const blue = isDark ? '#2997ff' : '#0071e3'
  const dim  = isDark ? '#1a3a5c' : '#b3d4f5'

  return (
    <group ref={group} position={[1.5, 0, 0]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshStandardMaterial color={blue} wireframe transparent opacity={isDark ? 0.55 : 0.4} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial color={dim} transparent opacity={isDark ? 0.07 : 0.12} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color={blue} intensity={isDark ? 2.5 : 1.2} distance={6} />
    </group>
  )
}

// ── Floating particles ────────────────────────────────────────────────────────
function Particles({ isDark }) {
  const ref = useRef()
  const positions = useMemo(
    () => new Float32Array(Array.from({ length: 120 * 3 }, () => (Math.random() - 0.5) * 14)),
    []
  )

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.025
      ref.current.rotation.x = clock.getElapsedTime() * 0.015
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={isDark ? '#2997ff' : '#0071e3'}
        size={0.045} transparent
        opacity={isDark ? 0.7 : 0.5}
        sizeAttenuation
      />
    </points>
  )
}

// ── Canvas export ─────────────────────────────────────────────────────────────
export default function HeroCanvas({ isDark }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={isDark ? 0.15 : 0.4} />
        <directionalLight position={[5, 5, 5]} intensity={isDark ? 0.3 : 0.5} />
        {isDark && <Stars radius={60} depth={40} count={800} factor={3} fade speed={0.6} />}
        <WaveGrid isDark={isDark} />
        <Particles isDark={isDark} />
        <IcosahedronMesh isDark={isDark} />
      </Canvas>
    </div>
  )
}
