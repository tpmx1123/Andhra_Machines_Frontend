import { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import LoadingSpinner from './LoadingSpinner';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ScrollToTop />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="xl" />
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

