import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Form-group validator reporting `passwordMismatch` when the `password` and `confirmPassword` controls differ.
 * An empty confirmation is left to that control's own `required` validator.
 */
export const confirmPasswordValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmation = group.get('confirmPassword')?.value;
  return !confirmation || password === confirmation
    ? null
    : { passwordMismatch: true };
};
