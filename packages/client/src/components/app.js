import { useHistory, Switch, Route } from 'react-router-dom';
import debug from 'debug';
import React, { useState } from 'react';
import * as MUI from '@material-ui/core';
import { useAPI } from '../hooks';

import Menu from './menu';
import Toolbar from './toolbar';
import Dashboard from './dashboard';
import Coaching from './coaching';
import Submissions from './submissions';

const log = debug('turkleton:components:app');

export default function App(props) {
  const [error, user] = useAPI('/api/auth/me', []);
  const [menuOpen, setMenuOpen] = useState(false);

  if (error) {
    window.location.href = new URL(
      '/api/auth/login',
      window.location.origin
    ).toString();
  }

  log('user : %o', user);

  return (
    <>
      <Toolbar user={user} openMenu={openMenu} />
      <Menu user={user} isOpen={menuOpen} close={closeMenu} />
      <MUI.List>
        <Switch>
          <Route path="/dashboard"><Dashboard user={user} /></Route>
          <Route path="/coaches/:id"><Coaching user={user} /></Route>
          <Route path="/submissions"><Submissions user={user} /></Route>
        </Switch>
      </MUI.List>
    </>
  );

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }
}
