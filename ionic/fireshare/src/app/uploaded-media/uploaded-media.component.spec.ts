import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedMediaComponent } from './uploaded-media.component';

describe('UploadedMediaComponent', () => {
  let component: UploadedMediaComponent;
  let fixture: ComponentFixture<UploadedMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadedMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
