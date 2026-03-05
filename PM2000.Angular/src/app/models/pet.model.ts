export type PetStatus = 'listed' | 'examining' | 'done';

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

export type VisitReason = '' | 'checkup' | 'vaccination' | 'grooming' | 'nail_trim' | 'sick_visit' | 'surgery' | 'pickup' | 'other';

export const VISIT_REASON_OPTIONS: { value: VisitReason; label: string }[] = [
  { value: '', label: '— Reason —' },
  { value: 'checkup', label: 'Checkup' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'nail_trim', label: 'Nail Trim' },
  { value: 'sick_visit', label: 'Sick Visit' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'pickup', label: 'Pick-up' },
  { value: 'other', label: 'Other' },
];

export const PET_SPECIES_OPTIONS: { value: PetSpecies; label: string; icon: string }[] = [
  { value: 'dog', label: 'Dog', icon: '🐶' },
  { value: 'cat', label: 'Cat', icon: '🐱' },
  // { value: 'bird', label: 'Bird', icon: '🐦' },
  // { value: 'rabbit', label: 'Rabbit', icon: '🐰' },
  // { value: 'fish', label: 'Fish', icon: '🐟' },
  // { value: 'other', label: 'Other', icon: '🐾' },
];

export interface Pet {
  id: string;
  name: string;
  ownerName: string;
  species: PetSpecies;
  visitReason: VisitReason;
  notes: string;
  status: PetStatus;
  statusChangedAt: number;
}
