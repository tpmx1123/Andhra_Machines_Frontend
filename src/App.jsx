import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';

// Lazy load all components for better performance
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/AboutUs/about'));
const Contact = lazy(() => import('./components/Contact/contact'));
const Blog = lazy(() => import('./components/Blog/blog'));
const Brands = lazy(() => import('./components/Brands/brands'));
const BrandDetail = lazy(() => import('./components/Brands/BrandDetail'));
const Products = lazy(() => import('./components/Products/Products'));
const ProductDetail = lazy(() => import('./components/Products/ProductDetail'));
const BlogPost = lazy(() => import('./components/Blog/BlogPost'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const Profile = lazy(() => import('./components/Profile'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const Login = lazy(() => import('./components/Auth/Login'));
const Signup = lazy(() => import('./components/Auth/Signup'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CancellationReturns = lazy(() => import('./components/CancellationReturns'));
const Legal = lazy(() => import('./components/Legal'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600">Loading page...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>
              <Suspense fallback={<PageLoader />}>
              <Routes>
                  <Route path="/admin/*" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminPanel />
                    </Suspense>
                  } />
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
                    <Route path="legal" element={<Legal />} />
                </Route>
              </Routes>
              </Suspense>
            </ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
