import {
  FETCH_PLAYERS_SUCCESS,
  CREATE_PLAYER_SUCCESS,
  DELETE_PLAYER_SUCCESS,
} from './constants';

export default function playerIds(state = [], action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return action.payload.data.players.map(player => player.id);
    case CREATE_PLAYER_SUCCESS:
      return state.concat([action.payload.player.id]);
    case DELETE_PLAYER_SUCCESS:
      return state.filter(playerId => playerId !== action.payload.id);
    default:
      return state;
  }
}
