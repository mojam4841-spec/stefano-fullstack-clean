import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Crown } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-stefano-gold/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Name */}
          <div className="flex items-center">
            <div className="text-3xl font-montserrat font-bold">
              <span className="stefano-gold">STEF</span>
              <span className="text-white">ANO</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-8 font-montserrat font-medium">
            <li>
              <button 
                onClick={() => scrollToSection('o-nas')} 
                className="hover:text-stefano-gold transition-colors"
              >
                O nas
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('menu')} 
                className="hover:text-stefano-gold transition-colors"
              >
                Menu
              </button>
            </li>
            <li>
              <Button 
                onClick={() => scrollToSection('zamow')} 
                className="bg-stefano-red hover:bg-red-600 transition-colors"
              >
                Zamów online
              </Button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('sklep')} 
                className="hover:text-stefano-gold transition-colors"
              >
                Sklep sosów
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('gry')} 
                className="hover:text-stefano-gold transition-colors"
              >
                Gry planszowe
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('imprezy')} 
                className="hover:text-stefano-gold transition-colors"
              >
                Imprezy rodzinne
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('firmy')} 
                className="hover:text-stefano-gold transition-colors"
              >
                Obsługa firm
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('kontakt')} 
                className="hover:text-stefano-gold transition-colors"
              >
                Kontakt
              </button>
            </li>
            <li>
              <a 
                href="/loyalty" 
                className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all"
              >
                <Crown className="w-4 h-4" />
                Program lojalnościowy
              </a>
            </li>
            <li>
              <a 
                href="/admin" 
                className="text-xs opacity-50 hover:text-stefano-gold transition-colors"
              >
                Admin
              </a>
            </li>
          </ul>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            data-testid="mobile-menu-btn"
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <ul className="space-y-3 font-montserrat">
              <li>
                <button 
                  onClick={() => scrollToSection('o-nas')} 
                  className="block hover:text-stefano-gold"
                >
                  O nas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('menu')} 
                  className="block hover:text-stefano-gold"
                >
                  Menu
                </button>
              </li>
              <li>
                <Button 
                  onClick={() => scrollToSection('zamow')} 
                  className="w-full bg-stefano-red hover:bg-red-600"
                >
                  Zamów online
                </Button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gry')} 
                  className="block hover:text-stefano-gold"
                >
                  Gry planszowe
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('imprezy')} 
                  className="block hover:text-stefano-gold"
                >
                  Imprezy rodzinne
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('firmy')} 
                  className="block hover:text-stefano-gold"
                >
                  Obsługa firm
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('kontakt')} 
                  className="block hover:text-stefano-gold"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
