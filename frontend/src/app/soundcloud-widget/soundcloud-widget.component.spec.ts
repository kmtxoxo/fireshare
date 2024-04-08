import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundcloudWidgetComponent } from './soundcloud-widget.component';

describe('SoundcloudWidgetComponent', () => {
  let component: SoundcloudWidgetComponent;
  let fixture: ComponentFixture<SoundcloudWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundcloudWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundcloudWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
