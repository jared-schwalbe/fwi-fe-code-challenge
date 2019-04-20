import { FETCH_PLAYERS_SUCCESS, DELETE_PLAYER_SUCCESS } from './constants';

function mergePlayers(state, { players }) {
  const newState = { ...state };
  players.forEach(player => {
    newState[player.id] = player;
  });
  return newState;
}

function removePlayer(state, id) {
  const newState = { ...state };
  delete newState[id];
  return newState;
}

export default function players(state = {}, action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return mergePlayers(state, action.payload.data);
    case DELETE_PLAYER_SUCCESS:
      return removePlayer(state, action.payload.id);
    default:
      return state;
  }
}
