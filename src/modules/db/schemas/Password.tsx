
import Realm from 'realm';

class Password extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  username!: string;
  password!: string;
  for!: string;

  static generate(password: Partial<Password>) {
    return {
      _id: new Realm.BSON.ObjectId(),
      username: password.username,
      password: password.password,
      for: password.for
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Password',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      username: 'string',
      password: 'string',
      for: 'string'
    },
  };
}

export default Password;