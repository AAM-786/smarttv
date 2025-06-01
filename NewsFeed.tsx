import { useState } from "react";
import { useNews } from "../hooks/useNews";

const categories = [
  { id: 'general', name: 'General' },
  { id: 'business', name: 'Business' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'technology', name: 'Technology' }
];

export function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { data: news, isLoading, error } = useNews(selectedCategory);

  const breakingNews = "🌟 Historic climate summit concludes with breakthrough agreements • 🏆 Local startup receives ₹100 crore funding • 🚀 ISRO announces new Mars mission timeline • 📱 Major tech company unveils revolutionary smartphone features";

  if (error) {
    return (
      <section className="mb-8">
        <h3 className="text-3xl font-bold mb-6 flex items-center">
          <i className="fas fa-newspaper text-primary mr-4"></i>
          Latest News
        </h3>
        <div className="tv-card bg-card rounded-3xl p-8 text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
          <h4 className="text-xl font-semibold mb-2">News Unavailable</h4>
          <p className="text-muted-foreground">Unable to fetch news at this time</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h3 className="text-3xl font-bold mb-6 flex items-center">
        <i className="fas fa-newspaper text-primary mr-4"></i>
        Latest News
      </h3>
      
      {/* News Categories */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`tv-focus px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            onClick={() => setSelectedCategory(category.id)}
            tabIndex={0}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div key={i} className="tv-card bg-card rounded-3xl overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-muted"></div>
              <div className="p-6">
                <div className="h-4 bg-muted rounded mb-3"></div>
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          ))
        ) : news && news.length > 0 ? (
          news.slice(0, 6).map((article) => (
            <article
              key={article.id}
              className="tv-card tv-focus bg-card rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer"
              tabIndex={0}
              onClick={() => window.open(article.url, '_blank')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.open(article.url, '_blank');
                }
              }}
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
                  }}
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xl font-semibold mb-3 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {article.description}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-newspaper text-4xl text-muted-foreground mb-4"></i>
            <p className="text-xl text-muted-foreground">No news available</p>
          </div>
        )}
      </div>
      
      {/* Breaking News Ticker */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center">
          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold mr-4 flex-shrink-0">
            BREAKING
          </span>
          <div className="overflow-hidden">
            <div className="news-ticker whitespace-nowrap text-lg font-medium">
              {breakingNews}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
