import { useEffect, useRef } from "react";

const MetorBackground: React.FC = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const terCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const terrain = terCanvasRef.current;
    const background = bgCanvasRef.current;

    if (!terrain || !background) return;

    const terCtx = terrain.getContext("2d");
    const bgCtx = background.getContext("2d");

    const width = window.innerWidth;
    let height = window.innerHeight;
    if (height < 400) height = 400;

    terrain.width = background.width = width;
    terrain.height = background.height = height;

    // Terrain
    const points: number[] = [];
    let displacement = 140;
    const power = Math.pow(2, Math.ceil(Math.log(width) / Math.log(2)));

    points[0] = height - Math.random() * (height / 2) - displacement;
    points[power] = height - Math.random() * (height / 2) - displacement;

    for (let i = 1; i < power; i *= 2) {
      for (let j = (power / i) / 2; j < power; j += power / i) {
        points[j] =
          (points[j - power / i / 2] + points[j + power / i / 2]) / 2 +
          Math.floor(Math.random() * -displacement + displacement);
      }
      displacement *= 0.6;
    }

    terCtx!.beginPath();
    for (let i = 0; i <= width; i++) {
      if (i === 0) {
        terCtx!.moveTo(0, points[0]);
      } else if (points[i] !== undefined) {
        terCtx!.lineTo(i, points[i]);
      }
    }
    terCtx!.lineTo(width, terrain.height);
    terCtx!.lineTo(0, terrain.height);
    terCtx!.lineTo(0, points[0]);
    terCtx!.fillStyle = "#222";
    terCtx!.fill();

    // Background gradient
    const gradient = bgCtx!.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#0B132B");
    gradient.addColorStop(1, "#1B3A2D");
    bgCtx!.fillStyle = gradient;
    bgCtx!.fillRect(0, 0, width, height);

    class Star {
      size: number;
      speed: number;
      x: number;
      y: number;
      constructor(options: { x: number; y: number }) {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.1;
        this.x = options.x;
        this.y = options.y;
      }
      reset() {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.1;
        this.x = width;
        this.y = Math.random() * height;
      }
      update(bgCtx: CanvasRenderingContext2D) {
        this.x -= this.speed;
        if (this.x < 0) {
          this.reset();
        } else {
          bgCtx.fillRect(this.x, this.y, this.size, this.size);
        }
      }
    }

    class ShootingStar {
      x: number = 0;
      y: number = 0;
      len: number = 0;
      speed: number = 0;
      size: number = 0;
      waitTime: number = 0;
      active: boolean = false;
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.len = Math.random() * 80 + 10;
        this.speed = Math.random() * 10 + 6;
        this.size = Math.random() * 1 + 0.1;
        this.waitTime = new Date().getTime() + (Math.random() * 3000 + 500);
        this.active = false;
      }
      update(bgCtx: CanvasRenderingContext2D) {
        if (this.active) {
          this.x -= this.speed;
          this.y += this.speed;
          if (this.x < 0 || this.y >= height) {
            this.reset();
          } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
          }
        } else {
          if (this.waitTime < new Date().getTime()) {
            this.active = true;
          }
        }
      }
    }

    const entities: (Star | ShootingStar)[] = [];
    for (let i = 0; i < height; i++) {
      entities.push(new Star({ x: Math.random() * width, y: Math.random() * height }));
    }
    entities.push(new ShootingStar());
    entities.push(new ShootingStar());

    let animationFrameId: number;

    const animate = () => {
      const gradient = bgCtx!.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#0B132B");
      gradient.addColorStop(1, "#1B3A2D");
      bgCtx!.fillStyle = gradient;
      bgCtx!.fillRect(0, 0, width, height);
      bgCtx!.fillStyle = "#ffffff";
      bgCtx!.strokeStyle = "#ffffff";

      for (const entity of entities) {
        if (entity instanceof Star) {
          entity.update(bgCtx!);
        } else if (entity instanceof ShootingStar) {
          entity.update(bgCtx!);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] overflow-hidden">
      <canvas ref={bgCanvasRef} className="absolute top-0 left-0 w-full h-full" />
      <canvas ref={terCanvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default MetorBackground;
