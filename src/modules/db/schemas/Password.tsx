
import Realm from 'realm';

class Password extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  username!: string;
  password!: string;
  algorithm!: string;
  nonce!: string;
  for!: string;

  static generate(password: Partial<Password>) {
    return {
      _id: new Realm.BSON.ObjectId(),
      username: password.username,
      password: password.password,
      algorithm: password.algorithm,
      nonce: password.nonce,
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
      algorithm: 'string',
      password: 'string',
      for: 'string',
      nonce: 'string'
    },
  };
}

export default Password;