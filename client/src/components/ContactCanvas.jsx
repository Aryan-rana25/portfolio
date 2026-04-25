import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Network({ isDark }) {
  const groupRef = useRef()
  const pulseRef = useRef()

  const { nodes, linePositions, nodePositions } = useMemo(() => {
    const count = 22
    const pts = Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 3,
    ])

    const linePos = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pts[i][0] - pts[j][0]
        const dy = pts[i][1] - pts[j][1]
        const dz = pts[i][2] - pts[j][2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 3.8) {
          linePos.push(...pts[i], ...pts[j])
        }
      }
    }

    const nodePosFlat = new Float32Array(pts.flat())
    return {
      nodes: pts,
      linePositions: new Float32Array(linePos),
      nodePositions: nodePosFlat,
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.09
      groupRef.current.rotation.x = Math.sin(t * 0.06) * 0.08
    }
    // Pulse rings scale up and fade
    if (pulseRef.current) {
      const s = 1 + ((t * 0.4) % 1) * 1.5
      pulseRef.current.scale.set(s, s, s)
      pulseRef.current.material.opacity = Math.max(0, 0.5 - ((t * 0.4) % 1) * 0.5)
    }
  })

  const color  = isDark ? '#2997ff' : '#0071e3'
  const dimCol = isDark ? '#1a3a5c' : '#cce0f8'

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={isDark ? 0.18 : 0.13} />
      </lineSegments>

      {/* Node dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.1} transparent opacity={isDark ? 0.85 : 0.65} sizeAttenuation />
      </points>

      {/* Highlighted hub nodes */}
      {nodes.slice(0, 5).map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDark ? 1.2 : 0.6} />
        </mesh>
      ))}

      {/* Expanding pulse ring at centre */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.015, 4, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Static centre glow */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isDark ? 2.5 : 1.2} />
      </mesh>
      <pointLight color={color} intensity={isDark ? 2 : 1} distance={6} />
    </group>
  )
}

export default function ContactCanvas({ isDark }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={isDark ? 0.2 : 0.5} />
        <Network isDark={isDark} />
      </Canvas>
    </div>
  )
}
