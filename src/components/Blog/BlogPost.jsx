import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Calendar, Tag, Clock as ClockIcon, ArrowRight } from 'lucide-react';
import { blogPosts } from './blog';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentPost = blogPosts.find(post => post.id === slug);

    if (!currentPost) {
      navigate('/blog');
      return;
    }

    setPost(currentPost);

    const related = blogPosts
      .filter(p => p.id !== slug && p.category === currentPost.category)
      .slice(0, 2);
    setRelatedPosts(related);
  }, [slug, navigate]);

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
      alert('Link copied to clipboard!');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={post.image}
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
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
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

            {/* Key Points Card */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {post.content.split('</h3>')[0].split('<li>').slice(1, 4).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 mt-1 mr-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-600">{item.replace('</li>', '').trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group rounded-2xl overflow-hidden h-52 bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="group rounded-2xl overflow-hidden h-52 bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  src="https://res.cloudinary.com/durbtkhbz/image/upload/v1765430247/usha_ban_fzzvty.png"
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-8 self-start">
            {/* Popular Tags */}
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 border border-gray-50 transition-all hover:shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Sewing', 'Maintenance', 'Tutorials', 'Beginners', 'Advanced', 'Accessories'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

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
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="w-full bg-[#c54513] hover:bg-[#a4370f] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author & Share */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center">
              <img
                className="h-12 w-12 rounded-full"
                src="https://res.cloudinary.com/durbtkhbz/image/upload/v1765430247/usha_ban_fzzvty.png"
                alt="Author"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Sewing Experts</p>
                <p className="text-sm text-gray-500">Sewing Machine Specialists</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Share:</span>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Share on social media"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

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
            <div className="grid gap-8 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group block"
                >
                  <article className="h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {relatedPost.category}
                        </span>
                        <span className="mx-2">•</span>
                        <time dateTime={relatedPost.date} className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {relatedPost.date}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#c54513] transition-colors mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-sm font-medium text-[#c54513]">
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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