import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "../backend";
import { useBlobUrl } from "../hooks/useStorage";

const categoryFallbacks: Record<string, string> = {
  Coffee: "/assets/generated/menu-coffee.dim_400x300.jpg",
  "Cold Beverages": "/assets/generated/menu-cold-beverage.dim_400x300.jpg",
  Desserts: "/assets/generated/menu-dessert.dim_400x300.jpg",
  Snacks: "/assets/generated/menu-snack.dim_400x300.jpg",
  Specials: "/assets/generated/menu-snack.dim_400x300.jpg",
};

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { url } = useBlobUrl(item.blobId);
  const imgSrc =
    url ||
    categoryFallbacks[item.category] ||
    "/assets/generated/menu-coffee.dim_400x300.jpg";

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-semibold text-foreground text-lg leading-tight">
            {item.name}
          </h3>
          <span className="text-secondary font-bold text-base shrink-0">
            {item.price}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          {item.available && (
            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
              Available
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
