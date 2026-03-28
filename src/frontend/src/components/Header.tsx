import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const state = useRouterState();
  const currentPath = state.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-ocid="nav.link">
          <img
            src="/assets/generated/earth-cafe-logo-transparent.dim_300x100.png"
            alt="Earth Café"
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === link.to
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/book">
            <Button
              data-ocid="nav.primary_button"
              className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              Book a Table
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              data-ocid="nav.link"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === link.to
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/book" onClick={() => setOpen(false)}>
            <Button
              data-ocid="nav.primary_button"
              className="mt-2 w-full bg-primary text-primary-foreground"
              size="sm"
            >
              Book a Table
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
