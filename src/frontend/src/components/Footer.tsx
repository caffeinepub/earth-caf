import { Link } from "@tanstack/react-router";
import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const mapsUrl =
    "https://maps.google.com/?q=Earth+Cafe+Waterfield+Road+Bandra+West+Mumbai";

  return (
    <footer className="bg-footer text-white">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <img
            src="/assets/generated/earth-cafe-logo-transparent.dim_300x100.png"
            alt="Earth Café"
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="text-sm text-white/70 leading-relaxed">
            Where Coffee Meets Comfort. A cozy corner in the heart of Bandra
            West.
          </p>
        </div>

        {/* Menu Links */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-white transition-colors">
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="hover:text-white transition-colors"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Location & Hours */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">Find Us</h4>
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-white/50" />
              <p>
                Durga Chambers, Waterfield Road, above Pernia's Pop Up MEN,
                Bandra West, Mumbai 400050
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-white/50" />
              <span>Mon–Sun: 10:00 AM – 11:00 PM</span>
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
          >
            Get Directions →
          </a>
        </div>

        {/* Contact & Social */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">Connect</h4>
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-white/50" />
              <span>+91 98XXX XXXXX</span>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <a
              href="https://wa.me/919800000000"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="WhatsApp"
            >
              <SiWhatsapp size={18} />
            </a>
            <a
              href="https://instagram.com/earthcafe_bandra"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-center text-xs text-white/50">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/70"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
