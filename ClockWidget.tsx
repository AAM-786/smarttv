import { useEffect, useState, useRef } from "react";

export function ClockWidget() {
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const digitalCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const drawEnhancedHand = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    length: number,
    width: number,
    color1: string,
    color2: string
  ) => {
    const endX = x + length * Math.cos(angle - Math.PI / 2);
    const endY = y + length * Math.sin(angle - Math.PI / 2);

    // Create gradient for hand
    const gradient = ctx.createLinearGradient(x, y, endX, endY);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    // Draw main hand
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.shadowColor = color1;
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw hand tip decoration
    ctx.beginPath();
    ctx.arc(endX, endY, width / 2, 0, 2 * Math.PI);
    ctx.fillStyle = color2;
    ctx.fill();
  };

  const drawDigitalDisplay = () => {
    const canvas = digitalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Digital time background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#9333EA');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, '#3B82F6');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Time text with glow effect
    const timeString = formatTime(time);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 5;
    ctx.fillText(timeString, canvas.width / 2, canvas.height / 2 + 10);
    ctx.shadowBlur = 0;
  };

  const drawAnalogClock = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 90;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create royal gradient background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.7, '#16213e');
    gradient.addColorStop(1, '#0f3460');

    // Draw outer ring with glow effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#9333EA';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#9333EA';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw inner decorative ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hour markers with royal styling
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      const isMainHour = i % 3 === 0;
      
      const outerRadius = radius - (isMainHour ? 20 : 15);
      const innerRadius = radius - (isMainHour ? 35 : 25);
      
      const x1 = centerX + outerRadius * Math.cos(angle - Math.PI / 2);
      const y1 = centerY + outerRadius * Math.sin(angle - Math.PI / 2);
      const x2 = centerX + innerRadius * Math.cos(angle - Math.PI / 2);
      const y2 = centerY + innerRadius * Math.sin(angle - Math.PI / 2);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMainHour ? '#FFD700' : '#9333EA';
      ctx.lineWidth = isMainHour ? 4 : 2;
      ctx.stroke();

      // Add hour numbers
      if (isMainHour) {
        const hourNum = i === 0 ? 12 : i;
        const textX = centerX + (radius - 50) * Math.cos(angle - Math.PI / 2);
        const textY = centerY + (radius - 50) * Math.sin(angle - Math.PI / 2) + 6;
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(hourNum.toString(), textX, textY);
      }
    }

    // Draw hands with enhanced styling
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Hour hand - royal purple with gold tip
    const hourAngle = (hours + minutes / 60) * 30 * Math.PI / 180;
    drawEnhancedHand(ctx, centerX, centerY, hourAngle, radius * 0.5, 8, '#9333EA', '#FFD700');

    // Minute hand - gold with purple tip
    const minuteAngle = minutes * 6 * Math.PI / 180;
    drawEnhancedHand(ctx, centerX, centerY, minuteAngle, radius * 0.75, 6, '#FFD700', '#9333EA');

    // Second hand - smooth animation with red accent
    const secondAngle = (seconds + milliseconds / 1000) * 6 * Math.PI / 180;
    drawEnhancedHand(ctx, centerX, centerY, secondAngle, radius * 0.85, 2, '#EF4444', '#FFFFFF');

    // Center jewel
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.7, '#9333EA');
    centerGradient.addColorStop(1, '#1a1a2e');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawAnalogClock();
    drawDigitalDisplay();
  }, [time]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Advanced Digital Clock */}
      <div className="tv-card royal-gradient rounded-3xl p-8 tv-focus text-center clock-glow card-3d" tabIndex={0}>
        <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center text-white">
          <i className="fas fa-clock text-yellow-300 mr-3"></i>
          Digital Display
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <canvas
              ref={digitalCanvasRef}
              width="300"
              height="80"
              className="w-full rounded-xl"
            />
          </div>
          <div className="text-xl text-white/90">
            {formatDate(time)}
          </div>
          <div className="text-lg text-white/75">
            {getTimeGreeting()}, Mumbai
          </div>
          <div className="text-sm text-white/60">
            IST (UTC+5:30)
          </div>
        </div>
      </div>

      {/* Royal Analog Clock */}
      <div className="tv-card bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 tv-focus text-center clock-glow card-3d" tabIndex={0}>
        <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center text-white">
          <i className="fas fa-clock text-yellow-300 mr-3"></i>
          Royal Timepiece
        </h3>
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width="200"
            height="200"
            className="rounded-full"
          />
        </div>
        <div className="mt-4 text-white/80">
          <div className="text-lg font-semibold">
            Mumbai, Maharashtra
          </div>
          <div className="text-sm">
            Precision Timekeeping
          </div>
        </div>
      </div>
    </div>
  );
}