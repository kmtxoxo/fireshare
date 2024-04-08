import {Track} from "./track";

export class Room {
  from?: string;
  roomnumber?: number;
  tracklist?: Track[];
  usernames?: string[];
  currentlyPlaying?: any;
  host: string; //username or id from host am besten selbsterstellte lokale id die hochgeladen wird

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
