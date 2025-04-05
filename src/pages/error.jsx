import { Header } from "../components/utils/header";
import { Footer } from "../components/utils/footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ErrorPage() {
  useEffect(() => {
    document.title = "Worther - Error";
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header />
      <main className="flex justify-center items-center grow">
        <div className="text-center p-6 max-w-lg">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-red-500">404</h1>
          <p className="text-2xl mb-8">Page not found</p>
          <p className="mb-8 text-gray-300">Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
