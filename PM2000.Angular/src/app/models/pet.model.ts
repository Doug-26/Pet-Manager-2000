export type PetStatus = 'listed' | 'examining' | 'done';

export interface Pet {
  id: string;
  name: string;
  ownerName: string;
  status: PetStatus;
  statusChangedAt: number;
}
