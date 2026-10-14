import { getBlogPost } from '@/data/blog';
import BlogPostPage from '@/pages/BlogPostPage';
import ErrorPage from '@/pages/ErrorPage';

// Loaded on demand, so the blog text is not part of the first page's JavaScript.
export default function BlogPostRoute({ slug, onNavigate }: { slug: string; onNavigate: (page: string) => void }) {
  const post = getBlogPost(slug);
  return post ? <BlogPostPage post={post} onNavigate={onNavigate} /> : <ErrorPage status="404" onNavigate={onNavigate} />;
}
