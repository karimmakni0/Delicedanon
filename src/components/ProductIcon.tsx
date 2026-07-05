/**
 * ProductIcon.tsx
 *
 * Renders the appropriate Lucide icon for a given segment icon name.
 * All icons must be listed in the iconMap below.
 */

import React from 'react';
import {
  Milk,
  IceCream,
  GlassWater,
  Star,
  Award,
  Gift,
  Heart,
  Zap,
  Coffee,
  Candy,
} from 'lucide-react';

// Use a simple props interface instead of importing LucideProps
interface LucideIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  color?: string;
}

type IconComponent = React.FC<LucideIconProps>;

const iconMap: Record<string, IconComponent> = {
  Milk: Milk as IconComponent,
  IceCream: IceCream as IconComponent,
  Cup: GlassWater as IconComponent,
  GlassWater: GlassWater as IconComponent,
  Star: Star as IconComponent,
  Award: Award as IconComponent,
  Gift: Gift as IconComponent,
  Heart: Heart as IconComponent,
  Zap: Zap as IconComponent,
  Coffee: Coffee as IconComponent,
  Candy: Candy as IconComponent,
};

interface ProductIconProps {
  iconName: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const ProductIcon: React.FC<ProductIconProps> = ({
  iconName,
  size = 32,
  className = '',
  strokeWidth = 1.5,
}) => {
  const IconComponent = iconMap[iconName] ?? Star;
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
};

export default ProductIcon;
