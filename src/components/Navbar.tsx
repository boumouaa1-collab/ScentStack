import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { products } from '@/data/products';

type NavbarProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

const navLinks = [
  { label: 'Home', page: 'home' },
  { label: 'Shop', page: 'shop' },
  { label: 'Blog', page: 'blog' },
  { label: 'About', page: 'about' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
  { label: 'Bundle', page: 'bundle' },
];

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#f7f1e8]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <button onClick={() => nav('home')} className="flex items-center gap-2" aria-label="Scent Stack home">
          <span className="font-serif-display text-2xl text-burgundy">Scent Stack</span>
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => nav(page)}
              className={`text-sm tracking-wide transition-colors ${
                currentPage === page ? 'text-burgundy' : 'text-charcoal/80 hover:text-burgundy'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => nav('home')}
            className="hidden items-center gap-2 rounded-full border border-[#b08d57]/40 px-5 py-2 text-xs uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-[#f7f1e8] sm:flex"
          >
            Shop The Collection
          </button>
          <button className="lg:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-[#b08d57]/20 bg-[#f7f1e8] lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map(({ label, page }) => (
              <button key={page} onClick={() => nav(page)} className="py-2 text-left text-sm tracking-wide text-charcoal">
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
