import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Calendar, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const data = await api.getBlogBySlug(slug);
        setPost(data);

        // Fetch all blogs to find related ones
        const allBlogs = await api.getAllBlogs();
        const related = allBlogs
          .filter(p => p.slug !== slug && p.category === data.category)
          .slice(0, 2);
        setRelatedPosts(related);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Blog post not found');
        showToast('Blog post not found', 'error');
        setTimeout(() => navigate('/blog'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      await api.subscribeToNewsletter(email);
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      showToast(err.message || 'Failed to subscribe', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <p className="text-xl text-gray-600 mb-4">{error || 'Post not found'}</p>
        <p className="text-gray-500">Redirecting to blog page...</p>
        <Link to="/blog" className="mt-6 text-[#c54513] hover:underline">
          Go to Blog now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={post.imageUrl || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg'}
            alt={post.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-30'}`}
            onLoad={handleImageLoad}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg';
            }}
          />
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#c54513] text-white mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-300 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center hover:text-white transition-colors"
                aria-label="Share this post"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Introduction Card */}
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-8 border border-gray-50 transition-all hover:shadow-lg">
              <div className="prose max-w-none">
                <div
                  className="prose-p:leading-relaxed prose-p:text-gray-700 prose-p:text-lg prose-p:mb-6
                           prose-headings:font-bold prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:font-extrabold
                           prose-h2:mt-8 prose-h2:mb-6 prose-h2:leading-tight prose-h2:bg-gradient-to-r 
                           prose-h2:bg-clip-text prose-h2:text-transparent prose-h2:from-[#c54513] prose-h2:to-[#e67e51]
                           prose-ul:list-disc prose-ul:pl-6 prose-li:mb-3 prose-li:leading-relaxed
                           prose-strong:text-gray-900 prose-strong:font-semibold
                           prose-a:text-[#c54513] prose-a:font-medium hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

           
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-8 self-start">
            {/* Subscribe Card */}
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-500 mb-4">Get the latest articles and tips delivered to your inbox</p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#c54513] hover:bg-[#a4370f] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Author & Share */}
       

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link
                to="/blog"
                className="inline-flex items-center text-sm font-medium text-[#c54513] hover:text-[#a4370f] transition-colors"
              >
                View all articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <article className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative h-56 bg-gray-50 overflow-hidden block">
                      <img
                        src={relatedPost.imageUrl || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg'}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                    </div>
                    <div className="flex-1 p-3 sm:p-4 flex flex-col">
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c54513]/10 text-[#c54513]">
                          {relatedPost.category}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors line-clamp-2 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <time dateTime={relatedPost.createdAt} className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(relatedPost.createdAt)}
                          </time>
                          <div className="inline-flex items-center text-xs sm:text-sm font-medium text-[#c54513] hover:text-[#a43a10] transition-colors">
                            Read more
                            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back to Blog */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#c54513] transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
