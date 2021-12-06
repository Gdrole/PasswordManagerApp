
import Realm from 'realm';

class Password extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  note!: string;
  username!: string;
  password!: string;
  salt!: string;

  static generate() {
    return {
      _id: new Realm.BSON.ObjectId(),
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Password',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      note: 'string',
      username: 'string',
      password: 'string',
      salt: 'string'
    },
  };
}

export default Password;