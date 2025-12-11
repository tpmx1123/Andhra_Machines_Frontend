import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

// Export blogPosts and featuredPost so they can be imported by BlogPost component
export const blogPosts = [
  {
    id: 'modern-sewing-machines',
    title: 'The Ultimate Guide to Modern Sewing Machines',
    excerpt: ' Discover everything you need to know about modern sewing machines, from basic features to advanced functionalities.',
    content: `
      <h2>Introduction to Modern Sewing Machines</h2>
      <p>Modern sewing machines have evolved significantly, offering a wide range of features that make sewing easier and more efficient than ever before. Whether you're a beginner or an experienced seamstress, understanding these features can help you choose the perfect machine for your needs.</p>
      <h3>Key Features to Look For</h3>
      <ul>
        <li>Automatic needle threader</li>
        <li>Built-in stitches (decorative, utility, and stretch)</li>
        <li>Adjustable stitch length and width</li>
        <li>Buttonhole capabilities</li>
        <li>Free arm for cuffs and sleeves</li>
      </ul>
      <p>With these features, modern sewing machines can handle everything from basic mending to complex quilting projects with ease.</p>
    `,
    image: 'https://www.ushasew.com/wp-content/uploads/2018/09/MainProjectPg-ZigZag.png',
    category: 'Sewing Machines',
    date: 'May 15, 2023',
    readTime: '5 min read'
  },
  {
    id: 'sewing-machine-maintenance',
    title: 'Essential Sewing Machine Maintenance Tips',
    excerpt: 'Learn how to properly maintain your sewing machine to ensure it lasts for years to come.',
    content: `
      <h2>Regular Maintenance is Key</h2>
      <p>Proper maintenance can significantly extend the life of your sewing machine and ensure optimal performance. Follow these essential tips to keep your machine in top condition.</p>
      <h3>Daily Maintenance</h3>
      <ul>
        <li>Clean lint and dust after each use</li>
        <li>Change needles regularly (every 8-10 hours of sewing)</li>
        <li>Use high-quality thread to reduce lint buildup</li>
      </ul>
      <h3>Monthly Maintenance</h3>
      <p>Oil your machine according to the manufacturer's instructions and have it professionally serviced annually.</p>
    `,
    image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
    category: 'Maintenance',
    date: 'April 28, 2023',
    readTime: '4 min read'
  },
  {
    id: 'choosing-right-sewing-machine',
    title: 'How to Choose the Right Sewing Machine for Beginners',
    excerpt: 'A comprehensive guide to selecting your first sewing machine based on your needs and budget.',
    content: `
      <h2>Finding Your Perfect Match</h2>
      <p>Choosing your first sewing machine can be overwhelming with so many options available. Here's what to consider:</p>
      <h3>Key Considerations</h3>
      <ul>
        <li>Your sewing goals (garment making, quilting, repairs)</li>
        <li>Available features vs. your skill level</li>
        <li>Budget constraints</li>
        <li>Brand reputation and warranty</li>
      </ul>
      <p>Remember, the most expensive machine isn't always the best choice for beginners.</p>
    `,
    image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
    category: 'Buying Guide',
    date: 'April 10, 2023',
    readTime: '6 min read'
  },
  {
    id: 'sewing-machine-troubleshooting',
    title: 'Common Sewing Machine Problems and How to Fix Them',
    excerpt: 'Quick solutions to the most common sewing machine issues you might encounter.',
    content: `
      <h2>Troubleshooting Common Issues</h2>
      <p>Even the best sewing machines can have issues. Here are some common problems and their solutions:</p>
      <h3>Thread Bunching</h3>
      <p>This is often caused by incorrect threading. Rethread both the top thread and bobbin, ensuring the presser foot is up when threading.</p>
      <h3>Skipped Stitches</h3>
      <p>Usually indicates a dull or bent needle. Replace the needle and ensure it's inserted correctly.</p>
      <h3>Machine Jamming</h3>
      <p>Remove the bobbin case and clear any tangled threads. Check for lint buildup in the bobbin area.</p>
    `,
    image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
    category: 'Troubleshooting',
    date: 'March 22, 2023',
    readTime: '7 min read'
  },
  {
    id: 'sewing-machine-accessories',
    title: 'Must-Have Sewing Machine Accessories',
    excerpt: 'Enhance your sewing experience with these essential accessories for your sewing machine.',
    content: `
      <h2>Essential Accessories</h2>
      <p>Upgrade your sewing experience with these must-have accessories:</p>
      <h3>Basic Essentials</h3>
      <ul>
        <li>Extra bobbins (compatible with your machine)</li>
        <li>Seam ripper for quick fixes</li>
        <li>Fabric scissors and thread snips</li>
        <li>Measuring tape and ruler</li>
      </ul>
      <h3>Advanced Add-ons</h3>
      <p>Consider adding a walking foot, quilting guide, or extension table for more specialized projects.</p>
    `,
    image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
    category: 'Accessories',
    date: 'March 15, 2023',
    readTime: '5 min read'
  },
  {
    id: 'sewing-machine-stitches',
    title: 'Understanding Different Types of Sewing Machine Stitches',
    excerpt: 'A guide to the various stitches available on modern sewing machines and when to use them.',
    content: `
      <h2>Stitch Dictionary</h2>
      <p>Modern machines offer dozens of stitches, but do you know when to use each one? Here's a quick guide:</p>
      <h3>Basic Stitches</h3>
      <ul>
        <li><strong>Straight Stitch:</strong> The most basic stitch, used for most sewing</li>
        <li><strong>Zigzag Stitch:</strong> Great for finishing edges and sewing stretch fabrics</li>
        <li><strong>Buttonhole Stitch:</strong> Automatically creates perfect buttonholes</li>
      </ul>
      <h3>Decorative Stitches</h3>
      <p>These add beautiful details to your projects, from scallops to intricate patterns.</p>
    `,
    image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
    category: 'Techniques',
    date: 'March 5, 2023',
    readTime: '6 min read'
  }
];

export const featuredPost = {
  id: 'modern-sewing-machines',
  title: 'The Ultimate Guide to Modern Sewing Machines',
  excerpt: 'Discover everything you need to know about modern sewing machines, from basic features to advanced functionalities.',
  content: `
    <h2>Introduction to Modern Sewing Machines</h2>
    <p>Modern sewing machines have evolved significantly, offering a wide range of features that make sewing easier and more efficient than ever before. Whether you're a beginner or an experienced seamstress, understanding these features can help you choose the perfect machine for your needs.</p>
    <h3>Key Features to Look For</h3>
    <ul>
      <li>Automatic needle threader</li>
      <li>Built-in stitches (decorative, utility, and stretch)</li>
      <li>Adjustable stitch length and width</li>
      <li>Buttonhole capabilities</li>
      <li>Free arm for cuffs and sleeves</li>
    </ul>
    <p>With these features, modern sewing machines can handle everything from basic mending to complex quilting projects with ease.</p>
  `,
  image: 'https://www.ushasew.com/wp-content/uploads/2018/09/MainProjectPg-ZigZag.png',
  category: 'Sewing Machines',
  date: 'May 15, 2023',
  readTime: '5 min read'
};

const Blog = () => {
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
        <div className="max-w-5xl mx-auto">
        <Link to={`/blog/${featuredPost.id}`} className="block group">
          <article className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden mb-8 sm:mb-12 md:mb-16 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:flex-shrink-0 md:w-1/2 relative">
                <div className="h-48 md:h-64">
                  <img
                    className="w-[500px] h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src={featuredPost.image}
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
                <div className="space-y-1.5 mb-3 sm:mb-4">
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 w-4 h-4 mt-1 text-[#c54513] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Automatic needle threading for convenience</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 w-4 h-4 mt-1 text-[#c54513] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Multiple built-in stitch patterns</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 w-4 h-4 mt-1 text-[#c54513] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">Perfect for all skill levels</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <time dateTime={featuredPost.date}>{featuredPost.date}</time>
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

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Explore our collection of helpful guides, tutorials, and sewing tips
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-1 sm:px-0">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="group bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img
                  src={post.image}
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
                    <p className="text-xs text-gray-500 whitespace-nowrap">{post.date}</p>
                    <Link
                      to={`/blog/${post.id}`}
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

        <div className="mt-12 sm:mt-16 text-center">
          <div className="space-x-4">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#c54513] hover:bg-[#a4370f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-colors duration-200"
            >
              View All Articles
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </a>
          </div>
        </div>

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
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto px-2 sm:px-0">
              <div className="flex-grow">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c54513] focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="px-5 sm:px-6 py-2 sm:py-3 bg-[#c54513] text-white font-medium rounded-lg hover:bg-[#a4370f] transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                Subscribe
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