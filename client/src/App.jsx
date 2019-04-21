import React, { Fragment } from 'react';

import Header from './Header/Header';
import PlayerTable from './PlayerTable/PlayerTable';
import Toaster from './Toaster';

const App = () => {
  return (
    <Fragment>
      <Toaster />
      <Header />
      <PlayerTable />
    </Fragment>
  );
};

export default App;
