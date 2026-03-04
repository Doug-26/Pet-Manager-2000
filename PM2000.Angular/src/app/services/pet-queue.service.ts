import { Injectable, computed, signal } from '@angular/core';
import { Pet, PetStatus } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetQueueService {
  private readonly _pets = signal<Pet[]>([]);

  readonly listedPets = computed(() => this._pets().filter((p) => p.status === 'listed'));
  readonly examiningPets = computed(() => this._pets().filter((p) => p.status === 'examining'));
  readonly donePets = computed(() => this._pets().filter((p) => p.status === 'done'));
  readonly totalCount = computed(() => this._pets().length);

  addPet(name: string, ownerName: string): void {
    const trimmedName = name.trim();
    const trimmedOwner = ownerName.trim();
    if (!trimmedName) return;
    const newPet: Pet = {
      id: crypto.randomUUID(),
      name: trimmedName,
      ownerName: trimmedOwner,
      status: 'listed',
      statusChangedAt: Date.now(),
    };
    this._pets.update((pets) => [...pets, newPet]);
  }

  moveNext(id: string): void {
    const nextStatusMap: Partial<Record<PetStatus, PetStatus>> = {
      listed: 'examining',
      examining: 'done',
    };
    this._pets.update((pets) =>
      pets.map((pet) => {
        if (pet.id !== id) return pet;
        const next = nextStatusMap[pet.status];
        return next ? { ...pet, status: next, statusChangedAt: Date.now() } : pet;
      }),
    );
  }

  removePet(id: string): void {
    this._pets.update((pets) => pets.filter((p) => p.id !== id));
  }
}
