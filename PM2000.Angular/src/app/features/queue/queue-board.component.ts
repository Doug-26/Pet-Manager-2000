import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { PetQueueService } from '../../services/pet-queue.service';
import { PetCardComponent } from './pet-card/pet-card.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { PET_SPECIES_OPTIONS, Pet, PetSpecies, PetStatus } from '../../models/pet.model';

@Component({
  selector: 'app-queue-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CdkDropList, CdkDrag, CdkDragPlaceholder, PetCardComponent, ConfirmModalComponent],
  templateUrl: './queue-board.component.html',
})
export class QueueBoardComponent {
  private readonly queueService = inject(PetQueueService);

  readonly speciesOptions = PET_SPECIES_OPTIONS;

  readonly petNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly ownerNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly speciesControl = new FormControl<PetSpecies>('dog', { nonNullable: true });

  readonly addPetForm = new FormGroup({
    petName: this.petNameControl,
    ownerName: this.ownerNameControl,
    species: this.speciesControl,
  });

  readonly listedPets = this.queueService.listedPets;
  readonly examiningPets = this.queueService.examiningPets;
  readonly donePets = this.queueService.donePets;
  readonly examiningFull = this.queueService.examiningFull;
  readonly maxExamining = this.queueService.MAX_EXAMINING;
  readonly lastAction = this.queueService.lastAction;

  onAddPet(): void {
    this.addPetForm.markAllAsTouched();
    if (this.addPetForm.invalid) return;
    this.queueService.addPet(
      this.petNameControl.value,
      this.ownerNameControl.value,
      this.speciesControl.value,
    );
    this.addPetForm.reset();
  }

  onMoveNext(id: string): void {
    const movedToDone = this.queueService.moveNext(id);
    if (movedToDone) {
      this.playNotification();
    }
  }

  onRemove(id: string): void {
    this.pendingConfirm.set({
      title: 'Dismiss Pet',
      message: 'Remove this pet from the queue? You can undo this action.',
      confirmText: 'Dismiss',
      action: () => this.queueService.removePet(id),
    });
  }

  onEdit(event: { id: string; name: string; ownerName: string; species: PetSpecies }): void {
    this.queueService.editPet(event.id, event.name, event.ownerName, event.species);
  }

  onDrop(event: CdkDragDrop<string>): void {
    // If dropped in the same column, do nothing (no reordering)
    if (event.previousContainer === event.container) return;
    const pet = event.item.data as Pet;
    const targetStatus = event.container.data as PetStatus;
    const movedToDone = this.queueService.movePetToStatus(pet.id, targetStatus);
    if (movedToDone) {
      this.playNotification();
    }
  }

  onClearDone(): void {
    this.pendingConfirm.set({
      title: 'Clear Completed',
      message: 'Remove all completed pets from the board? You can undo this action.',
      confirmText: 'Clear All',
      action: () => this.queueService.clearDone(),
    });
  }

  // --- Confirm modal state ---
  readonly pendingConfirm = signal<{
    title: string;
    message: string;
    confirmText: string;
    action: () => void;
  } | null>(null);

  onModalConfirm(): void {
    this.pendingConfirm()?.action();
    this.pendingConfirm.set(null);
  }

  onModalCancel(): void {
    this.pendingConfirm.set(null);
  }

  onUndo(): void {
    this.queueService.undo();
  }

  onDismissUndo(): void {
    this.queueService.dismissUndo();
  }

  private playNotification(): void {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Pet Manager 2000', { body: 'A pet is ready to go home! 🏠' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
}
