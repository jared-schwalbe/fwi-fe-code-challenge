import { FETCH_PLAYERS_SUCCESS, DELETE_PLAYER_SUCCESS } from './constants';

export function fetchPlayersSuccess(data) {
  return { type: FETCH_PLAYERS_SUCCESS, payload: { data } };
}

export function deletePlayerSuccess(id) {
  return { type: DELETE_PLAYER_SUCCESS, payload: { id } };
}
