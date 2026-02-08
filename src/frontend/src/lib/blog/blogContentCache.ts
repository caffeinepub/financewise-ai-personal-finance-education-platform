// Local storage cache for generated blog content

interface CachedBlogContent {
  htmlContent: string;
  excerpt: string;
  wordCount: number;
  generatedAt: number;
}

const CACHE_KEY_PREFIX = 'blog_content_';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Get cache key for a blog post
function getCacheKey(slug: string): string {
  return `${CACHE_KEY_PREFIX}${slug}`;
}

// Load cached content
export function loadCachedContent(slug: string): CachedBlogContent | null {
  try {
    const key = getCacheKey(slug);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const cached = JSON.parse(stored) as CachedBlogContent;
    
    // Check if cache is expired
    const age = Date.now() - cached.generatedAt;
    if (age > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cached;
  } catch (error) {
    console.error('Failed to load cached blog content:', error);
    return null;
  }
}

// Save content to cache
export function saveCachedContent(slug: string, content: CachedBlogContent): void {
  try {
    const key = getCacheKey(slug);
    content.generatedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(content));
  } catch (error) {
    console.error('Failed to save blog content to cache:', error);
  }
}

// Clear cache for a specific post
export function clearCachedContent(slug: string): void {
  try {
    const key = getCacheKey(slug);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear cached blog content:', error);
  }
}

// Clear all blog content cache
export function clearAllBlogCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all blog cache:', error);
  }
}
