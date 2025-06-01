const platforms = [
  { 
    name: "Netflix", 
    icon: "fab fa-netflix", 
    color: "from-red-600 to-red-800",
    url: "https://www.netflix.com",
    androidIntent: "intent://netflix.com/#Intent;scheme=https;package=com.netflix.mediaclient;end"
  },
  { 
    name: "Prime Video", 
    icon: "fab fa-amazon", 
    color: "from-blue-600 to-blue-800",
    url: "https://www.primevideo.com",
    androidIntent: "intent://www.primevideo.com/#Intent;scheme=https;package=com.amazon.avod.thirdpartyclient;end"
  },
  { 
    name: "Disney+ Hotstar", 
    icon: "fas fa-magic", 
    color: "from-blue-400 to-purple-600",
    url: "https://www.hotstar.com",
    androidIntent: "intent://www.hotstar.com/#Intent;scheme=https;package=in.startv.hotstar;end"
  },
  { 
    name: "SonyLIV", 
    icon: "fas fa-tv", 
    color: "from-green-600 to-blue-600",
    url: "https://www.sonyliv.com",
    androidIntent: "intent://www.sonyliv.com/#Intent;scheme=https;package=com.sony.liv;end"
  },
  { 
    name: "Zee5", 
    icon: "fas fa-film", 
    color: "from-purple-600 to-pink-600",
    url: "https://www.zee5.com",
    androidIntent: "intent://www.zee5.com/#Intent;scheme=https;package=com.graymatrix.did;end"
  },
  { 
    name: "JioCinema", 
    icon: "fas fa-video", 
    color: "from-blue-700 to-blue-900",
    url: "https://www.jiocinema.com",
    androidIntent: "intent://www.jiocinema.com/#Intent;scheme=https;package=com.jio.media.ondemand;end"
  }
];

export function OTTPlatforms() {
  const handlePlatformClick = (platform: typeof platforms[0]) => {
    // Try to open the Android app first, fallback to web
    try {
      // Check if we're on Android TV or mobile
      const isAndroid = /android/i.test(navigator.userAgent);
      
      if (isAndroid) {
        // Try to open the native app using Android Intent
        window.location.href = platform.androidIntent;
        
        // Fallback to web URL after a short delay
        setTimeout(() => {
          window.open(platform.url, '_blank');
        }, 2000);
      } else {
        // Open web version for other platforms
        window.open(platform.url, '_blank');
      }
    } catch (error) {
      console.error(`Failed to open ${platform.name}:`, error);
      // Final fallback to web URL
      window.open(platform.url, '_blank');
    }
  };

  return (
    <section className="mb-8">
      <h3 className="text-3xl font-bold mb-6 flex items-center">
        <i className="fas fa-play-circle text-primary mr-4"></i>
        Your Streaming Platforms
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {platforms.map((platform, index) => (
          <div
            key={platform.name}
            className={`tv-card ott-shimmer tv-focus bg-gradient-to-br ${platform.color} rounded-3xl p-6 text-center transition-all duration-300 hover:scale-110 cursor-pointer relative overflow-hidden card-3d`}
            tabIndex={0}
            onClick={() => handlePlatformClick(platform)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePlatformClick(platform);
              }
            }}
          >
            <i className={`${platform.icon} text-4xl mb-3 text-white drop-shadow-lg`}></i>
            <h4 className="font-semibold text-white text-lg drop-shadow-md">{platform.name}</h4>
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
              <i className="fas fa-external-link-alt text-2xl text-white"></i>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
