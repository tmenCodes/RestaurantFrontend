import { Injectable, inject } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
   *
   */
  constructor(private CookieService: CookieService) {}

  public showingLogout: boolean = false; 

  canActivateFn(): boolean {
    
      if (localStorage.getItem("id_token") && localStorage.getItem("user")) 
       {
         return true; 
       }
      return false; 
    }

    
  showLogOut(value: boolean): boolean {
   
    return this.showingLogout = value; 
  }

}
  
//export const canActivate = (isAdmin: boolean, permissionService = inject(DashboardService)) => permissionService.isAdmin(isAdmin);

// const canActivateTeam: CanActivateFn =
//     (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//       return inject(DashboardService).canActivate();
//     };

  

