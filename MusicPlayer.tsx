import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt: string;
  videoId?: string;
  lyrics?: string[];
}

interface YouTubeTrack {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

// Helper function to generate sample lyrics
const generateLyrics = (title: string): string[] => {
  const baseLyrics = [
    `🎵 ${title}`,
    "Music fills the air tonight",
    "Rhythm flows through every beat",
    "Melodies make life complete",
    "",
    "🎶 In this song we find our way",
    "Through the music we can say",
    "All the words we cannot speak",
    "In the harmony we seek",
    "",
    "🎵 Let the music set you free",
    "This is how it's meant to be",
    "Dancing to the sound of life",
    "Music cuts through joy and strife"
  ];
  return baseLyrics;
};

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Fetch trending music from YouTube
  const { data: youtubeData, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['/api/youtube/music'],
    refetchInterval: 3600000, // 1 hour
  });

  const tracks: Track[] = youtubeData?.items?.map((item: YouTubeTrack) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    album: "YouTube Music",
    duration: 240, // Default duration
    albumArt: item.snippet.thumbnails.medium.url,
    videoId: item.id.videoId,
    lyrics: generateLyrics(item.snippet.title),
  })) || [
    {
      id: "1",
      title: "Relaxing Evening Jazz",
      artist: "Smooth Jazz Collective", 
      album: "Evening Moods",
      duration: 323,
      albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      lyrics: generateLyrics("Relaxing Evening Jazz")
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        setProgress((newTime / currentTrack.duration) * 100);
        return newTime >= currentTrack.duration ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const previousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setCurrentTime(0);
    setProgress(0);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setCurrentTime(0);
    setProgress(0);
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  if (isLoadingTracks) {
    return (
      <div className="tv-card royal-gradient rounded-3xl p-8 tv-focus" tabIndex={0}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-20 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentTrack) return null;

  return (
    <div className="tv-card royal-gradient rounded-3xl p-8 tv-focus card-3d relative overflow-hidden" tabIndex={0}>
      {/* YouTube Music Player Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold flex items-center text-white">
          <i className="fab fa-youtube text-red-400 mr-3"></i>
          YouTube Music
        </h3>
        <div className="flex space-x-2">
          <button
            className="royal-button tv-focus rounded-full p-3 text-white"
            onClick={previousTrack}
            tabIndex={0}
          >
            <i className="fas fa-step-backward"></i>
          </button>
          <button
            className="royal-button tv-focus rounded-full p-4 text-white transform hover:scale-110"
            onClick={togglePlayback}
            tabIndex={0}
          >
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
          </button>
          <button
            className="royal-button tv-focus rounded-full p-3 text-white"
            onClick={nextTrack}
            tabIndex={0}
          >
            <i className="fas fa-step-forward"></i>
          </button>
          <button
            className="royal-button tv-focus rounded-full p-3 text-white"
            onClick={toggleLyrics}
            tabIndex={0}
          >
            <i className="fas fa-align-left"></i>
          </button>
        </div>
      </div>
      
      {!showLyrics ? (
        <>
          {/* Now Playing Info */}
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={currentTrack.albumArt}
              alt="Album artwork"
              className="w-24 h-24 rounded-xl object-cover shadow-lg"
            />
            
            <div className="flex-1 text-white">
              <h4 className="text-xl font-semibold mb-2">{currentTrack.title}</h4>
              <p className="text-white/80 text-lg">{currentTrack.artist}</p>
              <p className="text-white/60 text-sm">{currentTrack.album}</p>
              <div className="flex items-center mt-2 text-sm text-white/70">
                <i className="fas fa-music mr-2"></i>
                Track {currentTrackIndex + 1} of {tracks.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-white/80 text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Volume and Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-white/70">
              <i className="fas fa-volume-up"></i>
              <div className="w-20 bg-white/20 rounded-full h-2">
                <div className="bg-white w-3/4 h-2 rounded-full"></div>
              </div>
            </div>
            <div className="flex space-x-2 text-sm text-white/70">
              <button className="hover:text-white transition-colors">
                <i className="fas fa-random mr-1"></i>Shuffle
              </button>
              <button className="hover:text-white transition-colors">
                <i className="fas fa-redo mr-1"></i>Repeat
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Lyrics Display */
        <div className="glass-morphism rounded-xl p-6 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-white">Lyrics</h4>
            <button
              className="text-white/70 hover:text-white"
              onClick={toggleLyrics}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-2">
            {currentTrack.lyrics?.map((line, index) => (
              <div
                key={index}
                className={`text-white/90 transition-all duration-300 ${
                  line === "" ? "h-4" : "text-lg leading-relaxed hover:text-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}