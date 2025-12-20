import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
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
import Checkout from './components/Checkout';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminPanel from './components/Admin/AdminPanel';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CancellationReturns from './components/CancellationReturns';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>
              <Routes>
                <Route path="/admin/*" element={<AdminPanel />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="brands/:brandId" element={<BrandDetail />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:productId" element={<ProductDetail />} />
                  <Route path="categories/:category" element={<Products />} />
                  <Route path="search" element={<SearchResults />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms-of-service" element={<TermsOfService />} />
                  <Route path="cancellation-returns" element={<CancellationReturns />} />
                </Route>
              </Routes>
            </ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
