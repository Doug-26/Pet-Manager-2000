import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      (click)="cancel.emit()"
      (keydown.escape)="cancel.emit()"
    >
      <!-- Modal panel -->
      <div
        class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-labelledby]="'confirm-title'"
        [attr.aria-describedby]="'confirm-desc'"
        (click)="$event.stopPropagation()"
      >
        <!-- Icon -->
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Title -->
        <h3 id="confirm-title" class="mb-1 text-center text-lg font-semibold text-slate-800">
          {{ title() }}
        </h3>

        <!-- Description -->
        <p id="confirm-desc" class="mb-6 text-center text-sm text-slate-500">
          {{ message() }}
        </p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="button"
            class="flex-1 cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
            (click)="cancel.emit()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="flex-1 cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
            (click)="confirm.emit()"
          >
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  readonly title = input('Are you sure?');
  readonly message = input('This action cannot be undone.');
  readonly confirmText = input('Confirm');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
