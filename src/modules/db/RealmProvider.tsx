import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import Realm from 'realm';
import { createContext, useContext } from 'react';
import Password from './schemas/Password';

type RealmProviderProps = {
  children: React.ReactNode;
};

interface RealmContext {
  realm: Realm | null;
  openRealm: (password: string) => Promise<void>;
  passwords: Realm.Results<Password> | [];
};

export const RealmContext = createContext<RealmContext>({
  realm: null,
  openRealm: (password: string) => new Promise(resolve => { }),
  passwords: []
});

export const useRealm = () => {
  return useContext(RealmContext);
};

const RealmProvider = ({ children }: RealmProviderProps) => {
  const [realm, setRealm] = useState<Realm | null>(null);

  const subscriptionRef = useRef<Realm.Results<Password> | null>(null);
  const [passwords, setPasswords] = useState<Realm.Results<Password> | []>([]);

  const openRealm = async (password: string): Promise<void> => {

    for (var bytes = [], c = 0; c < password.length; c += 2) {
      bytes.push(parseInt(password.substr(c, 2), 16));
    }

    const config: Realm.Configuration = {
      schema: [Password.schema],
      encryptionKey: new Int8Array(bytes)
    };

    const realm = await Realm.open(config);
    const passwordResult: Realm.Results<Password> = realm.objects('Password');
    subscriptionRef.current = passwordResult;
    passwordResult.addListener((/*collection, changes*/) => {
      setPasswords(realm.objects('Password'));
    });

    setRealm(realm);
  };

  const closeRealm = useCallback((): void => {
    const subscription = subscriptionRef.current;
    subscription?.removeAllListeners();
    subscriptionRef.current = null;

    realm?.close();
    setRealm(null);
  }, [realm]);

  useEffect(() => {
    return closeRealm;
  }, []);

  return (
    <RealmContext.Provider value={{
      realm,
      openRealm,
      passwords
    }}>{children}</RealmContext.Provider>
  );
};

export default RealmProvider;