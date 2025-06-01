import { useQuery } from "@tanstack/react-query";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  category: string;
}

export function useNews(category: string = 'general') {
  return useQuery<NewsArticle[]>({
    queryKey: [`/api/news?category=${category}`],
    refetchInterval: 300000, // 5 minutes
  });
}
