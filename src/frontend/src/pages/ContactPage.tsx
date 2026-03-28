import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Loader2, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiInstagram, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  const mapsUrl =
    "https://maps.google.com/?q=Earth+Cafe+Waterfield+Road+Bandra+West+Mumbai";

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
            Say Hello
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Contact Us
          </h1>
          <p className="text-muted-foreground mt-2">
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            {sent ? (
              <div
                className="text-center py-8"
                data-ocid="contact.success_state"
              >
                <CheckCircle className="mx-auto text-primary mb-4" size={48} />
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Message Received!
                </h3>
                <p className="text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
                <Button
                  className="mt-4 bg-primary text-primary-foreground"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    data-ocid="contact.input"
                    placeholder="Priya Sharma"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="contact.input"
                    placeholder="hello@example.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    data-ocid="contact.textarea"
                    placeholder="Write your message here..."
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Info cards */}
          <div className="space-y-5">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-serif text-xl font-bold mb-4">Visit Us</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Earth Café @ Waterfield
                    </p>
                    <p>
                      Durga Chambers, Waterfield Road, above Pernia's Pop Up
                      MEN, Bandra West, Mumbai 400050
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Hours</p>
                    <p>Mon–Sun: 10:00 AM – 11:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star size={18} className="shrink-0 text-secondary" />
                  <div>
                    <p className="font-medium text-foreground">Rating</p>
                    <p>4.6 ★ — 3,530+ Google Reviews</p>
                  </div>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.primary_button"
                className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <MapPin size={15} /> Get Directions
              </a>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-serif text-xl font-bold mb-4">
                Connect on Social
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/919800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.secondary_button"
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <SiWhatsapp size={18} /> WhatsApp
                </a>
                <a
                  href="https://instagram.com/earthcafe_bandra"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.secondary_button"
                  className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <SiInstagram size={18} /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
