import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationComponent } from './user-information.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserInformationComponent', () => {
  let component: UserInformationComponent;
  let fixture: ComponentFixture<UserInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInformationComponent], 
      imports: [HttpClientModule, ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(UserInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
