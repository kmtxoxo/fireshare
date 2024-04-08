import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {Track} from "../models/track";
import {environment} from "../../environments/environment";


@Component({
    selector: 'app-uploaded-media',
    templateUrl: './uploaded-media.component.html',
    styleUrls: ['./uploaded-media.component.scss']
})
export class UploadedMediaComponent implements OnInit {

    @Input('mostVotedTrack') set mvt(mostVotedTrack: Track) {
        this.filePath = mostVotedTrack.source.replace("filepath::", environment.UPLOAD_PATH + '/');
    };

    @Output('finishedEvent') finishedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() pauseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    filePath: string = "default value 'not set yet'";

  constructor(private ref: ChangeDetectorRef) {}

    ngOnInit(): void {
        let aud = document.getElementById("uploaded_mediaplayer");
        aud.onended = () => {
            this.finishedEvent.emit(true);
        };
        aud.onpause = () => {
            this.pauseEvent.emit(false);
        };
        aud.onplaying = () => {
            this.pauseEvent.emit(true);
        };
    }

    pauseTrack() {
        let aud : any  = document.getElementById("uploaded_mediaplayer");
        aud.pause();
    }

    resumeTrack() {
        let aud : any = document.getElementById("uploaded_mediaplayer");
        aud.play();
    }

    playTrack(mvt: Track){
        this.filePath = mvt.source.replace("filepath::", environment.UPLOAD_PATH+'/');
        this.ref.detectChanges();
    }
}
