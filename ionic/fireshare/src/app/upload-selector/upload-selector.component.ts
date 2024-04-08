import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UploadService} from "../service/upload.service";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Track} from "../models/track";
import {ToastController} from "@ionic/angular";

@Component({
    selector: 'app-upload-selector',
    templateUrl: './upload-selector.component.html',
    styleUrls: ['./upload-selector.component.scss']
})
export class UploadSelectorComponent implements OnInit {

    hasSelection = false;

    selectedFile;
    fileSize = 0;
    fileName = "please select a file";
    title;
    artist;
    imageUrl;

    constructor(private uploadService: UploadService, private sanatizer: DomSanitizer, private toastCtrl: ToastController,) {
    }

    @Output() addTrack = new EventEmitter<Track>();

    ngOnInit() {
    }

    handleFileSelection(files: FileList) {
        this.hasSelection = true;
        this.selectedFile = files.item(0);
        this.fileSize = this.selectedFile.size / 1024 / 1024;
        this.fileName = this.selectedFile.name;

        this.uploadService.postFile(this.selectedFile).subscribe(data => {
            this.title = data.title;
            this.artist = data.artist;

            let dataView = new Uint8Array(data.image.imageBuffer.data);
            let blob = new Blob([dataView], {type: 'image/jpeg'});
            this.imageUrl = URL.createObjectURL(blob);
            document.getElementById("img_bg")
                .style.backgroundImage = "-webkit-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(50, 50, 50, 1) 100%), url(" + this.imageUrl + ")";
        })
    }

    onAddTrack() {
        if (this.selectedFile) {
            let track = new Track();
            track.source = "filepath::" + this.fileName.replace(/\s/g, "");
            track.artist = this.artist;
            track.thumbnail = this.imageUrl;
            track.title = this.title;

            this.addTrack.emit(track);
        }
        else {
            this.toastCtrl.create({
                message: "Please select a file before trying to upload.",
                showCloseButton: true,
                closeButtonText: "OK",
                duration: 3000,
                position: "top"
            }).then((suc) => {
                suc.present();
            });
        }
    }

}
