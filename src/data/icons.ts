import {
  Bluetooth,
  Car,
  Coffee,
  Compass,
  Maximize2,
  Mountain,
  PawPrint,
  Tv,
  Usb,
  Wifi,
  Wind,
  Wine,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Bluetooth,
  Car,
  Coffee,
  Compass,
  Maximize2,
  Mountain,
  PawPrint,
  Tv,
  Usb,
  Wifi,
  Wind,
  Wine,
}

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Wifi
}
