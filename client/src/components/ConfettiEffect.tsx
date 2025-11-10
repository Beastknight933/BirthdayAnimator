import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  rotation: number;
  velocity: { x: number; y: number };
  color: string;
  size: number;
  rotationSpeed: number;
}

export default function ConfettiEffect({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      "#FF6B9D",
      "#C44569",
      "#F8B500",
      "#FFA07A",
      "#FFD700",
      "#FF69B4",
      "#FF1493",
      "#DA70D6",
    ];

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: -10,
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 3,
        y: Math.random() * 3 + 2,
      },
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });

    for (let i = 0; i < 150; i++) {
      particlesRef.current.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.rotation += particle.rotationSpeed;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();

        if (particle.y > canvas.height) {
          particlesRef.current[index] = createParticle();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      particlesRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}
