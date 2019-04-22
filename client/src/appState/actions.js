import {
  FETCH_PLAYERS_SUCCESS,
  EDIT_PLAYER_SUCCESS,
  ADD_TOAST,
  REMOVE_TOAST,
} from './constants';

export function fetchPlayersSuccess(data) {
  return { type: FETCH_PLAYERS_SUCCESS, payload: { data } };
}

export function editPlayerSuccess(player) {
  return { type: EDIT_PLAYER_SUCCESS, payload: { player } };
}

export function addToast(options) {
  return { type: ADD_TOAST, payload: { options } };
}

export function removeToast(id) {
  return { type: REMOVE_TOAST, payload: { id } };
}
