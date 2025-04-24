
import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-6 md:py-0">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:h-16">
        <div className="text-sm text-muted-foreground">
          © {year} Aurora Blog. All rights reserved.
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
