import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  KeyRound,
  Loader2,
  LogIn,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { GalleryImage, MenuItem } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddGalleryImage,
  useAddMenuItem,
  useDeleteGalleryImage,
  useDeleteMenuItem,
  useGetAllBookings,
  useGetDashboardStats,
  useInitializeAsAdmin,
  useIsCallerAdmin,
  useListGalleryImages,
  useListMenuItems,
  useUpdateBookingStatus,
} from "../hooks/useQueries";
import { useBlobUrl, useStorageClient } from "../hooks/useStorage";

const MENU_CATEGORIES = [
  "Coffee",
  "Cold Beverages",
  "Desserts",
  "Snacks",
  "Specials",
];
const GALLERY_CATEGORIES = ["Food", "Drinks", "Ambience", "Events"];

function StatCard({
  label,
  value,
  color,
}: { label: string; value: bigint | number | string; color: string }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card">
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className={`font-serif text-3xl font-bold ${color}`}>
        {String(value)}
      </p>
    </div>
  );
}

function GalleryThumb({
  blobId,
  fallback,
}: { blobId: string; fallback: string }) {
  const { url } = useBlobUrl(blobId);
  return (
    <img
      src={url || fallback}
      alt="gallery"
      className="w-12 h-12 rounded-lg object-cover"
    />
  );
}

function MenuThumb({ item }: { item: MenuItem }) {
  const fallbacks: Record<string, string> = {
    Coffee: "/assets/generated/menu-coffee.dim_400x300.jpg",
    "Cold Beverages": "/assets/generated/menu-cold-beverage.dim_400x300.jpg",
    Desserts: "/assets/generated/menu-dessert.dim_400x300.jpg",
    Snacks: "/assets/generated/menu-snack.dim_400x300.jpg",
    Specials: "/assets/generated/menu-snack.dim_400x300.jpg",
  };
  const { url } = useBlobUrl(item.blobId);
  return (
    <img
      src={url || fallbacks[item.category] || fallbacks.Specials}
      alt={item.name}
      className="w-12 h-12 rounded-lg object-cover"
    />
  );
}

function ClaimAdminForm() {
  const [secret, setSecret] = useState("");
  const initAdmin = useInitializeAsAdmin();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await initAdmin.mutateAsync(secret);
      queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
    } catch {
      // error shown inline
    }
  };

  return (
    <motion.main
      className="max-w-md mx-auto px-6 py-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <KeyRound className="text-primary" size={28} />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">
          Set Up Admin Access
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter the admin secret to claim admin privileges for the first time.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="admin-secret">Admin Secret</Label>
          <Input
            id="admin-secret"
            data-ocid="admin.input"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter admin secret"
            required
          />
        </div>
        {initAdmin.isError && (
          <p
            className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
            data-ocid="admin.error_state"
          >
            Invalid secret or access already initialized.
          </p>
        )}
        <Button
          type="submit"
          data-ocid="admin.submit_button"
          className="w-full bg-primary text-primary-foreground"
          disabled={initAdmin.isPending}
        >
          {initAdmin.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            "Claim Admin Access"
          )}
        </Button>
      </form>
    </motion.main>
  );
}

export default function AdminPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (!identity) {
    return (
      <main className="max-w-md mx-auto px-6 py-24 text-center">
        <BarChart3 className="mx-auto mb-4 text-primary" size={48} />
        <h1 className="font-serif text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to access the admin panel.
        </p>
        <Button
          data-ocid="admin.primary_button"
          onClick={login}
          disabled={isLoggingIn}
          className="bg-primary text-primary-foreground"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="mr-2" size={16} />
              Sign In
            </>
          )}
        </Button>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-72" />
      </main>
    );
  }

  if (!isAdmin) {
    return <ClaimAdminForm />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-3xl font-bold text-foreground mb-6">
          Admin Dashboard
        </h1>
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" data-ocid="admin.tab">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="menu" data-ocid="admin.tab">
              Menu Items
            </TabsTrigger>
            <TabsTrigger value="gallery" data-ocid="admin.tab">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="analytics" data-ocid="admin.tab">
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <BookingsTab />
          </TabsContent>
          <TabsContent value="menu">
            <MenuTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}

function BookingsTab() {
  const { data: bookings = [], isLoading } = useGetAllBookings();
  const [filter, setFilter] = useState("all");
  const updateStatus = useUpdateBookingStatus();

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-green-100 text-green-700";
    if (s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["all", "pending", "confirmed", "cancelled"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
            data-ocid="admin.toggle"
            className={filter === s ? "bg-primary text-primary-foreground" : ""}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-2" data-ocid="admin.loading_state">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static index
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          No bookings found.
        </div>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          data-ocid="admin.table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static index
                <TableRow key={i} data-ocid={`admin.row.${i + 1}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{b.fullName}</p>
                      <p className="text-xs text-muted-foreground">{b.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.timeSlot}</TableCell>
                  <TableCell>{String(b.guests)}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(b.status)}`}
                    >
                      {b.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {b.status !== "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`admin.confirm_button.${i + 1}`}
                          className="text-green-700 border-green-200 hover:bg-green-50"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: String(i),
                              status: "confirmed",
                            })
                          }
                        >
                          Approve
                        </Button>
                      )}
                      {b.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`admin.delete_button.${i + 1}`}
                          className="text-destructive border-destructive/20 hover:bg-destructive/10"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: String(i),
                              status: "cancelled",
                            })
                          }
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function MenuTab() {
  const { data: items = [], isLoading } = useListMenuItems();
  const addItem = useAddMenuItem();
  const deleteItem = useDeleteMenuItem();
  const { uploadFile } = useStorageClient();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Coffee",
    blobId: "",
    available: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const blobId = await uploadFile(file);
      setForm((f) => ({ ...f, blobId }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addItem.mutateAsync(form);
    setOpen(false);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "Coffee",
      blobId: "",
      available: true,
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="admin.open_modal_button"
              className="bg-primary text-primary-foreground"
            >
              <Plus size={16} className="mr-2" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="admin.dialog">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  data-ocid="admin.input"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input
                  data-ocid="admin.input"
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Price</Label>
                  <Input
                    data-ocid="admin.input"
                    placeholder="₹250"
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, category: v }))
                    }
                  >
                    <SelectTrigger data-ocid="admin.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Image</Label>
                <Input
                  data-ocid="admin.upload_button"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {uploading && (
                  <p className="text-xs text-muted-foreground">Uploading...</p>
                )}
                {form.blobId && (
                  <p className="text-xs text-primary">✓ Image uploaded</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="admin.switch"
                  checked={form.available}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, available: v }))
                  }
                />
                <Label>Available</Label>
              </div>
              <Button
                type="submit"
                data-ocid="admin.submit_button"
                className="w-full bg-primary text-primary-foreground"
                disabled={addItem.isPending || uploading}
              >
                {addItem.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Item"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2" data-ocid="admin.loading_state">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static index
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          No menu items yet.
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static index
                <TableRow key={i} data-ocid={`admin.item.${i + 1}`}>
                  <TableCell>
                    <MenuThumb item={item} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description.slice(0, 40)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.price}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {item.available ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      data-ocid={`admin.delete_button.${i + 1}`}
                      className="text-destructive hover:text-destructive"
                      disabled={deleteItem.isPending}
                      onClick={() => deleteItem.mutate(String(i))}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function GalleryTab() {
  const { data: images = [], isLoading } = useListGalleryImages();
  const addImage = useAddGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const { uploadFile } = useStorageClient();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Food", blobId: "" });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const blobId = await uploadFile(file);
      setForm((f) => ({ ...f, blobId }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addImage.mutateAsync(form);
    setOpen(false);
    setForm({ title: "", category: "Food", blobId: "" });
  };

  const fallbacks = [
    "/assets/generated/menu-coffee.dim_400x300.jpg",
    "/assets/generated/menu-snack.dim_400x300.jpg",
    "/assets/generated/hero-cafe-interior.dim_1200x600.jpg",
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="admin.open_modal_button"
              className="bg-primary text-primary-foreground"
            >
              <Plus size={16} className="mr-2" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="admin.dialog">
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  data-ocid="admin.input"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger data-ocid="admin.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Image</Label>
                <Input
                  data-ocid="admin.upload_button"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageUpload}
                />
                {uploading && (
                  <p className="text-xs text-muted-foreground">Uploading...</p>
                )}
                {form.blobId && (
                  <p className="text-xs text-primary">✓ Image uploaded</p>
                )}
              </div>
              <Button
                type="submit"
                data-ocid="admin.submit_button"
                className="w-full bg-primary text-primary-foreground"
                disabled={addImage.isPending || uploading}
              >
                {addImage.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Image"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          data-ocid="admin.loading_state"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static index
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.empty_state"
        >
          No gallery images yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(images as GalleryImage[]).map((img, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static index
              key={i}
              className="relative group rounded-xl overflow-hidden"
              data-ocid={`admin.item.${i + 1}`}
            >
              <GalleryThumb
                blobId={img.blobId}
                fallback={fallbacks[i % fallbacks.length]}
              />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{img.title}</p>
                <p className="text-xs text-muted-foreground">{img.category}</p>
              </div>
              <Button
                size="icon"
                variant="destructive"
                data-ocid={`admin.delete_button.${i + 1}`}
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteImage.mutate(String(i))}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        data-ocid="admin.loading_state"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static index
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        className="text-muted-foreground text-center py-12"
        data-ocid="admin.error_state"
      >
        Failed to load stats.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Total Bookings"
        value={stats.totalBookings}
        color="text-foreground"
      />
      <StatCard
        label="Confirmed"
        value={stats.confirmedBookings}
        color="text-primary"
      />
      <StatCard
        label="Pending"
        value={stats.pendingBookings}
        color="text-secondary"
      />
    </div>
  );
}
