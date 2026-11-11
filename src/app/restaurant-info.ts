/** Public contact details for the restaurant, shown on the Contact page and in the footer. */
export interface RestaurantInfo {
  /** Street line of the address. */
  readonly street: string;
  /** City, state and postal code line of the address. */
  readonly cityLine: string;
  /** Country shown after the city line in the footer. */
  readonly country: string;
  /** Phone number as displayed to visitors. */
  readonly phone: string;
  /** Phone number in E.164 form, for `tel:` links. */
  readonly phoneHref: string;
  /** Email address for inquiries. */
  readonly email: string;
  /** Days the restaurant is open, e.g. "Mon-Sun". */
  readonly openDays: string;
  /** Opening hours on those days, e.g. "9AM - 10PM". */
  readonly openHours: string;
}

/** The single source of the restaurant's contact details. */
export const RESTAURANT_INFO: RestaurantInfo = {
  street: 'A108 Adam Street',
  cityLine: 'Minneapolis, MN 55404',
  country: 'US',
  phone: '(612) 830-8080',
  phoneHref: '+16128308080',
  email: 'yummy@gmail.com',
  openDays: 'Mon-Sun',
  openHours: '9AM - 10PM',
};
