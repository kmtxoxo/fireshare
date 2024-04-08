export class Message {
  from?: string;
  content?: any;
  time?:any;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
