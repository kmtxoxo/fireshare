export class User {
  name: string;
  host: boolean;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
