import { Car, Clock3, Coffee, Compass, type LucideIcon } from 'lucide-react'

export type Enhancement = {
  id: string
  label: string
  description: string
  price: number
  icon: LucideIcon
}

// Mirrors Hotel-V2's enhancements list so both apps offer the same add-ons
// and compute totals the same way.
export const ENHANCEMENTS: Enhancement[] = [
  {
    id: 'transfer',
    label: 'Airport & pier transfers',
    description: 'Private transfers arranged for your arrival and departure.',
    price: 1500,
    icon: Car,
  },
  {
    id: 'breakfast',
    label: 'Daily breakfast for two',
    description: 'A full island breakfast served each morning of your stay.',
    price: 900,
    icon: Coffee,
  },
  {
    id: 'tour',
    label: 'Private island tour',
    description: 'A half-day boat tour with a local guide.',
    price: 3200,
    icon: Compass,
  },
  {
    id: 'checkout',
    label: 'Late checkout, 3PM',
    description: 'Extend your last morning until mid-afternoon.',
    price: 0,
    icon: Clock3,
  },
]

export const TAX_RATE = 0.12
