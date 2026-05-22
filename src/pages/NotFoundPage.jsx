import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl font-bold text-gradient mb-4">404</div>
      <h1 className="text-2xl font-bold text-on-bg mb-2">Page not found</h1>
      <p className="text-muted mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 gradient-primary text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
      >
        <Home size={16} /> Back to home
      </Link>
    </div>
  );
}
