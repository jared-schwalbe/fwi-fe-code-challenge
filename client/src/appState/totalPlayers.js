import {
  FETCH_PLAYERS_SUCCESS,
  CREATE_PLAYER_SUCCESS,
  DELETE_PLAYER_SUCCESS,
} from './constants';

export default function totalPlayers(state = 0, action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return action.payload.data.total;
    case CREATE_PLAYER_SUCCESS:
      return state++;
    case DELETE_PLAYER_SUCCESS:
      return state--;
    default:
      return state;
  }
}
