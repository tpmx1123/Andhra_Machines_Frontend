import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import About from './components/AboutUs/about';
import Contact from './components/Contact/contact';
import Blog from './components/Blog/blog';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import BlogPost from './components/Blog/BlogPost';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:brandId" element={<BrandDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/categories/:category" element={<Products />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
