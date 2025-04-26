
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl">
            Benjamin's Blog
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-foreground/80 transition-colors">
            Home
          </Link>
          <Link to="/admin" className="text-sm font-medium hover:text-foreground/80 transition-colors">
            Admin
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
            <nav className="flex flex-col p-6 space-y-4">
              <Link 
                to="/" 
                className="text-lg font-medium py-2" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/admin" 
                className="text-lg font-medium py-2" 
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="py-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
