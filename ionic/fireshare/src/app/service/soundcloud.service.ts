import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class SoundcloudService {
    clientId: string = 'b23455855ab96a4556cbd0a98397ae8c';
    resolveUrl: string = 'http://api.soundcloud.com/resolve.json?url=';

    constructor(private httpClient: HttpClient) {
    }

    async getTrackThumbnail(url) {
        const result = await this.httpClient.get<any>(this.resolveUrl + url + '&client_id=' + this.clientId).toPromise();
        //console.log(JSON.stringify(result));
        return result;
    }

}