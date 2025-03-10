import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintFormComponent } from './sprint-form.component';

describe('SprintFormComponent', () => {
  let component: SprintFormComponent;
  let fixture: ComponentFixture<SprintFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SprintFormComponent]
    });
    fixture = TestBed.createComponent(SprintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
