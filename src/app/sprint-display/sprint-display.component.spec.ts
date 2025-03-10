import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDisplayComponent } from './sprint-display.component';

describe('SprintDisplayComponent', () => {
  let component: SprintDisplayComponent;
  let fixture: ComponentFixture<SprintDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SprintDisplayComponent]
    });
    fixture = TestBed.createComponent(SprintDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
