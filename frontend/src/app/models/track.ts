export class Track {
  title: string;
  artist: string;
  _id?: any;
  votecnt: number;
  op: string;
  usersVoted?: string[];
  source?: string;
  file?: boolean;


  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
