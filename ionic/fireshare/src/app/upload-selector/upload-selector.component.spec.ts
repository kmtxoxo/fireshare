import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSelectorComponent } from './upload-selector.component';

describe('UploadSelectorComponent', () => {
  let component: UploadSelectorComponent;
  let fixture: ComponentFixture<UploadSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
