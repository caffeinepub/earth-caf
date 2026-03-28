import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Coffee, Heart, Star, Users } from "lucide-react";
import { motion } from "motion/react";

const VALUES = [
  {
    icon: Coffee,
    title: "Quality First",
    desc: "Every bean is carefully sourced. Every cup, handcrafted with precision and passion.",
  },
  {
    icon: Heart,
    title: "Warm Hospitality",
    desc: "Our team treats every guest like family. You're always home at Earth Café.",
  },
  {
    icon: Users,
    title: "Community Roots",
    desc: "We grew up in Bandra, and Bandra shaped us. We exist to give back to this neighbourhood.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <img
          src="/assets/generated/hero-cafe-interior.dim_1200x600.jpg"
          alt="Earth Café Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white px-4"
          >
            <p className="text-sm uppercase tracking-widest text-white/70 mb-2">
              Our Story
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              About Earth Café
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">
            Where It All Began
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Earth Café @ Waterfield opened with a single, earnest ambition: to
              craft an honest cup of coffee in a space that feels like an
              extension of your living room. Perched above Pernia's Pop Up on
              Waterfield Road in Bandra West, we carved out a warm, light-filled
              corner in one of Mumbai's most vibrant neighbourhoods.
            </p>
            <p>
              What started as a passion project quickly became a community
              institution. Regulars arrive before we've even flipped the sign —
              for their cold brew, a slice of banana bread, or just a quiet hour
              with a book. We've witnessed first dates, remote work sprints,
              birthday celebrations, and late-night conversations fuelled by our
              Earth Special Latte.
            </p>
            <p>
              With a 4.6 ★ rating and over 3,530 Google reviews, we don't take
              our community's trust lightly. Every review is a reminder of why
              we do what we do — and why we'll never stop caring about every
              single cup.
            </p>
          </div>
        </motion.section>

        {/* Vision & Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14"
        >
          <div className="bg-card rounded-2xl p-7 shadow-card">
            <p className="text-secondary text-xs uppercase tracking-widest mb-2">
              Our Vision
            </p>
            <h3 className="font-serif text-xl font-bold mb-3">
              A space where every cup tells a story
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We envision Earth Café as a cultural landmark — not just a café,
              but a canvas for human connection, creative thought, and the
              simple pleasure of a well-made drink.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-7 shadow-card">
            <p className="text-secondary text-xs uppercase tracking-widest mb-2">
              Our Mission
            </p>
            <h3 className="font-serif text-xl font-bold mb-3">
              Quality coffee, warm hospitality, community
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To source the finest beans, train our team to deliver genuine
              warmth, and nurture a space that feels welcoming to absolutely
              everyone who walks through our door.
            </p>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-6 shadow-card text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-primary" />
                </div>
                <h4 className="font-serif font-bold text-lg mb-2">{title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Rating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-footer rounded-2xl p-8 text-white text-center mb-14"
        >
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={String(i)}
                size={22}
                fill={i < 4 ? "currentColor" : "none"}
                className="text-yellow-300"
              />
            ))}
          </div>
          <p className="text-3xl font-serif font-bold mb-1">4.6 / 5</p>
          <p className="text-white/70 text-sm">
            Based on 3,530+ Google reviews
          </p>
        </motion.div>

        <div className="text-center">
          <Link to="/book">
            <Button
              data-ocid="about.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Visit Us Today
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
