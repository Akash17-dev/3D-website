import { useEffect, useRef } from "react";
import * as THREE from "three";

interface NeuroVerseCanvasProps {
  currentScroll: number; // scroll percentage from 0 to 1
  activeChapter: number;
}

export default function NeuroVerseCanvas({ currentScroll, activeChapter }: NeuroVerseCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep scroll and chapter ref up-to-date in the animate loop
  const scrollRef = useRef(0);
  const chapterRef = useRef(1);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    scrollRef.current = currentScroll;
  }, [currentScroll]);

  useEffect(() => {
    chapterRef.current = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // --- 1. Init WebGL Scene ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020208, 0.015);

    // --- 2. Camera ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    // Initial camera position
    camera.position.set(0, 0, 15);

    // --- 3. Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- 4. Lights ---
    const ambientLight = new THREE.AmbientLight(0x05081c, 1.5);
    scene.add(ambientLight);

    const directiveLight = new THREE.DirectionalLight(0x06b6d4, 3);
    directiveLight.position.set(5, 10, 7);
    scene.add(directiveLight);

    const purpleLight = new THREE.PointLight(0x6366f1, 5, 30);
    purpleLight.position.set(-8, 5, -5);
    scene.add(purpleLight);

    // --- 5. Cosmic Particle System (Nebula backdrop) ---
    const particleCount = 1200;
    const geometryParticles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Vast sphere positioning
      const radius = 60 + Math.random() * 80;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      // Deep space color values (mixing teal, purple, cyan, blue)
      const r = 0.1 + Math.random() * 0.2;
      const g = 0.5 + Math.random() * 0.5;
      const b = 0.8 + Math.random() * 0.2;
      colors[i] = r;
      colors[i + 1] = g;
      colors[i + 2] = b;
    }

    geometryParticles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometryParticles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Shader point mapping for gorgeous circular glowing particles
    const buildPointTexture = () => {
      const size = 16;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.3, "rgba(6, 182, 212, 0.8)");
        grad.addColorStop(0.7, "rgba(99, 102, 241, 0.2)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: buildPointTexture(),
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometryParticles, particleMaterial);
    scene.add(particles);

    // --- 6. CHAPTER 1: THE CENTRAL Glowing AI Core & ENERGY RINGS ---
    const aiCoreGroup = new THREE.Group();
    scene.add(aiCoreGroup);

    // Inner Core sphere (glowing grid mesh)
    const coreGeometry = new THREE.IcosahedronGeometry(2.4, 2);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
      emissive: 0x012b3a
    });
    const aiCoreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    aiCoreGroup.add(aiCoreSphere);

    // Core Solid Core sphere glowing white-cyan
    const solidCoreGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const solidCoreMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const solidCore = new THREE.Mesh(solidCoreGeom, solidCoreMat);
    aiCoreGroup.add(solidCore);

    // Spinning outer energy rings (Tori)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.08, 8, 48), ringMat1);
    ring1.rotation.x = Math.PI / 2;
    aiCoreGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.05, 6, 64), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    aiCoreGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.1, 4, 32), ringMat1);
    ring3.rotation.z = Math.PI / 3;
    aiCoreGroup.add(ring3);


    // --- 7. CHAPTER 2: THE LEARNING WORLD (Floating Island and Pathways) ---
    const learningGroup = new THREE.Group();
    // Offset learning group to the right in the 3D grid
    learningGroup.position.set(15, -4, -15);
    scene.add(learningGroup);

    // Central Floating Pyramid as the knowledge monument
    const monumentGeom = new THREE.ConeGeometry(2, 3.5, 4);
    const monumentMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald green theme
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const monument = new THREE.Mesh(monumentGeom, monumentMat);
    learningGroup.add(monument);

    // Orbiting books / floating data crystals
    const crystalGeom = new THREE.OctahedronGeometry(0.4, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.1,
      metalness: 0.8
    });
    const crystals: THREE.Mesh[] = [];
    const crystalCount = 6;
    for (let i = 0; i < crystalCount; i++) {
      const c = new THREE.Mesh(crystalGeom, crystalMat);
      const angle = (i / crystalCount) * Math.PI * 2;
      const radius = 3.5;
      c.position.set(Math.cos(angle) * radius, 0.8 + Math.sin(angle * 2) * 0.4, Math.sin(angle) * radius);
      learningGroup.add(c);
      crystals.push(c);
    }


    // --- 8. CHAPTER 3: THE CAREER WORLD (Futuristic City Wireframes) ---
    const careerGroup = new THREE.Group();
    careerGroup.position.set(-15, -12, -30);
    scene.add(careerGroup);

    // Procedural cyber skyscrapers
    const buildings: THREE.Mesh[] = [];
    const gridCols = 5;
    const gridRows = 5;
    const buildingMat = new THREE.MeshPhongMaterial({
      color: 0x6366f1, // Indigo city theme
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      shininess: 90
    });

    for (let c = 0; c < gridCols; c++) {
      for (let r = 0; r < gridRows; r++) {
        const heightVal = 1 + Math.random() * 7;
        const bGeom = new THREE.BoxGeometry(1.2, heightVal, 1.2);
        const building = new THREE.Mesh(bGeom, buildingMat);
        
        const px = (c - gridCols / 2) * 3.5 + (Math.random() - 0.5) * 0.5;
        const pz = (r - gridRows / 2) * 3.5 + (Math.random() - 0.5) * 0.5;
        const py = heightVal / 2 - 4; // Align bottom relative to city floor
        
        building.position.set(px, py, pz);
        careerGroup.add(building);
        buildings.push(building);
      }
    }


    // --- 9. CHAPTER 4: STARTUP WORLD (Digital Planet with Orbiting Ideas) ---
    const startupGroup = new THREE.Group();
    startupGroup.position.set(10, 10, -45);
    scene.add(startupGroup);

    // Glowing main planet
    const planetGeom = new THREE.SphereGeometry(3.5, 16, 16);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber innovation theme
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const mainPlanet = new THREE.Mesh(planetGeom, planetMat);
    startupGroup.add(mainPlanet);

    // Orbiting startup idea satellites
    const satelliteGeom = new THREE.IcosahedronGeometry(0.35, 0);
    const satelliteMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      wireframe: true
    });
    const satellites: THREE.Mesh[] = [];
    const satCount = 4;
    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satelliteGeom, satelliteMat);
      startupGroup.add(sat);
      satellites.push(sat);
    }


    // --- 10. CHAPTER 5: COMMAND GRID (Holographic Control room Floor) ---
    const commandGroup = new THREE.Group();
    commandGroup.position.set(0, -6, -65);
    scene.add(commandGroup);

    // Floating horizontal technical deck grid
    const gridHelper = new THREE.GridHelper(30, 20, 0x06b6d4, 0x023d50);
    gridHelper.position.y = -2;
    commandGroup.add(gridHelper);

    // Floating concentric command dashboard rings (holographic cockpit HUD)
    const hudRingGeom = new THREE.RingGeometry(4, 4.2, 32);
    const hudRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const hudRing = new THREE.Mesh(hudRingGeom, hudRingMat);
    hudRing.rotation.x = -Math.PI / 2;
    hudRing.position.y = 1;
    commandGroup.add(hudRing);


    // --- 11. Mouse tracking ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);


    // --- 12. Camera scroll tracking definitions ---
    // Define 3D coordinate checkpoints for each cinematic scroll chapter
    const chapterPositions = [
      { pos: new THREE.Vector3(0, 0, 10), look: new THREE.Vector3(0, 0, 0) }, // Chapter 1: Hero Base Core
      { pos: new THREE.Vector3(4, -1, 4), look: new THREE.Vector3(0, 0, 0) }, // Scrolling Core Awakening
      { pos: new THREE.Vector3(14, -2, -10), look: new THREE.Vector3(15, -4, -15) }, // Chapter 2: Learning World
      { pos: new THREE.Vector3(-10, -8, -18), look: new THREE.Vector3(-15, -12, -30) }, // Chapter 3: Career City
      { pos: new THREE.Vector3(5, 7, -35), look: new THREE.Vector3(10, 10, -45) }, // Chapter 4: Startup World
      { pos: new THREE.Vector3(0, -3, -56), look: new THREE.Vector3(0, -5, -66) } // Chapter 5: Command Center
    ];


    // --- 13. High FPS Animate loop ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse mapping (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // 1. Slow, ambient animations of standard entities
      // AI core continuous rotation and periodic pulse glows
      aiCoreGroup.rotation.y = elapsedTime * 0.15;
      aiCoreSphere.rotation.x = elapsedTime * 0.1;
      
      const pulseScale = 1.0 + Math.sin(elapsedTime * 3) * 0.06;
      aiCoreSphere.scale.set(pulseScale, pulseScale, pulseScale);
      
      ring1.rotation.y = elapsedTime * 0.3;
      ring2.rotation.x = -elapsedTime * 0.25;
      ring3.rotation.z = elapsedTime * 0.15;

      // Particles cosmic system slow drift
      particles.rotation.y = elapsedTime * 0.008;
      particles.rotation.z = -elapsedTime * 0.003;

      // Chapter 2: Learning Orbiting crystals spin
      learningGroup.rotation.y = elapsedTime * 0.1;
      crystals.forEach((c, idx) => {
        c.rotation.x += 0.02;
        c.rotation.y += 0.01;
        // Float heights
        c.position.y = 0.5 + Math.sin(elapsedTime * 2 + idx) * 0.3;
      });

      // Chapter 3: Career Skyscrapers sway/shimmer in place
      buildings.forEach((b, idx) => {
        const factor = Math.sin(elapsedTime * 0.5 + idx) * 0.2 + 1.0;
        b.scale.set(1, factor, 1);
      });

      // Chapter 4: Startup main satellite rotation
      startupGroup.rotation.y = -elapsedTime * 0.08;
      satellites.forEach((sat, i) => {
        const phi = (i / satCount) * Math.PI * 2;
        const radius = 5 + Math.sin(elapsedTime + i) * 0.5;
        
        sat.position.set(
          Math.cos(elapsedTime * 0.5 + phi) * radius,
          Math.sin(elapsedTime * 0.3 + i) * 1.5,
          Math.sin(elapsedTime * 0.5 + phi) * radius
        );
        sat.rotation.x += 0.01;
        sat.rotation.y += 0.02;
      });

      // Chapter 5: Command HUD controls blinking indicator
      hudRing.rotation.z = elapsedTime * 0.25;
      commandGroup.rotation.y = Math.sin(elapsedTime * 0.1) * 0.05;


      // 2. CAMERA TRANSLATIONS & ANGLE CONTROLS (Based on Scroll)
      const currentS = scrollRef.current; // 0.0 to 1.0
      const scrollSegments = chapterPositions.length - 1;
      const progressSegment = currentS * scrollSegments;
      const fromIdx = Math.floor(progressSegment);
      const toIdx = Math.min(fromIdx + 1, chapterPositions.length - 1);
      const segmentPercent = progressSegment - fromIdx;

      // Blend positions
      const fromPos = chapterPositions[fromIdx].pos;
      const toPos = chapterPositions[toIdx].pos;
      const finalCamPos = new THREE.Vector3().lerpVectors(fromPos, toPos, segmentPercent);

      // Blend target lookAt vector directions
      const fromLook = chapterPositions[fromIdx].look;
      const toLook = chapterPositions[toIdx].look;
      const finalLookAt = new THREE.Vector3().lerpVectors(fromLook, toLook, segmentPercent);

      // Inject minor responsive mobile backing helper
      const isMobile = width < 768;
      if (isMobile) {
        finalCamPos.z += 4.5; // Back out camera for compact viewports
      }

      // Incorporate parallax mouse displacement
      finalCamPos.x += mouseRef.current.x * 0.8;
      finalCamPos.y += mouseRef.current.y * 0.8;

      camera.position.copy(finalCamPos);
      camera.lookAt(finalLookAt);

      renderer.render(scene, camera);
    };

    animate();


    // --- 14. Responsive Resize Observer with Debounce ---
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Use ResizeObserver for accurate sizing on parent dimension swaps
    const resizeObserver = new ResizeObserver(() => {
      // Small debounce
      setTimeout(handleResize, 100);
    });
    
    resizeObserver.observe(containerRef.current);


    // --- 15. Standard cleanup ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      
      // Cleanup geometries and materials to avoid memory leaks
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-slate-950"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
