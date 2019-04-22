import { combineReducers } from 'redux';

import players from './players';
import toaster from './toaster';

export default combineReducers({
  players,
  toaster,
});
