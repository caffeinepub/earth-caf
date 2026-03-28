import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import type { GalleryImage } from "../backend";
import { useListGalleryImages } from "../hooks/useQueries";
import { useBlobUrl } from "../hooks/useStorage";

const CATEGORIES = ["All", "Food", "Drinks", "Ambience", "Events"];

const FALLBACK_IMAGES: GalleryImage[] = [
  { title: "Morning Cappuccino", category: "Drinks", blobId: "" },
  { title: "Avocado Toast", category: "Food", blobId: "" },
  { title: "Café Ambience", category: "Ambience", blobId: "" },
  { title: "Cold Brew Jar", category: "Drinks", blobId: "" },
  { title: "Acai Bowl", category: "Food", blobId: "" },
  { title: "Sunday Brunch", category: "Ambience", blobId: "" },
];

const FALLBACK_SRCS = [
  "/assets/generated/menu-coffee.dim_400x300.jpg",
  "/assets/generated/menu-snack.dim_400x300.jpg",
  "/assets/generated/hero-cafe-interior.dim_1200x600.jpg",
  "/assets/generated/menu-cold-beverage.dim_400x300.jpg",
  "/assets/generated/menu-dessert.dim_400x300.jpg",
  "/assets/generated/hero-cafe-interior.dim_1200x600.jpg",
];

function GalleryCard({
  image,
  index,
  fallbackSrc,
}: { image: GalleryImage; index: number; fallbackSrc: string }) {
  const { url, loading } = useBlobUrl(image.blobId);
  const src = url || fallbackSrc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="rounded-2xl overflow-hidden shadow-card group"
      data-ocid={`gallery.item.${index + 1}`}
    >
      <div className="relative aspect-square">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <img
            src={src}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium">{image.title}</p>
          <p className="text-white/70 text-xs">{image.category}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: galleryImages, isLoading } = useListGalleryImages();

  const images =
    galleryImages && galleryImages.length > 0 ? galleryImages : FALLBACK_IMAGES;
  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((i) => i.category === activeCategory);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
            Visual Stories
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Gallery
          </h1>
          <p className="text-muted-foreground mt-2">
            Moments from our café, captured with love.
          </p>
        </div>

        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                data-ocid="gallery.tab"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            data-ocid="gallery.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="gallery.empty_state"
          >
            <p className="text-lg">No images in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((image, i) => (
              <GalleryCard
                key={image.title || String(i)}
                image={image}
                index={i}
                fallbackSrc={FALLBACK_SRCS[i % FALLBACK_SRCS.length]}
              />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
