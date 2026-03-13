import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSuccess } from './orders-success';

describe('OrdersSuccess', () => {
  let component: OrdersSuccess;
  let fixture: ComponentFixture<OrdersSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
