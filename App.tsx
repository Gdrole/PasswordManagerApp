
import React from 'react';
import RealmProvider from 'src/modules/db/RealmProvider';
import { AppNavigator } from 'src/navigation/AppNavigator';

const App = () => {
  return (
    <RealmProvider>
      <AppNavigator />
    </RealmProvider>
  );
};

export default App;
