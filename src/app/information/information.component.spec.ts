import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationComponent } from './information.component';
import { HttpClientModule } from '@angular/common/http';

describe('InformationComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationComponent], 
      imports: [HttpClientModule]
    });
    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
