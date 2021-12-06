import React, {useCallback, useEffect} from 'react';
import {useState} from 'react';
import Realm from 'realm';
import {createContext, useContext} from 'react';
import Password from './schemas/Password';

type RealmProviderProps = {
  children: React.ReactNode;
};

export const RealmContext = createContext<Realm | null>(null);

export const useRealm = () => {
  return useContext(RealmContext);
};

const RealmProvider = ({children}: RealmProviderProps) => {
  const [realm, setRealm] = useState<Realm | null>(null);

  const openRealm = useCallback(async (): Promise<void> => {
    try {
      const config = {
        schema: [Password.schema],
      };

      const realm = await Realm.open(config);
      setRealm(realm);

    } catch (err) {
      console.error('Error opening realm: ', err.message);
    }
  }, [realm]);

  const closeRealm = useCallback((): void => {
    realm?.close();
    setRealm(null);
  }, [realm]);

  useEffect(() => {
    openRealm();

    // Return a cleanup callback to close the realm to prevent memory leaks
    return closeRealm;
  }, [openRealm, closeRealm]);

  return (
    <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
  );
};

export default RealmProvider;