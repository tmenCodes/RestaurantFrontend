import { Component } from '@angular/core';

/** A member of the kitchen team shown on the Chefs page. */
export interface Chef {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  /** Path under `assets/img/chefs/`. */
  readonly image: string;
  readonly alt: string;
}

const CHEFS: readonly Chef[] = [
  {
    name: 'Walter White',
    role: 'Master Chef',
    bio: 'Personable chef with 4+ years expertise in a fast-paced kitchen environment. Achieved region-best culinary satisfaction rating according to national food critic 5-Star Rating',
    image: 'chefs-1.jpg',
    alt: 'Walter White, Master Chef',
  },
  {
    name: 'Sarah Johanson',
    role: 'Patissier',
    bio: 'Skilled baker with exceptional knowledge of baking times, methods and flavors. Well-versed in proper function and maintenance of bakery utensils and equipment',
    image: 'chefs-2.jpg',
    alt: 'Sarah Johanson, Patissier',
  },
  {
    name: 'William Anderson',
    role: 'Cook',
    bio: 'Expert in creating delicious and innovative dishes, with a focus on health and nutrition. Proven ability to manage a team of cooks and ensure high standards of food quality and presentation',
    image: 'chefs-3.jpg',
    alt: 'William Anderson, Cook',
  },
];

@Component({
  selector: 'app-chefs',
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.css'],
  standalone: false,
})
export class ChefsComponent {
  readonly chefs = CHEFS;
}
