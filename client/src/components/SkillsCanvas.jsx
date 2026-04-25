import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'

const techStack = [
  'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript',
  'Tailwind', 'Three.js', 'Docker', 'Git', 'PostgreSQL',
  'Redux', 'JWT', 'GraphQL', 'Next.js', 'Vite', 'Linux', 'REST', 'Figma',
]

function TechGlobe({ isDark }) {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  const items = useMemo(() => {
    const r = 2.7
    return techStack.map((name, i) => {
      const phi   = Math.acos(-1 + (2 * i) / techStack.length)
      const theta = Math.sqrt(techStack.length * Math.PI) * phi
      return {
        name,
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y  = t * 0.16
      groupRef.current.rotation.x  = Math.sin(t * 0.11) * 0.14
    }
  })

  const accent = isDark ? '#2997ff' : '#0071e3'
  const dim    = isDark ? '#a1a1a6' : '#6e6e73'

  return (
    <group ref={groupRef}>
      {/* Ghost sphere */}
      <mesh>
        <sphereGeometry args={[2.7, 20, 20]} />
        <meshStandardMaterial wireframe transparent opacity={isDark ? 0.05 : 0.04} color={accent} />
      </mesh>

      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.7, 0.007, 4, 90]} />
        <meshBasicMaterial color={accent} transparent opacity={isDark ? 0.25 : 0.18} />
      </mesh>

      {/* Tech labels */}
      <Suspense fallback={null}>
        {items.map(({ name, position }) => (
          <Billboard key={name} position={position}>
            <Text
              fontSize={0.21}
              color={name === 'React' || name === 'Node.js' ? accent : dim}
              anchorX="center"
              anchorY="middle"
              renderOrder={1}
            >
              {name}
            </Text>
          </Billboard>
        ))}
      </Suspense>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={isDark ? 2 : 0.8} />
      </mesh>
      <pointLight color={accent} intensity={isDark ? 2 : 1} distance={5} />
    </group>
  )
}

export default function SkillsCanvas({ isDark }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      <TechGlobe isDark={isDark} />
    </Canvas>
  )
}
