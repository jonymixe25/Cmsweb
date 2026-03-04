import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Menu, X } from "lucide-react";

export function Layout() {
  const [settings, setSettings] = useState<any>({});
  const [pages, setPages] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        // Apply colors to CSS variables
        document.documentElement.style.setProperty(
          "--primary-color",
          data.primaryColor || "#3b82f6",
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          data.secondaryColor || "#1d4ed8",
        );
      });

    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => setPages(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
      <header
        className="text-white shadow-md"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tight">
                {settings.siteName || "Mi CMS"}
              </Link>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-white/80 transition-colors">
                Inicio
              </Link>
              <Link
                to="/noticias"
                className="hover:text-white/80 transition-colors"
              >
                Noticias
              </Link>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  to={`/p/${page.slug}`}
                  className="hover:text-white/80 transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </nav>

            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-4">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80"
                >
                  <Twitter size={20} />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80"
                >
                  <Instagram size={20} />
                </a>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-white/80"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/noticias"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Noticias
              </Link>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  to={`/p/${page.slug}`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer
        className="text-white py-8 mt-12"
        style={{ backgroundColor: "var(--secondary-color)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} {settings.siteName}. Todos los
            derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80"
              >
                <Facebook size={20} />
              </a>
            )}
            {settings.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80"
              >
                <Twitter size={20} />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80"
              >
                <Instagram size={20} />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
