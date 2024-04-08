import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(private httpClient: HttpClient,) {


    }

    getExisting():Observable<string[]> {
        console.log("requesting uploaded file list");
        return this.httpClient.get<string[]>(environment.UPLOAD_PATH+"/existing");
    }

    getInfo(fileName: String): Observable<any> {
        console.log("Requesting info for: " + fileName);
        return this.httpClient.get<any>(environment.UPLOAD_PATH+"/existing/"+fileName);
    }

    postFile(fileToUpload: File): Observable<any> {
        console.log("Posting " + fileToUpload.name + " to backend @: " + environment.UPLOAD_PATH);

        const formData: FormData = new FormData();
        formData.append("track", fileToUpload, fileToUpload.name);

        let headers = new HttpHeaders();
        headers.set("Content-Type", "multipart/form-data");
        return this.httpClient.post<any>(environment.UPLOAD_PATH, formData, {headers: headers});
    }
}
