export interface TripStop {
  name: string
  day: string
  note: string
  at: number
}

export interface BookingStep {
  label: string
  delay: number
}

export interface PriceLine {
  label: string
  amount: number
}

export const sceneWidth = 2600
export const sceneHeight = 300
export const road = 'M 100 160 C 380 40 620 40 900 150 S 1340 262 1620 152 S 2040 48 2300 142 S 2470 186 2520 168'

export const stops: TripStop[] = [
  { name: 'Harbor Town', day: 'Day 1', note: 'Pick up the car', at: 0 },
  { name: 'Pine Ridge', day: 'Day 2', note: 'Cabin by the lake', at: 0.34 },
  { name: 'Salt Flats', day: 'Day 3', note: 'Sunrise stop', at: 0.66 },
  { name: 'Red Canyon', day: 'Day 4', note: 'Two nights camping', at: 1 },
]

export const bookingSteps: BookingStep[] = [
  { label: 'Checking availability', delay: 700 },
  { label: 'Holding the cabin', delay: 600 },
  { label: 'Reserving campsites', delay: 800 },
  { label: 'Confirming the car', delay: 900 },
  { label: 'Taking payment', delay: 1100 },
  { label: 'Emailing your itinerary', delay: 700 },
]

export const prices: PriceLine[] = [
  { label: 'Car, 5 days', amount: 240 },
  { label: 'Cabin, 1 night', amount: 130 },
  { label: 'Campsites, 3 nights', amount: 96 },
]
