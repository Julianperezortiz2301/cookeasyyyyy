import {
  Zap,
  UtensilsCrossed,
  Leaf,
  Soup,
  Salad,
  Cookie,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Zap,
  UtensilsCrossed,
  Leaf,
  Soup,
  Salad,
  Cookie,
};

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICONS[icon] ?? LayoutGrid;
  return <Icon className={className} />;
}
