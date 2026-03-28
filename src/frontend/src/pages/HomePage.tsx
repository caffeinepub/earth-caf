import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import MenuItemCard from "../components/MenuItemCard";
import { useListMenuItems } from "../hooks/useQueries";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    text: "Earth Café is my Sunday ritual. The cold brew is absolutely divine and the vibes are immaculate. You can just sit for hours!",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    text: "Best café in Bandra, hands down. The avocado toast and the Earth Special Latte are a match made in heaven.",
    rating: 5,
  },
  {
    name: "Sneha Iyer",
    text: "Absolutely love the wooden interiors and the warm atmosphere. The staff is super friendly and the food is consistently great.",
    rating: 5,
  },
  {
    name: "Rohan Kapoor",
    text: "Had the acai bowl and a cappuccino — the quality is top notch. Reasonably priced for Bandra. Will definitely be back.",
    rating: 4,
  },
  {
    name: "Meera Nair",
    text: "The mango smoothie is a must-try! Cozy spot for working remotely. Good WiFi and great coffee = perfect combo.",
    rating: 5,
  },
];

const GALLERY_IMAGES = [
  "/assets/generated/hero-cafe-interior.dim_1200x600.jpg",
  "/assets/generated/menu-coffee.dim_400x300.jpg",
  "/assets/generated/menu-cold-beverage.dim_400x300.jpg",
  "/assets/generated/menu-dessert.dim_400x300.jpg",
  "/assets/generated/menu-snack.dim_400x300.jpg",
  "/assets/generated/menu-coffee.dim_400x300.jpg",
];

export default function HomePage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { data: menuItems = [] } = useListMenuItems();

  const SEED_ITEMS = [
    {
      name: "Cappuccino",
      description:
        "Rich espresso with perfectly steamed milk foam and a dusting of cocoa.",
      price: "₹220",
      category: "Coffee",
      blobId: "",
      available: true,
    },
    {
      name: "Acai Bowl",
      description:
        "Thick acai blend topped with granola, seasonal fruits and honey drizzle.",
      price: "₹320",
      category: "Desserts",
      blobId: "",
      available: true,
    },
    {
      name: "Earth Special Latte",
      description:
        "Our signature brown butter latte with oat milk and a touch of vanilla.",
      price: "₹300",
      category: "Specials",
      blobId: "",
      available: true,
    },
  ];

  const displayItems =
    menuItems.length > 0 ? menuItems.slice(0, 3) : SEED_ITEMS;

  const prev = () =>
    setTestimonialIdx((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  const next = () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <main>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-soft h-[460px]"
        >
          <img
            src="/assets/generated/hero-cafe-interior.dim_1200x600.jpg"
            alt="Earth Café Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-white font-serif text-4xl md:text-5xl font-bold leading-tight mb-3"
            >
              Where Coffee Meets Comfort
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-white/80 text-base mb-6"
            >
              Sip. Relax. Repeat. — Bandra West's favourite neighbourhood café.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/menu">
                <Button
                  data-ocid="hero.primary_button"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  View Menu
                </Button>
              </Link>
              <Link to="/book">
                <Button
                  data-ocid="hero.secondary_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Book a Table
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Menu Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-1">
                Taste the Difference
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Menu Highlights
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-sm text-primary hover:underline font-medium"
            >
              See Full Menu →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About + Gallery Row */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* About Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-8 shadow-card"
          >
            <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
              Our Story
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Born in Bandra, Brewed with Love
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Earth Café @ Waterfield opened its doors with one simple dream —
              to create a space where great coffee meets genuine warmth. Nestled
              above Pernia's Pop Up on Waterfield Road, we've become a beloved
              landmark in Bandra West's vibrant café culture.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With 4.6 stars across 3,500+ Google reviews, our community speaks
              for itself. Every cup, every plate, every conversation matters to
              us.
            </p>
            <Link to="/about">
              <Button
                data-ocid="about.secondary_button"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Read Our Story
              </Button>
            </Link>
          </motion.div>

          {/* Gallery Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
              Moments
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Gallery
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {GALLERY_IMAGES.map((src) => (
                <div
                  key={src}
                  className="rounded-xl overflow-hidden aspect-square"
                >
                  <img
                    src={src}
                    alt="Café moment"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/gallery">
                <Button
                  data-ocid="gallery.secondary_button"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View All Photos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
              What People Say
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Customer Love
            </h2>
          </motion.div>
          <div className="max-w-2xl mx-auto relative">
            <div className="bg-card rounded-2xl p-8 shadow-card text-center">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({
                  length: TESTIMONIALS[testimonialIdx].rating,
                }).map((_, i) => (
                  <Star
                    key={String(i)}
                    size={18}
                    fill="currentColor"
                    className="text-secondary"
                  />
                ))}
              </div>
              <p className="text-foreground text-base leading-relaxed italic mb-4">
                "{TESTIMONIALS[testimonialIdx].text}"
              </p>
              <p className="font-semibold text-foreground">
                {TESTIMONIALS[testimonialIdx].name}
              </p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={prev}
                data-ocid="testimonials.pagination_prev"
                className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    type="button"
                    key={TESTIMONIALS[i].name}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === testimonialIdx ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                data-ocid="testimonials.pagination_next"
                className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-footer rounded-2xl p-10 text-center text-white"
        >
          <h2 className="font-serif text-3xl font-bold mb-3">
            Ready for Your Next Coffee Date?
          </h2>
          <p className="text-white/70 mb-6">
            Reserve your spot at Earth Café — Mon–Sun, 10:00 AM to 11:00 PM.
          </p>
          <Link to="/book">
            <Button
              data-ocid="cta.primary_button"
              className="bg-white text-footer-DEFAULT hover:bg-white/90"
              style={{ color: "oklch(0.60 0.058 148)" }}
              size="lg"
            >
              Book a Table Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
