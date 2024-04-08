import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private url = 'https://www.googleapis.com/youtube/v3/';
  private key = 'key=AIzaSyABRlzmmM01mKQlgPO9HbLPf12L-Wgs6-8';
  private results = '&maxResults=4';
  private region = '&regionCode=DE';
  private type = '&type=video';

  constructor( private httpClient: HttpClient,) {
  }

  async getSearch(search: string) {
    try{
      const result = await this.httpClient.get(`${this.url}search?part=snippet&q=${search}${this.results}${this.type}${this.region}&${this.key}`).toPromise();
      return result;
    }
    catch(err){
      // request failed
      console.error(err);
    }

  }

  async  getYoutubeVideoInormationbyID(id: string){
        try{
          const result = await this.httpClient.get(`${this.url}videos?${this.key}&part=snippet&id=${id}`).toPromise();
          return result;
        }
        catch(err){
          // request failed
          console.error(err);
        }
  }


  getYoutubeID(url){
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== url[2]?url[2].split(/[^0-9a-z_\-]/i)[0]:url[0];
  }



}
