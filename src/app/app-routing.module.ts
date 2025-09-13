import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ChefsComponent } from './chefs/chefs.component';
import { BookComponent } from './book/book.component';
import { OrderComponent } from './order/order.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { UserInformationComponent } from './user-information/user-information.component';
import { DashboardService } from './dashboard.service';
import { CompleteCheckoutComponent } from './complete-checkout/complete-checkout.component';
import { BookingCompleteComponent } from './booking-complete/booking-complete.component';
import { ContactCompleteComponent } from './contact-complete/contact-complete.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SavedInformationComponent } from './saved-information/saved-information.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CheckoutComponent } from './checkout/checkout.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'chefs', component: ChefsComponent },
  { path: 'book', component: BookComponent },
  // {path: "order", component: OrderComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CheckoutComponent },
  {
    path: 'userinfo',
    canActivate: [DashboardService],
    component: UserInformationComponent,
  },
  {
    path: 'complete',
    canActivate: [DashboardService],
    component: CompleteCheckoutComponent,
  },
  { path: 'bookingcomplete', component: BookingCompleteComponent },
  { path: 'contactcomplete', component: ContactCompleteComponent },
  { path: 'errors', component: ErrorPageComponent },
  {
    path: 'saved',
    canActivate: [DashboardService],
    component: SavedInformationComponent,
  },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], 

})
export class AppRoutingModule { }
