import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Formats a date as `YYYY-MM-DD` in local time, matching `<input type="date">` values.
 */
export function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Rejects `YYYY-MM-DD` values earlier than today.
 * @param today Supplies the current date; injectable for tests.
 */
export function notInPastValidator(today: () => Date = () => new Date()): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null;
    }
    return value < toDateInputValue(today()) ? { pastDate: true } : null;
  };
}

/**
 * Rejects `HH:MM` values outside the inclusive range `[earliest, latest]`.
 */
export function timeWithinValidator(earliest: string, latest: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null;
    }
    return value < earliest || value > latest ? { outsideHours: true } : null;
  };
}
