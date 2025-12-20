import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogs = await api.getAllBlogs();
      setBlogPosts(blogs);
      
      // The latest blog is the first one in the list (already sorted by newest in backend)
      setFeaturedPost(blogs[0]);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchBlogs}
            className="px-6 py-2 bg-[#c54513] text-white rounded-full hover:bg-[#a4370f] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 sm:py-10 md:py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#1a365d]">
            Our <span className="text-[#c54513]">Blogs</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-2 sm:mt-3 px-2">
            Discover expert tips and insights to help you choose, use, and maintain sewing machines effectively.
          </p>
        </div>
        
        {/* Featured Blog Post */}
        {featuredPost && (
          <div className="max-w-5xl mx-auto">
          <Link to={`/blog/${featuredPost.slug}`} className="block group">
            <article className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden mb-8 sm:mb-12 md:mb-16 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:flex-shrink-0 md:w-1/2 relative">
                  <div className="h-48 md:h-64">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      src={featuredPost.imageUrl || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg'}
                      alt={featuredPost.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent"></div>
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6 bg-white flex flex-col h-full">
                  <div className="mb-2 sm:mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#c54513]/10 text-[#c54513]">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-1 sm:mb-2 group-hover:text-[#c54513] transition-colors">
                    {featuredPost.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <time dateTime={featuredPost.createdAt}>{formatDate(featuredPost.createdAt)}</time>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-base font-medium text-[#c54513] group-hover:text-[#a4370f] group-hover:underline">
                      Read full story
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
          </div>
        )}

        {blogPosts.length > 0 ? (
          <>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Latest Articles
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Explore our collection of helpful guides, tutorials, and sewing tips
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-1 sm:px-0">
              {blogPosts.filter(p => !featuredPost || p.id !== featuredPost.id).map((post, index) => (
                <article
                  key={post.id || index}
                  className="group bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  <div className="p-4 sm:p-5 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 leading-tight group-hover:text-[#c54513] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 whitespace-nowrap">{formatDate(post.createdAt)}</p>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center text-xs sm:text-sm font-medium text-[#c54513] hover:text-[#a4370f] group whitespace-nowrap"
                        >
                          Read more
                          <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts found.</p>
          </div>
        )}

        {/* Newsletter Subscription Section */}
        <section className="bg-gradient-to-r from-[#f9f9f9] to-[#f0f0f0] rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 mt-12 sm:mt-16 mx-2 sm:mx-0 transition-all duration-300">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#c54513] bg-opacity-10 mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#c54513]">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Subscribe to our newsletter for the latest sewing tips, tutorials, and exclusive offers.
              Join our community of sewing enthusiasts today!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto px-2 sm:px-0">
              <div className="flex-grow">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c54513] focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 sm:px-6 py-2 sm:py-3 bg-[#c54513] text-white font-medium rounded-lg hover:bg-[#a4370f] transition-colors whitespace-nowrap text-sm sm:text-base disabled:opacity-50"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3 sm:mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Blog;

