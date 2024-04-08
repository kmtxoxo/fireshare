export class User {
  name: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
