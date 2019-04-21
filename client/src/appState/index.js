import { combineReducers } from 'redux';

import playerIds from './playerIds';
import players from './players';
import totalPlayers from './totalPlayers';

export default combineReducers({
  playerIds,
  players,
  totalPlayers,
});
