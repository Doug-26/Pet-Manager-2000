import { Injectable, computed, effect, signal } from '@angular/core';
import { Pet, PetSpecies, PetStatus } from '../models/pet.model';

export interface UndoAction {
  label: string;
  snapshot: Pet[];
}

const STORAGE_KEY = 'pm2000_pets';

function loadPets(): Pet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class PetQueueService {
  private readonly _pets = signal<Pet[]>(loadPets());
  private readonly _lastAction = signal<UndoAction | null>(null);

  constructor() {
    // Persist pets to localStorage whenever the signal changes.
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._pets()));
    });

    // Sync from other tabs/windows — the 'storage' event only fires in
    // *other* windows on the same origin, so the display window receives
    // updates written by the staff window automatically.
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          this._pets.set(JSON.parse(e.newValue));
        } catch { /* ignore corrupt data */ }
      }
    });
  }

  readonly MAX_EXAMINING = 3;

  readonly listedPets = computed(() => this._pets().filter((p) => p.status === 'listed'));
  readonly examiningPets = computed(() => this._pets().filter((p) => p.status === 'examining'));
  readonly donePets = computed(() => this._pets().filter((p) => p.status === 'done'));
  readonly totalCount = computed(() => this._pets().length);
  readonly examiningFull = computed(() => this.examiningPets().length >= this.MAX_EXAMINING);
  readonly lastAction = this._lastAction.asReadonly();

  addPet(name: string, ownerName: string, species: PetSpecies): void {
    const trimmedName = name.trim();
    const trimmedOwner = ownerName.trim();
    if (!trimmedName) return;
    this.saveSnapshot(`Added ${trimmedName}`);
    const newPet: Pet = {
      id: crypto.randomUUID(),
      name: trimmedName,
      ownerName: trimmedOwner,
      species,
      status: 'listed',
      statusChangedAt: Date.now(),
    };
    this._pets.update((pets) => [...pets, newPet]);
  }

  moveNext(id: string): boolean {
    const pet = this._pets().find((p) => p.id === id);
    if (!pet) return false;

    const nextStatusMap: Partial<Record<PetStatus, PetStatus>> = {
      listed: 'examining',
      examining: 'done',
    };
    const next = nextStatusMap[pet.status];
    if (!next) return false;
    if (next === 'examining' && this.examiningFull()) return false;

    this.saveSnapshot(`Moved ${pet.name}`);
    this._pets.update((pets) =>
      pets.map((p) =>
        p.id === id ? { ...p, status: next, statusChangedAt: Date.now() } : p,
      ),
    );
    return next === 'done';
  }

  removePet(id: string): void {
    const pet = this._pets().find((p) => p.id === id);
    if (!pet) return;
    this.saveSnapshot(`Removed ${pet.name}`);
    this._pets.update((pets) => pets.filter((p) => p.id !== id));
  }

  undo(): void {
    const action = this._lastAction();
    if (!action) return;
    this._pets.set(action.snapshot);
    this._lastAction.set(null);
  }

  dismissUndo(): void {
    this._lastAction.set(null);
  }

  private saveSnapshot(label: string): void {
    this._lastAction.set({ label, snapshot: [...this._pets()] });
  }
}
