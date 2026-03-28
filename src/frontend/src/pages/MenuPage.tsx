import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import type { MenuItem } from "../backend";
import MenuItemCard from "../components/MenuItemCard";
import { useListMenuItems } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Coffee",
  "Cold Beverages",
  "Desserts",
  "Snacks",
  "Specials",
];

const SEED_ITEMS: MenuItem[] = [
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
    name: "Cold Brew",
    description:
      "12-hour slow-steeped cold brew with notes of dark chocolate and caramel.",
    price: "₹280",
    category: "Coffee",
    blobId: "",
    available: true,
  },
  {
    name: "Mango Smoothie",
    description:
      "Alphonso mango blended with yogurt and a hint of cardamom. Utterly refreshing.",
    price: "₹240",
    category: "Cold Beverages",
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
    name: "Avocado Toast",
    description:
      "Sourdough toast with smashed avocado, cherry tomatoes and a poached egg.",
    price: "₹280",
    category: "Snacks",
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

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: menuItems, isLoading } = useListMenuItems();

  const items = menuItems && menuItems.length > 0 ? menuItems : SEED_ITEMS;
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">
            What We Serve
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Our Menu
          </h1>
          <p className="text-muted-foreground mt-2">
            Crafted with care, served with love.
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
                data-ocid="menu.tab"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="menu.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="menu.empty_state"
          >
            <p className="text-lg">No items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                data-ocid={`menu.item.${i + 1}`}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
