export type PetStatus = 'listed' | 'examining' | 'done';

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

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
  status: PetStatus;
  statusChangedAt: number;
}
