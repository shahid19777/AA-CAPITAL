import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowUp, 
  Car, 
  Briefcase, 
  Users, 
  Sun, 
  Coins, 
  Maximize2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface CanvasVideoPlayerProps {
  autoPlay?: boolean;
  onOpenBookingModal?: () => void;
}

const TOTAL_DURATION = 36; // 36 seconds total (6 scenes x 6 seconds)

const SCENES_DATA = [
  {
    start: 0,
    end: 6,
    badge: 'SCENE 1: ARRIVAL',
    title: 'A Man Comes in the Car',
    subtitle: 'AA Central • Ground + 34 • 10 Dedicated Parking Floors',
    script:
      'Dawn breaks over Karachi’s premier business district. An executive sedan pulls up to the private port-cochère of AA Central. Valet attendants welcome him to the Ground plus thirty-four storey commercial hub of the future.',
  },
  {
    start: 6,
    end: 12,
    badge: 'SCENE 2: ELEVATOR',
    title: 'Ascending via High-Speed Lift',
    subtitle: '6 Smart Passenger Lifts • Panoramic Glass Skyline Views',
    script:
      'Stepping through the grand double-height Italian marble atrium, he boards one of six high-speed smart glass lifts. Accelerating smoothly to Floor 28, taking in panoramic views of the Karachi coastline and metropolis.',
  },
  {
    start: 12,
    end: 18,
    badge: 'SCENE 3: EXECUTIVE SUITE',
    title: 'Enters in Well-Furnished Office',
    subtitle: '600 Executive Offices • Bespoke Italian Walnut & Leather',
    script:
      'Biometric glass doors slide open into his bespoke executive office. Elegantly furnished with tailored Italian walnut, plush leather armchairs, and floor-to-ceiling glass framing the golden morning skyline.',
  },
  {
    start: 18,
    end: 24,
    badge: 'SCENE 4: PRODUCTIVE TEAM',
    title: 'All Staff Doing Their Work',
    subtitle: 'Collaborative Open Floor • Fiber-Optics • 100% Generator Backup',
    script:
      'Across the corporate floor, a vibrant team is in full momentum. Analysts and executives collaborating, trading desks in active flow, powered by redundant fiber-optics and zero-downtime energy.',
  },
  {
    start: 24,
    end: 30,
    badge: 'SCENE 5: ROOFTOP AMENITIES',
    title: 'Rooftop Luxury, Padel & Pool',
    subtitle: 'Skyline Infinity Pool • Championship Padel Court • Gym & Lounge',
    script:
      'When the market closes, luxury ascends to the rooftop. Unwind in the infinity swimming pool, play a match on the championship padel tennis court, or retreat to the executive sauna and private business lounge.',
  },
  {
    start: 30,
    end: 36,
    badge: 'SCENE 6: INVESTMENT',
    title: '66-Month Flexible Payment Plan',
    subtitle: 'PKR 26,000 - 28,000 / sq. ft. • Pre-Launch Booking Allocation',
    script:
      'An unprecedented pre-launch investment opportunity. Secure your corporate presence today with an easy sixty-six month payment plan at twenty-six to twenty-eight thousand rupees per square foot. AA Central: The Future Business Hub.',
  },
];

export const CanvasVideoPlayer: React.FC<CanvasVideoPlayerProps> = ({
  autoPlay = false,
  onOpenBookingModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const playedScenesRef = useRef<Set<number>>(new Set());

  // Current Scene Helper
  const currentScene = SCENES_DATA[activeSceneIdx] || SCENES_DATA[0];

  // Play voice narration for the scene
  const triggerSceneNarration = useCallback((sceneIdx: number) => {
    if (playedScenesRef.current.has(sceneIdx)) return;
    playedScenesRef.current.add(sceneIdx);

    const scene = SCENES_DATA[sceneIdx];
    if (!scene) return;

    // Trigger audio effects based on scene
    if (sceneIdx === 0) audioEngine.playCarArrivalWhoosh();
    if (sceneIdx === 1) audioEngine.playElevatorDing();

    // Trigger speech
    if (!isMuted) {
      audioEngine.speakFallback(scene.script);
    }
  }, [isMuted]);

  // Main Render Loop
  const renderCanvas = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Current scene determination
    const sceneIdx = Math.min(
      Math.floor(time / 6),
      SCENES_DATA.length - 1
    );
    const sceneProgress = (time % 6) / 6; // 0.0 to 1.0 within current scene

    // Clear background
    ctx.clearRect(0, 0, w, h);

    // ========================================================
    // SCENE 1: ARRIVAL IN CAR (0 to 6s)
    // ========================================================
    if (sceneIdx === 0) {
      // Twilight Gradient Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0a0d1a');
      skyGrad.addColorStop(0.5, '#1e1b4b');
      skyGrad.addColorStop(0.85, '#451a03');
      skyGrad.addColorStop(1, '#171717');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Tower Silhouette (AA Central - Ground + 34)
      const towerX = w * 0.58;
      const towerW = w * 0.36;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(towerX, h * 0.08, towerW, h * 0.8);

      // Glowing Glass Windows
      ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
      for (let row = 0; row < 22; row++) {
        for (let col = 0; col < 6; col++) {
          if ((row + col) % 3 === 0) {
            ctx.fillRect(
              towerX + 12 + col * (towerW / 7),
              h * 0.12 + row * (h * 0.032),
              towerW / 9,
              h * 0.02
            );
          }
        }
      }

      // Tower Top Spire & Crown Light
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(towerX + towerW / 2 - 2, h * 0.03, 4, h * 0.05);
      ctx.beginPath();
      ctx.arc(towerX + towerW / 2, h * 0.03, 5 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      // Road & Driveway
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, h * 0.76, w, h * 0.24);

      // Entrance Canopy / Port-Cochère
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(towerX - 30, h * 0.68, towerW + 40, 14);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('AA CENTRAL', towerX - 10, h * 0.66);

      // Executive Sedan Car animating from left to center
      // Clamps to stop in front of entrance
      const carTargetX = Math.min(w * 0.15 + sceneProgress * (w * 0.5), w * 0.38);
      const carY = h * 0.81;

      // Headlight Beams
      const beamGrad = ctx.createRadialGradient(
        carTargetX + 130, carY + 18, 5,
        carTargetX + 240, carY + 22, 160
      );
      beamGrad.addColorStop(0, 'rgba(254, 243, 199, 0.6)');
      beamGrad.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(carTargetX + 110, carY + 12);
      ctx.lineTo(carTargetX + 260, carY - 20);
      ctx.lineTo(carTargetX + 280, carY + 45);
      ctx.closePath();
      ctx.fill();

      // Car Body (Sleek Black Executive Sedan)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(carTargetX, carY + 5, 120, 24, 6);
      ctx.fill();

      // Car Roof & Tinted Glass
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(carTargetX + 28, carY + 5);
      ctx.lineTo(carTargetX + 45, carY - 14);
      ctx.lineTo(carTargetX + 90, carY - 14);
      ctx.lineTo(carTargetX + 104, carY + 5);
      ctx.closePath();
      ctx.fill();

      // Car Wheels (with spinning spokes effect)
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.arc(carTargetX + 26, carY + 26, 12, 0, Math.PI * 2);
      ctx.arc(carTargetX + 98, carY + 26, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e4e4e7';
      ctx.beginPath();
      ctx.arc(carTargetX + 26, carY + 26, 5, 0, Math.PI * 2);
      ctx.arc(carTargetX + 98, carY + 26, 5, 0, Math.PI * 2);
      ctx.fill();

      // Valet Greeting Door
      if (sceneProgress > 0.6) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px sans-serif';
        ctx.fillText('✓ Valet Attendant Greeting Executive', carTargetX - 10, carY - 28);
      }
    }

    // ========================================================
    // SCENE 2: ELEVATOR / LIFT TO FLOOR 28 (6 to 12s)
    // ========================================================
    else if (sceneIdx === 1) {
      // City View Panorama moving down (parallax ascension)
      const panoramaOffset = sceneProgress * (h * 0.5);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.7, '#38bdf8');
      skyGrad.addColorStop(1, '#fdba74');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant City Skyline moving down
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 14; i++) {
        const bh = 100 + ((i * 37) % 180);
        const bx = i * (w / 12);
        ctx.fillRect(bx, h * 0.45 + panoramaOffset * 0.5 - (bh * 0.2), w / 14, bh);
      }

      // Foreground Glass Elevator Frame
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, 0, 40, h);
      ctx.fillRect(w - 40, 0, 40, h);
      ctx.fillRect(0, 0, w, 40);
      ctx.fillRect(0, h - 50, w, 50);

      // Glass Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.33, 40);
      ctx.lineTo(w * 0.33, h - 50);
      ctx.moveTo(w * 0.66, 40);
      ctx.lineTo(w * 0.66, h - 50);
      ctx.stroke();

      // Real Digital Floor Counter
      const currentFloor = Math.min(28, Math.floor(1 + sceneProgress * 27));
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 95, 12, 190, 44, 8);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`▲ FLOOR ${currentFloor} / 34`, w / 2, 40);
      ctx.textAlign = 'left';

      // Speed Trails
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      for (let s = 0; s < 6; s++) {
        const sx = 60 + s * (w / 7);
        const sy = ((time * 800 + s * 140) % h);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + 35);
        ctx.stroke();
      }
    }

    // ========================================================
    // SCENE 3: WELL-FURNISHED EXECUTIVE OFFICE (12 to 18s)
    // ========================================================
    else if (sceneIdx === 2) {
      // Luxury Office Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Floor-to-Ceiling Window on the Right
      const winX = w * 0.48;
      const winW = w * 0.48;
      const winGrad = ctx.createLinearGradient(winX, 0, winX, h);
      winGrad.addColorStop(0, '#0369a1');
      winGrad.addColorStop(0.7, '#fb923c');
      winGrad.addColorStop(1, '#fed7aa');
      ctx.fillStyle = winGrad;
      ctx.fillRect(winX, h * 0.1, winW, h * 0.72);

      // City Towers through the glass
      ctx.fillStyle = '#1e293b';
      for (let k = 0; k < 6; k++) {
        ctx.fillRect(winX + 15 + k * 40, h * 0.4, 30, h * 0.4);
      }

      // Wooden Walnut Floor
      ctx.fillStyle = '#3d2214';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);

      // Big Italian Walnut Executive Desk
      const deskX = w * 0.12;
      const deskY = h * 0.62;
      const deskW = w * 0.58;
      ctx.fillStyle = '#5c2c16';
      ctx.fillRect(deskX, deskY, deskW, 28);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(deskX + 15, deskY + 28, 20, 60);
      ctx.fillRect(deskX + deskW - 35, deskY + 28, 20, 60);

      // High-Back Executive Leather Chair
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(deskX + deskW * 0.4, deskY - 65, 55, 75, 8);
      ctx.fill();

      // Desktop Computer / Bloomberg Terminal on Desk
      ctx.fillStyle = '#27272a';
      ctx.fillRect(deskX + deskW * 0.35, deskY - 32, 60, 30);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(deskX + deskW * 0.37, deskY - 29, 56, 24);
      // Screen graphs
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(deskX + deskW * 0.38, deskY - 14);
      ctx.lineTo(deskX + deskW * 0.45, deskY - 22);
      ctx.lineTo(deskX + deskW * 0.52, deskY - 17);
      ctx.lineTo(deskX + deskW * 0.62, deskY - 26);
      ctx.stroke();

      // Biometric Glass Door Sliding Open Animation
      const doorOpen = Math.min(1.0, sceneProgress * 1.6);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(w * 0.02 - doorOpen * 80, h * 0.1, 70, h * 0.6);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(w * 0.02 - doorOpen * 80, h * 0.1, 70, h * 0.6);

      // Spec Tag
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('✓ Suite 2804 • Fully Furnished Executive CEO Corner', w * 0.1, h * 0.2);
    }

    // ========================================================
    // SCENE 4: STAFF DOING THEIR WORK (18 to 24s)
    // ========================================================
    else if (sceneIdx === 3) {
      // Modern Tech Office Background
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, w, h);

      // Ceiling Architectural Light Rings
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.3, h * 0.12, 45, 0, Math.PI * 2);
      ctx.arc(w * 0.72, h * 0.12, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Workstation Desks (Grid of 4 Active Desks)
      const desks = [
        { x: w * 0.08, y: h * 0.42, w: w * 0.38, label: 'Financial Trading Desk' },
        { x: w * 0.54, y: h * 0.42, w: w * 0.38, label: 'Software & FinTech Lab' },
        { x: w * 0.08, y: h * 0.68, w: w * 0.38, label: 'Logistics Operations' },
        { x: w * 0.54, y: h * 0.68, w: w * 0.38, label: 'Executive Boardroom' },
      ];

      desks.forEach((d, idx) => {
        // Desk Top
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(d.x, d.y, d.w, 18);

        // Computer Monitors
        ctx.fillStyle = '#334155';
        ctx.fillRect(d.x + 30, d.y - 28, 48, 26);
        ctx.fillRect(d.x + 85, d.y - 28, 48, 26);

        // Glowing Screens with Live Charts
        ctx.fillStyle = idx % 2 === 0 ? '#0284c7' : '#059669';
        ctx.fillRect(d.x + 32, d.y - 26, 44, 22);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(d.x + 87, d.y - 26, 44, 22);

        // Moving data lines
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(d.x + 35, d.y - 12);
        ctx.lineTo(d.x + 55, d.y - 22 + Math.sin(time * 5 + idx) * 4);
        ctx.lineTo(d.x + 72, d.y - 15);
        ctx.stroke();

        // Staff Silhouettes Typing
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(d.x + d.w * 0.5, d.y - 36, 10, 0, Math.PI * 2); // Head
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.fillRect(d.x + d.w * 0.5 - 14, d.y - 24, 28, 22); // Torso

        // Desk Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.fillText(d.label, d.x + 10, d.y + 35);
      });

      // Banner: 100% Productivity
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚡ 100% Backup Generators • 10 Gbps Tier-1 Fiber Optic Riser', w * 0.1, h * 0.94);
    }

    // ========================================================
    // SCENE 5: ROOFTOP LUXURY & WELLNESS (24 to 30s)
    // ========================================================
    else if (sceneIdx === 4) {
      // Golden Hour Sky at 450 Feet
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#581c87');
      skyGrad.addColorStop(0.5, '#ea580c');
      skyGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Rooftop Deck Floor
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      // Infinity Swimming Pool
      const poolX = w * 0.08;
      const poolY = h * 0.62;
      const poolW = w * 0.42;
      const poolH = h * 0.28;

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(poolX, poolY, poolW, poolH);

      // Water Ripple Effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      for (let r = 0; r < 5; r++) {
        const ry = poolY + 15 + r * 22;
        ctx.beginPath();
        ctx.moveTo(poolX, ry);
        ctx.bezierCurveTo(
          poolX + poolW * 0.33, ry + Math.sin(time * 4 + r) * 6,
          poolX + poolW * 0.66, ry - Math.sin(time * 4 + r) * 6,
          poolX + poolW, ry
        );
        ctx.stroke();
      }

      // Padel Court (Championship Blue Turf & Glass)
      const padelX = w * 0.54;
      const padelY = h * 0.6;
      const padelW = w * 0.38;
      const padelH = h * 0.3;

      // Blue Turf
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(padelX, padelY, padelW, padelH);

      // Glass Enclosure
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(padelX, padelY, padelW, padelH);

      // Net
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(padelX + padelW / 2, padelY);
      ctx.lineTo(padelX + padelW / 2, padelY + padelH);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('🏊 Skyline Infinity Pool', poolX + 15, poolY - 10);
      ctx.fillText('🎾 Championship Padel Court', padelX + 10, padelY - 10);
    }

    // ========================================================
    // SCENE 6: 66-MONTH PAYMENT PLAN & OFFER (30 to 36s)
    // ========================================================
    else if (sceneIdx === 5) {
      // Prestigious Night Horizon
      const nightGrad = ctx.createLinearGradient(0, 0, 0, h);
      nightGrad.addColorStop(0, '#090d16');
      nightGrad.addColorStop(0.6, '#172554');
      nightGrad.addColorStop(1, '#020617');
      ctx.fillStyle = nightGrad;
      ctx.fillRect(0, 0, w, h);

      // Big Golden Financial Badge
      const cardX = w * 0.1;
      const cardY = h * 0.12;
      const cardW = w * 0.8;
      const cardH = h * 0.72;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gold Title
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AA CENTRAL', w / 2, cardY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('THE FUTURE BUSINESS HUB (G + 34)', w / 2, cardY + 70);

      // Rate Box
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(cardX + 25, cardY + 95, cardW - 50, 60, 10);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('PKR 26,000 - 28,000 / sq. ft.', w / 2, cardY + 132);

      // 66-Month Plan Highlight
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('📅 66-MONTH FLEXIBLE PAYMENT PLAN', w / 2, cardY + 190);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px sans-serif';
      ctx.fillText('600 Executive Offices • Floors 11-34 • 10 Parking Floors', w / 2, cardY + 220);
      ctx.fillText('14.5%+ Projected Net Commercial Rental Yield', w / 2, cardY + 245);

      // CTA Callout
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('✓ Complete the Enquiry Form Today for Pre-Launch Offer', w / 2, cardY + 285);

      ctx.textAlign = 'left';
    }

    // Top Progress Line Across All Scenes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, w, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, (time / TOTAL_DURATION) * w, 4);

  }, []);

  // Animation Frame Driver
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            // Loop back to start
            playedScenesRef.current.clear();
            triggerSceneNarration(0);
            return 0;
          }

          // Check if entered new scene
          const newScene = Math.min(Math.floor(next / 6), SCENES_DATA.length - 1);
          if (newScene !== activeSceneIdx) {
            setActiveSceneIdx(newScene);
            triggerSceneNarration(newScene);
          }

          return next;
        });
      }

      renderCanvas(currentTime);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentTime, activeSceneIdx, renderCanvas, triggerSceneNarration]);

  // Handle Play/Pause
  const togglePlay = () => {
    audioEngine.initContext();

    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.stopVoice();
      audioEngine.stopBackgroundMusic();
    } else {
      setIsPlaying(true);
      if (!isMuted) {
        audioEngine.startBackgroundMusic();
        audioEngine.setMusicVolume(volume);
      }
      triggerSceneNarration(activeSceneIdx);
    }
  };

  // Autoplay support
  useEffect(() => {
    if (autoPlay && !isPlaying) {
      togglePlay();
    }
  }, [autoPlay]);

  // Jump to specific scene
  const handleJumpScene = (sceneIndex: number) => {
    audioEngine.initContext();
    audioEngine.stopVoice();
    const targetTime = sceneIndex * 6;
    setCurrentTime(targetTime);
    setActiveSceneIdx(sceneIndex);
    playedScenesRef.current.delete(sceneIndex);
    if (isPlaying) {
      triggerSceneNarration(sceneIndex);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMusicVolume(volume);
      if (isPlaying) {
        audioEngine.startBackgroundMusic();
        triggerSceneNarration(activeSceneIdx);
      }
    } else {
      setIsMuted(true);
      audioEngine.stopVoice();
      audioEngine.setMusicVolume(0);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // WhatsApp quick booking
  const waUrl = `https://wa.me/923008241920?text=${encodeURIComponent(
    `Assalam-o-Alaikum, I am inquiring about AA CENTRAL (Ground + 34 Business Hub). I watched the promo video and want details on executive office units (Floors 11-34) on the 66-month payment plan.`
  )}`;

  return (
    <div ref={containerRef} className="space-y-4 max-w-4xl mx-auto">
      {/* Video Player Display Container */}
      <div className="relative bg-slate-950 border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl">
        {/* Canvas Screen */}
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full aspect-video block bg-slate-950"
        />

        {/* Big Center Play Button Overlay (Shown When Paused) */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer transition group"
          >
            <div className="p-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition transform">
              <Play className="w-12 h-12 fill-current ml-1" />
            </div>
            <span className="text-sm font-black text-white mt-4 uppercase tracking-wider bg-slate-900/90 px-4 py-1.5 rounded-full border border-amber-500/40">
              ▶ Click to Start Video with Voice & Music
            </span>
            <span className="text-xs text-amber-300 mt-1">
              Scene 1 to 6 • Car Arrival → Lift → Furnished Office → Staff at Work
            </span>
          </div>
        )}

        {/* Live Subtitle Bar at Bottom of Video */}
        <div className="absolute bottom-16 inset-x-4 pointer-events-none">
          <div className="bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 text-center space-y-1">
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
              {currentScene.badge} • {currentScene.title}
            </span>
            <p className="text-xs text-white leading-relaxed font-medium">
              &ldquo;{currentScene.script}&rdquo;
            </p>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
          {/* Progress Bar / Seek Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-300">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={TOTAL_DURATION}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentTime(val);
                const sIdx = Math.min(Math.floor(val / 6), SCENES_DATA.length - 1);
                setActiveSceneIdx(sIdx);
              }}
              className="w-full h-1.5 accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400">
              {formatTime(TOTAL_DURATION)}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  setActiveSceneIdx(0);
                  playedScenesRef.current.clear();
                  if (isPlaying) triggerSceneNarration(0);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Restart Video"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleToggleMute}
                className={`p-2 rounded-xl border transition ${
                  isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <span className="text-[11px] text-slate-300 font-semibold hidden sm:inline">
                {currentScene.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp Booking</span>
              </a>

              {onOpenBookingModal && (
                <button
                  onClick={onOpenBookingModal}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow"
                >
                  Pre-Launch Form
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scene Jump Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Storyline Scenes (Click to Jump Instantly)</span>
          </span>
          <span className="text-xs text-slate-400">AA Central (Ground + 34)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {SCENES_DATA.map((scene, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpScene(idx)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                activeSceneIdx === idx
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-bold block mb-1">
                {idx + 1}. {scene.title.split(' ')[0]} {scene.title.split(' ')[1] || ''}
              </span>
              <span className="text-[9px] text-slate-500 block">
                00:{idx * 6 < 10 ? '0' : ''}{idx * 6}s
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
