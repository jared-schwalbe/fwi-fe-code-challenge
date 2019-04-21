import { combineReducers } from 'redux';

import playerIds from './playerIds';
import players from './players';
import totalPlayers from './totalPlayers';
import toaster from './toaster';

export default combineReducers({
  playerIds,
  players,
  totalPlayers,
  toaster,
});
