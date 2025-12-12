import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import About from './components/AboutUs/about';
import Contact from './components/Contact/contact';
import Blog from './components/Blog/blog';
import Brands from './components/Brands/Brands';
import BrandDetail from './components/Brands/BrandDetail';
import Products from './components/Products/Products';
import ProductDetail from './components/Products/ProductDetail';
import BlogPost from './components/Blog/BlogPost';
import SearchResults from './components/SearchResults';
import Profile from './components/Profile';
import Cart from './components/Cart';

function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
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
                <Route path="/search" element={<SearchResults />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
