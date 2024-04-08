import {AfterViewInit, Component, EventEmitter, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-soundcloud-widget',
  templateUrl: './soundcloud-widget.component.html',
  styleUrls: ['./soundcloud-widget.component.css']
})
export class SoundcloudWidgetComponent implements OnInit, AfterViewInit, OnChanges {

  constructor() {
  }

  @Output() talk: EventEmitter<boolean> = new EventEmitter<boolean>();

  soundcloudWidgetRendered() {
    console.log('Trying to send Answer from Soundcloud Widget');
    this.talk.emit(true);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('rendered SoundcloudWidget :)');
    this.soundcloudWidgetRendered();
  }

  ngOnChanges() {
    console.log('change was made.');
  }

}
