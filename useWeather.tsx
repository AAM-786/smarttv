import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  weatherCode: number;
}

export function useWeather(latitude: number = 19.0760, longitude: number = 72.8777) {
  return useQuery<WeatherData>({
    queryKey: [`/api/weather?lat=${latitude}&lon=${longitude}`],
    refetchInterval: 600000, // 10 minutes
  });
}
