import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PetQueueService } from '../../services/pet-queue.service';
import { PetCardComponent } from './pet-card/pet-card.component';

@Component({
  selector: 'app-queue-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PetCardComponent],
  templateUrl: './queue-board.component.html',
})
export class QueueBoardComponent {
  private readonly queueService = inject(PetQueueService);

  readonly petNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly ownerNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly addPetForm = new FormGroup({
    petName: this.petNameControl,
    ownerName: this.ownerNameControl,
  });

  readonly listedPets = this.queueService.listedPets;
  readonly examiningPets = this.queueService.examiningPets;
  readonly donePets = this.queueService.donePets;

  onAddPet(): void {
    this.addPetForm.markAllAsTouched();
    if (this.addPetForm.invalid) return;
    this.queueService.addPet(this.petNameControl.value, this.ownerNameControl.value);
    this.addPetForm.reset();
  }

  onMoveNext(id: string): void {
    this.queueService.moveNext(id);
  }

  onRemove(id: string): void {
    if (confirm('Dismiss this pet from the queue?')) {
      this.queueService.removePet(id);
    }
  }
}
