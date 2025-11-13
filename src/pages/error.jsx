import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

export default function ErrorPage() {
  useEffect(() => {
    document.title = 'Worther - Error';
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <main className="flex grow items-center justify-center">
        <div className="max-w-lg p-6 text-center">
          <h1 className="mb-4 text-6xl font-bold text-red-500 md:text-7xl">404</h1>
          <p className="mb-8 text-2xl">Page not found</p>
          <p className="mb-8 text-gray-300">
            Sorry, we couldn't find the page you're looking for. It might have been moved or
            deleted.
          </p>
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
