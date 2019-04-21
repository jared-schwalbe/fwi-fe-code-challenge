import {
  FETCH_PLAYERS_SUCCESS,
  EDIT_PLAYER_SUCCESS,
  DELETE_PLAYER_SUCCESS,
} from './constants';

export function fetchPlayersSuccess(data) {
  return { type: FETCH_PLAYERS_SUCCESS, payload: { data } };
}

export function editPlayerSuccess(player) {
  return { type: EDIT_PLAYER_SUCCESS, payload: { player } };
}

export function deletePlayerSuccess(id) {
  return { type: DELETE_PLAYER_SUCCESS, payload: { id } };
}
