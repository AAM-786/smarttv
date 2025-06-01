import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API endpoint using Open-Meteo
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat = 19.0760, lon = 72.8777 } = req.query;
      
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia/Kolkata`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Weather API request failed');
      }
      
      const weatherData = await weatherResponse.json();
      const current = weatherData.current;
      
      // Map weather codes to conditions
      const getWeatherCondition = (code: number): string => {
        if (code <= 3) return 'Clear';
        if (code <= 48) return 'Cloudy';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snowy';
        if (code <= 82) return 'Showers';
        return 'Stormy';
      };
      
      const result = {
        temperature: Math.round(current.temperature_2m),
        condition: getWeatherCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        location: "Mumbai, Maharashtra",
        weatherCode: current.weather_code
      };
      
      res.json(result);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  // News API endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const { category = 'general' } = req.query;
      const apiKey = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY;
      
      if (!apiKey) {
        throw new Error('News API key not configured');
      }
      
      const newsResponse = await fetch(
        `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apiKey}`
      );
      
      if (!newsResponse.ok) {
        throw new Error('News API request failed');
      }
      
      const newsData = await newsResponse.json();
      
      const articles = newsData.articles?.map((article: any, index: number) => ({
        id: `${category}-${index}`,
        title: article.title,
        description: article.description || '',
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        category: category
      })) || [];
      
      res.json(articles);
    } catch (error) {
      console.error('News API error:', error);
      res.status(500).json({ error: 'Failed to fetch news data' });
    }
  });

  // Astronomy API endpoint using Open-Meteo
  app.get("/api/astronomy", async (req, res) => {
    try {
      const { lat = 19.0760, lon = 72.8777 } = req.query;
      const today = new Date().toISOString().split('T')[0];
      
      const astronomyResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=Asia/Kolkata&start_date=${today}&end_date=${today}`
      );
      
      if (!astronomyResponse.ok) {
        throw new Error('Astronomy API request failed');
      }
      
      const astronomyData = await astronomyResponse.json();
      const daily = astronomyData.daily;
      
      const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        });
      };
      
      // Calculate approximate moon times (simplified)
      const sunriseTime = new Date(daily.sunrise[0]);
      const sunsetTime = new Date(daily.sunset[0]);
      const moonriseTime = new Date(sunsetTime.getTime() + 2 * 60 * 60 * 1000); // Approx 2 hours after sunset
      const moonsetTime = new Date(sunriseTime.getTime() + 60 * 60 * 1000); // Approx 1 hour after sunrise
      
      const result = {
        sunrise: formatTime(daily.sunrise[0]),
        sunset: formatTime(daily.sunset[0]),
        moonrise: formatTime(moonriseTime.toISOString()),
        moonset: formatTime(moonsetTime.toISOString()),
        sunAzimuth: 180, // Simplified
        sunElevation: 45, // Simplified
        moonAzimuth: 270, // Simplified
        moonElevation: 30 // Simplified
      };
      
      res.json(result);
    } catch (error) {
      console.error('Astronomy API error:', error);
      res.status(500).json({ error: 'Failed to fetch astronomy data' });
    }
  });

  // YouTube Music API endpoint
  app.get("/api/youtube/music", async (req, res) => {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      
      if (!apiKey) {
        throw new Error('YouTube API key not configured');
      }
      
      const youtubeResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=10&key=${apiKey}&q=music`
      );
      
      if (!youtubeResponse.ok) {
        throw new Error('YouTube API request failed');
      }
      
      const youtubeData = await youtubeResponse.json();
      res.json(youtubeData);
    } catch (error) {
      console.error('YouTube Music API error:', error);
      res.status(500).json({ error: 'Failed to fetch YouTube music data' });
    }
  });

  // Sports scores endpoint (placeholder for now)
  app.get("/api/sports", async (req, res) => {
    try {
      // This would integrate with a sports API like ESPN or similar
      const mockSports = [
        {
          id: "1",
          league: "IPL 2024",
          team1: "Mumbai Indians",
          team2: "Chennai Super Kings",
          score1: "185/6",
          score2: "142/8",
          status: "LIVE",
          details: "MI won by 43 runs • Man of the Match: R. Sharma",
          isLive: false
        }
      ];
      
      res.json(mockSports);
    } catch (error) {
      console.error('Sports API error:', error);
      res.status(500).json({ error: 'Failed to fetch sports data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
