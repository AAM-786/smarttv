import { useWeather } from "../hooks/useWeather";
import { useEffect, useState } from "react";

interface WeatherParticle {
  id: number;
  left: number;
  animationDelay: number;
  size: number;
  type: string;
}

interface WeatherCloud {
  id: number;
  left: number;
  top: number;
  size: number;
  speed: number;
}

export function WeatherWidget() {
  const { data: weather, isLoading, error } = useWeather();
  const [particles, setParticles] = useState<WeatherParticle[]>([]);
  const [clouds, setClouds] = useState<WeatherCloud[]>([]);
  const [season, setSeason] = useState<string>('');

  useEffect(() => {
    if (!weather) return;

    // Determine season based on month
    const currentMonth = new Date().getMonth();
    let currentSeason = '';
    if (currentMonth >= 6 && currentMonth <= 9) currentSeason = 'monsoon';
    else if (currentMonth >= 3 && currentMonth <= 5) currentSeason = 'summer';
    else if (currentMonth >= 10 || currentMonth <= 2) currentSeason = 'winter';
    
    setSeason(currentSeason);

    // Create weather particles based on condition and season
    const newParticles: WeatherParticle[] = [];
    const newClouds: WeatherCloud[] = [];
    const particleCount = getParticleCount(weather.weatherCode, currentSeason);
    
    // Generate particles
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 10,
        size: Math.random() * 0.5 + 0.5,
        type: getParticleType(weather.weatherCode, currentSeason),
      });
    }

    // Generate clouds for certain conditions
    if (weather.weatherCode > 3) {
      for (let i = 0; i < 3; i++) {
        newClouds.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 40 + 10,
          size: Math.random() * 0.5 + 0.8,
          speed: Math.random() * 2 + 1,
        });
      }
    }
    
    setParticles(newParticles);
    setClouds(newClouds);
  }, [weather]);

  const getParticleCount = (weatherCode: number, season: string): number => {
    if (season === 'monsoon' && (weatherCode >= 61 && weatherCode <= 67)) return 80; // Heavy monsoon rain
    if (weatherCode >= 71 && weatherCode <= 77) return 60; // Snow
    if (weatherCode >= 61 && weatherCode <= 67) return 40; // Rain
    if (weatherCode <= 3 && season === 'summer') return 30; // Summer sunshine
    return 20; // Default
  };

  const getParticleType = (weatherCode: number, season: string): string => {
    if (season === 'monsoon' && (weatherCode >= 61 && weatherCode <= 67)) return 'weather-monsoon';
    if (weatherCode >= 71 && weatherCode <= 77) return 'weather-ice';
    if (weatherCode >= 61 && weatherCode <= 67) return 'weather-rain';
    if (weatherCode <= 3 && season === 'summer') return 'weather-sun';
    if (weatherCode > 80) return 'weather-thunder';
    return 'weather-air';
  };

  const getParticleIcon = (weatherCode: number, season: string): string => {
    if (season === 'monsoon' && (weatherCode >= 61 && weatherCode <= 67)) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
    if (weatherCode >= 61 && weatherCode <= 67) return '💧';
    if (weatherCode <= 3 && season === 'summer') return '☀️';
    if (weatherCode > 80) return '⚡';
    return '💨';
  };

  const getWeatherGradient = (weatherCode: number, season: string): string => {
    if (season === 'monsoon') return 'from-gray-700 via-blue-600 to-blue-800';
    if (season === 'summer') return 'from-orange-400 via-yellow-500 to-red-500';
    if (season === 'winter') return 'from-blue-300 via-cyan-400 to-blue-600';
    if (weatherCode >= 61 && weatherCode <= 67) return 'from-gray-600 to-blue-700';
    if (weatherCode <= 3) return 'from-blue-400 to-cyan-500';
    return 'from-purple-600 to-blue-600';
  };

  if (isLoading) {
    return (
      <div className="tv-card royal-gradient rounded-3xl p-8 tv-focus relative overflow-hidden glass-morphism">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-16 bg-white/20 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-8 bg-white/20 rounded"></div>
            <div className="h-8 bg-white/20 rounded"></div>
            <div className="h-8 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tv-card bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 tv-focus">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Weather Unavailable</h3>
          <p className="text-sm opacity-80">Unable to fetch weather data</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`tv-card card-3d bg-gradient-to-br ${getWeatherGradient(weather.weatherCode, season)} rounded-3xl p-8 tv-focus relative overflow-hidden`} tabIndex={0}>
      {/* Weather Animation Clouds */}
      <div className="absolute inset-0 pointer-events-none">
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute weather-cloud opacity-60"
            style={{
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              fontSize: `${cloud.size * 2}rem`,
              animationDuration: `${15 / cloud.speed}s`,
            }}
          >
            ☁️
          </div>
        ))}
      </div>

      {/* Weather Animation Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${particle.type}`}
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              fontSize: `${particle.size}rem`,
            }}
          >
            {getParticleIcon(weather.weatherCode, season)}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-semibold flex items-center text-white">
              <i className="fas fa-cloud-sun text-yellow-300 mr-3"></i>
              Weather - Mumbai
            </h3>
            <p className="text-lg opacity-90 text-white">Ghatkopar, Maharashtra</p>
            <p className="text-sm opacity-75 text-white capitalize">{season} Season</p>
          </div>
          <div className="text-right text-white">
            <div className="text-6xl font-bold mb-2 drop-shadow-lg">{weather.temperature}°C</div>
            <div className="text-xl opacity-90">{weather.condition}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-lg">
          <div className="glass-morphism rounded-xl p-4">
            <i className="fas fa-eye text-yellow-300 mb-2 text-xl"></i>
            <div className="text-sm opacity-80 text-white">Humidity</div>
            <div className="font-semibold text-white">{weather.humidity}%</div>
          </div>
          <div className="glass-morphism rounded-xl p-4">
            <i className="fas fa-wind text-cyan-300 mb-2 text-xl"></i>
            <div className="text-sm opacity-80 text-white">Wind Speed</div>
            <div className="font-semibold text-white">{weather.windSpeed} km/h</div>
          </div>
          <div className="glass-morphism rounded-xl p-4">
            <i className="fas fa-thermometer-half text-orange-300 mb-2 text-xl"></i>
            <div className="text-sm opacity-80 text-white">Feels Like</div>
            <div className="font-semibold text-white">{weather.temperature + 2}°C</div>
          </div>
        </div>

        {/* Weather Forecast Mini */}
        <div className="mt-6 glass-morphism rounded-xl p-4">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <i className="fas fa-calendar-alt text-purple-300 mr-2"></i>
            Today's Forecast
          </h4>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="text-white">
              <div className="text-sm opacity-80">Morning</div>
              <div className="text-2xl">{season === 'summer' ? '☀️' : season === 'monsoon' ? '🌧️' : '☁️'}</div>
              <div className="font-semibold">{weather.temperature - 3}°</div>
            </div>
            <div className="text-white">
              <div className="text-sm opacity-80">Afternoon</div>
              <div className="text-2xl">{season === 'summer' ? '🌤️' : season === 'monsoon' ? '⛈️' : '❄️'}</div>
              <div className="font-semibold">{weather.temperature + 1}°</div>
            </div>
            <div className="text-white">
              <div className="text-sm opacity-80">Evening</div>
              <div className="text-2xl">{season === 'summer' ? '🌅' : season === 'monsoon' ? '🌦️' : '🌨️'}</div>
              <div className="font-semibold">{weather.temperature - 1}°</div>
            </div>
            <div className="text-white">
              <div className="text-sm opacity-80">Night</div>
              <div className="text-2xl">{season === 'summer' ? '🌙' : season === 'monsoon' ? '⛅' : '❄️'}</div>
              <div className="font-semibold">{weather.temperature - 4}°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
