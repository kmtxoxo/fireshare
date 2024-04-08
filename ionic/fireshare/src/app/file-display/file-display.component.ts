import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadService} from "../service/upload.service";
import {Track} from "../models/track";
import {tryCatch} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrls: ['./file-display.component.scss']
})
export class FileDisplayComponent implements OnInit {

  @Input() name: string;
  @Output() addTrack = new EventEmitter<Track>();

  length;
  title;
  artist;
  imageUrl;
  genre;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.uploadService.getInfo(this.name).subscribe( data => {
      this.title = data.title;
      this.artist = data.artist;

        if (data.artist) {
            this.artist = data.artist;
        } else {
            this.artist = "Unknown"
        }

      if (data.title) {
        this.title = data.title;
      } else {
        this.title = this.name
      }

      if (data.genre) {
        this.genre = data.genre;
      } else {
        this.genre = "Unknown"
      }

      if (data.length) {
          let seconds =  Math.floor(((data.length % 360000) % 60000) / 1000);
          let formattedSeconds: string;
          if (seconds < 10) {
              formattedSeconds = "0" + seconds;
          } else {
              formattedSeconds = seconds.toString();
          }
        this.length = Math.floor((data.length % 3600000) / 60000) + ":" + formattedSeconds;
      } else {
        this.length = "0:00"
      }


      if(data.image) {
          let dataView = new Uint8Array(data.image.imageBuffer.data);
          let blob = new Blob([dataView], {type: 'image/jpeg'});
          this.imageUrl = URL.createObjectURL(blob);
          document.getElementById(this.name)
              .style.backgroundImage = "-webkit-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(50, 50, 50, 1) 100%), url("+ this.imageUrl +")";
      } else {
        console.log("Mp3["+this.name+"] did not contain image information.")
      }

    })
  }

    onAddTrack() {
      let track = new Track();
      track.title = this.title;
      track.artist = this.artist;
      track.source = "filepath::" + this.name;
      if (this.imageUrl) {
        track.thumbnail = this.imageUrl;
      } else {
        track.thumbnail = "http://dalelyles.com/musicmp3s/no_cover.jpg";
      }

      this.addTrack.emit(track)
    }

}
