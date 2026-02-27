import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductFeatureComponent } from './new-product-feature.component';

describe('NewProductFeatureComponent', () => {
  let component: NewProductFeatureComponent;
  let fixture: ComponentFixture<NewProductFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductFeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
