import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyQueryComponent } from './reply-query.component';

describe('ReplyQueryComponent', () => {
  let component: ReplyQueryComponent;
  let fixture: ComponentFixture<ReplyQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplyQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
