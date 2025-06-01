import { useEffect, useState } from "react";
import { useTheme } from "../components/ThemeProvider";
import { useNavigation } from "../hooks/useNavigation";
import { useDynamicMessages } from "../hooks/useDynamicMessages";
import { WeatherWidget } from "../components/WeatherWidget";
import { ClockWidget } from "../components/ClockWidget";
import { AstronomyWidget } from "../components/AstronomyWidget";
import { PhotoSlideshow } from "../components/PhotoSlideshow";
import { MusicPlayer } from "../components/MusicPlayer";
import { OTTPlatforms } from "../components/OTTPlatforms";
import { NewsFeed } from "../components/NewsFeed";
import { SportsScores } from "../components/SportsScores";
import { VoiceControl } from "../components/VoiceControl";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { focusedIndex } = useNavigation();
  const { currentMessage, currentLanguage, changeLanguage } = useDynamicMessages();
  const [greeting, setGreeting] = useState("");
  const [timeContext, setTimeContext] = useState("");

  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let greetingText, contextText;

    if (hour < 12) {
      greetingText = "Good Morning, Mulani Family! 🌅";
      contextText = "Start your day with something amazing";
    } else if (hour < 17) {
      greetingText = "Good Afternoon, Mulani Family! ☀️";
      contextText = "Hope your day is going great";
    } else {
      greetingText = "Good Evening, Mulani Family! 🌙";
      contextText = "Time to relax and unwind";
    }

    setGreeting(greetingText);
    setTimeContext(contextText);
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    if (command.includes('weather')) {
      document.querySelector('[data-widget="weather"]')?.scrollIntoView({ behavior: 'smooth' });
    } else if (command.includes('music') || command.includes('play')) {
      document.querySelector('[data-widget="music"]')?.scrollIntoView({ behavior: 'smooth' });
    } else if (command.includes('photos')) {
      document.querySelector('[data-widget="photos"]')?.scrollIntoView({ behavior: 'smooth' });
    } else if (command.includes('news')) {
      document.querySelector('[data-widget="news"]')?.scrollIntoView({ behavior: 'smooth' });
    } else if (command.includes('theme') || command.includes('dark') || command.includes('light')) {
      toggleTheme();
    }
  };

  return (
    <div className="min-h-screen p-8 tv-spacing">
      {/* Enhanced Header Section */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full royal-gradient flex items-center justify-center clock-glow">
            <i className="fas fa-users text-3xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{greeting}</h1>
            <p className="text-xl text-muted-foreground">{timeContext}</p>
            
            {/* Dynamic Message Marquee */}
            <div className="mt-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-3 overflow-hidden">
              <div className="flex items-center">
                <button
                  onClick={changeLanguage}
                  className="mr-3 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold"
                >
                  {currentLanguage === 'english' ? 'EN' : currentLanguage === 'hindi' ? 'हि' : 'मर'}
                </button>
                <div className="flex-1 overflow-hidden">
                  <div className="marquee whitespace-nowrap text-lg font-medium">
                    {currentMessage?.text || "Welcome to your Smart TV Dashboard!"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            className="royal-button tv-focus p-4 rounded-xl transition-all duration-300"
            onClick={toggleTheme}
            tabIndex={0}
          >
            <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-xl text-white`}></i>
          </button>
          
          {/* Language Selector */}
          <button
            className="royal-button tv-focus p-4 rounded-xl transition-all duration-300"
            onClick={changeLanguage}
            tabIndex={0}
          >
            <i className="fas fa-language text-xl text-white"></i>
          </button>
          
          {/* Voice Control */}
          <VoiceControl onCommand={handleVoiceCommand} />
          
          {/* Settings */}
          <button
            className="royal-button tv-focus p-4 rounded-xl transition-all duration-300"
            tabIndex={0}
          >
            <i className="fas fa-cog text-xl text-white"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="tv-spacing">
        {/* Top Row: Weather, Clocks, and Astronomy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 tv-grid mb-12">
          <div data-widget="weather">
            <WeatherWidget />
          </div>
          <div className="lg:col-span-2">
            <ClockWidget />
          </div>
        </div>

        {/* Astronomy Widget */}
        <div className="mb-12">
          <AstronomyWidget />
        </div>

        {/* Entertainment Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 tv-grid mb-12">
          <div data-widget="photos">
            <PhotoSlideshow />
          </div>
          <div data-widget="music">
            <MusicPlayer />
          </div>
        </div>

        {/* OTT Platforms */}
        <div className="mb-12">
          <OTTPlatforms />
        </div>

        {/* News and Sports */}
        <div className="tv-spacing">
          <div data-widget="news">
            <NewsFeed />
          </div>
          <SportsScores />
        </div>
      </main>

      {/* Recommendations Section */}
      <section className="mb-12">
        <h3 className="text-3xl font-bold mb-6 flex items-center">
          <i className="fas fa-magic text-primary mr-4"></i>
          You Might Like
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 tv-grid">
          <div className="tv-card tv-focus bg-gradient-to-r from-pink-500 to-violet-600 rounded-3xl p-6" tabIndex={0}>
            <div className="flex items-center space-x-4">
              <i className="fas fa-film text-3xl text-white"></i>
              <div className="text-white">
                <h4 className="font-semibold text-lg">The Crown - Season 6</h4>
                <p className="text-white/80">Drama • 2024</p>
              </div>
            </div>
          </div>
          
          <div className="tv-card tv-focus bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-6" tabIndex={0}>
            <div className="flex items-center space-x-4">
              <i className="fas fa-music text-3xl text-white"></i>
              <div className="text-white">
                <h4 className="font-semibold text-lg">Lofi Hip Hop Playlist</h4>
                <p className="text-white/80">Chill • 2 hours</p>
              </div>
            </div>
          </div>
          
          <div className="tv-card tv-focus bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-6" tabIndex={0}>
            <div className="flex items-center space-x-4">
              <i className="fas fa-camera text-3xl text-white"></i>
              <div className="text-white">
                <h4 className="font-semibold text-lg">Holiday Photos 2023</h4>
                <p className="text-white/80">147 photos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="tv-focus text-muted-foreground hover:text-primary transition-colors duration-300" tabIndex={0}>
              <i className="fas fa-question-circle text-xl mr-2"></i>
              Help
            </button>
            <button className="tv-focus text-muted-foreground hover:text-primary transition-colors duration-300" tabIndex={0}>
              <i className="fas fa-info-circle text-xl mr-2"></i>
              About
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground">Smart TV Dashboard v2.0</p>
            <p className="text-muted-foreground/60 text-sm">Use arrow keys for navigation • Press Enter to select</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <i className="fas fa-wifi text-primary"></i>
              <span>Connected</span>
            </div>
            <div className="text-muted-foreground">
              {new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
