import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface AstronomyData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  sunAzimuth: number;
  sunElevation: number;
  moonAzimuth: number;
  moonElevation: number;
}

export function AstronomyWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: astronomy, isLoading } = useQuery<AstronomyData>({
    queryKey: ['/api/astronomy?lat=19.0760&lon=72.8777'],
    refetchInterval: 3600000, // 1 hour
  });

  useEffect(() => {
    if (astronomy) {
      drawAstronomy();
    }
  }, [astronomy]);

  const drawAstronomy = () => {
    const canvas = canvasRef.current;
    if (!canvas || !astronomy) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create gradient background (day/night)
    const now = new Date();
    const currentHour = now.getHours();
    const isDaytime = currentHour >= 6 && currentHour <= 18;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isDaytime) {
      gradient.addColorStop(0, '#87CEEB'); // Sky blue
      gradient.addColorStop(0.7, '#FFE4B5'); // Moccasin
      gradient.addColorStop(1, '#32CD32'); // Lime green
    } else {
      gradient.addColorStop(0, '#191970'); // Midnight blue
      gradient.addColorStop(0.7, '#4B0082'); // Indigo
      gradient.addColorStop(1, '#000000'); // Black
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw horizon line
    const horizonY = height * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate sun position based on time
    const sunProgress = Math.max(0, Math.min(1, (currentHour - 6) / 12));
    const sunX = sunProgress * width;
    const sunY = horizonY - Math.sin(sunProgress * Math.PI) * (horizonY * 0.7);

    // Draw sun if it's daytime
    if (isDaytime && astronomy.sunElevation > 0) {
      // Sun glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 30);
      sunGlow.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      sunGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(sunX - 30, sunY - 30, 60, 60);

      // Sun body
      ctx.beginPath();
      ctx.arc(sunX, sunY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sun rays
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const rayLength = 25;
        ctx.beginPath();
        ctx.moveTo(
          sunX + Math.cos(angle) * 20,
          sunY + Math.sin(angle) * 20
        );
        ctx.lineTo(
          sunX + Math.cos(angle) * rayLength,
          sunY + Math.sin(angle) * rayLength
        );
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    // Calculate moon position
    const moonProgress = ((currentHour + 12) % 24) / 24;
    const moonX = moonProgress * width;
    const moonY = horizonY - Math.sin(moonProgress * Math.PI) * (horizonY * 0.6);

    // Draw moon if it's nighttime
    if (!isDaytime && astronomy.moonElevation > 0) {
      // Moon glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 25);
      moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - 25, moonY - 25, 50, 50);

      // Moon body
      ctx.beginPath();
      ctx.arc(moonX, moonY, 12, 0, 2 * Math.PI);
      ctx.fillStyle = '#F0F0F0';
      ctx.fill();
      ctx.strokeStyle = '#D3D3D3';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Moon craters
      ctx.beginPath();
      ctx.arc(moonX - 3, moonY - 2, 2, 0, 2 * Math.PI);
      ctx.arc(moonX + 2, moonY + 3, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#C0C0C0';
      ctx.fill();
    }

    // Add stars for nighttime
    if (!isDaytime) {
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * (horizonY * 0.6);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="tv-card bg-card rounded-3xl p-8 tv-focus">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-card bg-card rounded-3xl p-8 tv-focus" tabIndex={0}>
      <h3 className="text-2xl font-semibold mb-6 flex items-center">
        <i className="fas fa-sun text-primary mr-3"></i>
        Sun & Moon Tracker
      </h3>
      
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width="800"
          height="200"
          className="w-full rounded-xl border border-border"
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-muted rounded-xl p-4">
          <i className="fas fa-sun text-yellow-400 text-2xl mb-2"></i>
          <div className="text-sm text-muted-foreground">Sunrise</div>
          <div className="font-semibold">
            {astronomy?.sunrise || "6:42 AM"}
          </div>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <i className="fas fa-sun text-orange-400 text-2xl mb-2"></i>
          <div className="text-sm text-muted-foreground">Sunset</div>
          <div className="font-semibold">
            {astronomy?.sunset || "7:18 PM"}
          </div>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <i className="fas fa-moon text-blue-300 text-2xl mb-2"></i>
          <div className="text-sm text-muted-foreground">Moonrise</div>
          <div className="font-semibold">
            {astronomy?.moonrise || "8:30 PM"}
          </div>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <i className="fas fa-moon text-gray-400 text-2xl mb-2"></i>
          <div className="text-sm text-muted-foreground">Moonset</div>
          <div className="font-semibold">
            {astronomy?.moonset || "7:20 AM"}
          </div>
        </div>
      </div>
    </div>
  );
}
