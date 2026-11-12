/** Field limits and opening hours used to validate the reservation form. */
export const BOOKING_LIMITS = {
  nameMaxLength: 60,
  emailMaxLength: 100,
  messageMaxLength: 500,
  minGuests: 1,
  maxGuests: 20,
  phonePattern: /^[0-9+\-() ]{7,20}$/,
  firstSeating: '11:00',
  lastSeating: '21:30',
} as const;

/** Routes the booking page navigates to. */
export const BOOKING_ROUTES = {
  complete: 'bookingcomplete',
} as const;
