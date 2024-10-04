import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectQueryComponent } from './project-query.component';

describe('ProjectQueryComponent', () => {
  let component: ProjectQueryComponent;
  let fixture: ComponentFixture<ProjectQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
