import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, CheckCircle, Loader2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Booking } from "../backend";
import { useCreateBooking, useGetAvailableSlots } from "../hooks/useQueries";

export default function BookPage() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    guests: "2",
    date: "",
    timeSlot: "",
  });
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: slots = [], isLoading: slotsLoading } = useGetAvailableSlots(
    form.date,
  );
  const createBooking = useCreateBooking();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Valid email required";
    if (!form.date) e.date = "Please select a date";
    if (!form.timeSlot) e.timeSlot = "Please select a time slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const booking = await createBooking.mutateAsync({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        guests: Number(form.guests),
        date: form.date,
        timeSlot: form.timeSlot,
      });
      setConfirmed(booking);
    } catch (err) {
      console.error(err);
    }
  };

  if (confirmed) {
    return (
      <main
        className="max-w-lg mx-auto px-6 py-20 text-center"
        data-ocid="booking.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="mx-auto text-primary mb-4" size={56} />
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            You're Booked!
          </h2>
          <p className="text-muted-foreground mb-6">
            See you soon at Earth Café.
          </p>
          <div className="bg-card rounded-2xl p-6 shadow-card text-left space-y-3">
            <Row label="Name" value={confirmed.fullName} />
            <Row label="Date" value={confirmed.date} />
            <Row label="Time" value={confirmed.timeSlot} />
            <Row label="Guests" value={String(confirmed.guests)} />
            <Row label="Status" value={confirmed.status} />
          </div>
          <Button
            className="mt-6 bg-primary text-primary-foreground"
            onClick={() => {
              setConfirmed(null);
              setForm({
                fullName: "",
                phone: "",
                email: "",
                guests: "2",
                date: "",
                timeSlot: "",
              });
            }}
          >
            Make Another Booking
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
            Reserve Your Spot
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Book a Table
          </h1>
          <p className="text-muted-foreground mt-2">
            Mon–Sun, 10:00 AM – 11:00 PM
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="booking.modal"
            >
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  data-ocid="booking.input"
                  placeholder="Priya Sharma"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                />
                {errors.fullName && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  data-ocid="booking.input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
                {errors.phone && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  data-ocid="booking.input"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                {errors.email && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Guests</Label>
                  <Select
                    value={form.guests}
                    onValueChange={(v) => setForm((f) => ({ ...f, guests: v }))}
                  >
                    <SelectTrigger data-ocid="booking.select">
                      <Users size={15} className="mr-1" />
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="absolute left-3 top-2.5 text-muted-foreground"
                    />
                    <Input
                      id="date"
                      type="date"
                      data-ocid="booking.input"
                      min={today}
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          date: e.target.value,
                          timeSlot: "",
                        }))
                      }
                      className="pl-9"
                    />
                  </div>
                  {errors.date && (
                    <p
                      className="text-destructive text-xs"
                      data-ocid="booking.error_state"
                    >
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Time Slot</Label>
                <Select
                  value={form.timeSlot}
                  onValueChange={(v) => setForm((f) => ({ ...f, timeSlot: v }))}
                  disabled={!form.date || slotsLoading}
                >
                  <SelectTrigger data-ocid="booking.select">
                    <SelectValue
                      placeholder={
                        slotsLoading
                          ? "Loading slots..."
                          : form.date
                            ? "Select a time"
                            : "Choose a date first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {slots.length === 0 && !slotsLoading && form.date ? (
                      <SelectItem value="none" disabled>
                        No slots available
                      </SelectItem>
                    ) : (
                      slots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.timeSlot && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="booking.error_state"
                  >
                    {errors.timeSlot}
                  </p>
                )}
              </div>

              {createBooking.isError && (
                <div
                  className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm"
                  data-ocid="booking.error_state"
                >
                  Something went wrong. Please try again.
                </div>
              )}

              <Button
                type="submit"
                data-ocid="booking.submit_button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-serif text-xl font-bold mb-3">
                Reservation Info
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🕙 Open daily: 10:00 AM – 11:00 PM</li>
                <li>📍 Durga Chambers, Waterfield Road, Bandra West</li>
                <li>✅ Instant booking confirmation</li>
                <li>👥 Groups up to 10 guests welcome</li>
                <li>⚠️ Walk-ins subject to availability</li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden h-48">
              <img
                src="/assets/generated/hero-cafe-interior.dim_1200x600.jpg"
                alt="Café interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
