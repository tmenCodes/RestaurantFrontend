import { FormControl } from '@angular/forms';
import {
  notInPastValidator,
  timeWithinValidator,
  toDateInputValue,
} from './booking-validators';

describe('booking validators', () => {
  const fixedToday = () => new Date(2026, 10, 11);

  describe('toDateInputValue', () => {
    it('pads month and day', () => {
      expect(toDateInputValue(new Date(2026, 0, 5))).toBe('2026-01-05');
    });
  });

  describe('notInPastValidator', () => {
    const validate = notInPastValidator(fixedToday);

    it('rejects yesterday', () => {
      expect(validate(new FormControl('2026-11-10'))).toEqual({ pastDate: true });
    });

    it('accepts today and later', () => {
      expect(validate(new FormControl('2026-11-11'))).toBeNull();
      expect(validate(new FormControl('2027-01-01'))).toBeNull();
    });

    it('ignores empty values', () => {
      expect(validate(new FormControl(''))).toBeNull();
    });
  });

  describe('timeWithinValidator', () => {
    const validate = timeWithinValidator('11:00', '21:30');

    it('accepts the range boundaries', () => {
      expect(validate(new FormControl('11:00'))).toBeNull();
      expect(validate(new FormControl('21:30'))).toBeNull();
    });

    it('rejects times outside the range', () => {
      expect(validate(new FormControl('10:59'))).toEqual({ outsideHours: true });
      expect(validate(new FormControl('23:00'))).toEqual({ outsideHours: true });
    });

    it('ignores empty values', () => {
      expect(validate(new FormControl(''))).toBeNull();
    });
  });
});
