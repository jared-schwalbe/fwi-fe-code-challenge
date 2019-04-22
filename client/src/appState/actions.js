import {
  CHANGE_PAGE,
  CHANGE_PAGE_SIZE,
  CHANGE_SORT,
  FETCH_PLAYERS_SUCCESS,
  EDIT_PLAYER_SUCCESS,
  ADD_TOAST,
  REMOVE_TOAST,
} from './constants';

const BASE_URL = 'http://localhost:3001';

export function fetchPlayers() {
  return (dispatch, getState) => {
    const { page, pageSize, sortBy, sortOrder } = getState().players;

    const size = pageSize;
    const from = pageSize * (page - 1);
    let url = `${BASE_URL}/players?size=${size}&from=${from}`;
    if (sortBy && sortOrder) {
      url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }

    const options = {
      headers: {
        Accept: 'application/json',
      },
    };

    fetch(url, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('There was an error when fetching the players list.');
        }
      })
      .then(data => {
        if (data) {
          dispatch(fetchPlayersSuccess(data));
          return data;
        } else {
          throw new Error('There was an error when fetching the players list.');
        }
      })
      .catch(error => {
        dispatch(
          addToast({
            title: 'Error',
            subtitle: error.toString(),
            kind: 'error',
          })
        );
      });
  };
}

export function createPlayer(player) {
  return (dispatch, getState) => {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(player),
    };

    fetch(`${BASE_URL}/players`, options)
      .then(response => {
        if (response.ok) {
          dispatch(
            addToast({
              title: 'Success',
              subtitle: 'New player was successfully added.',
              kind: 'success',
            })
          );
          dispatch(fetchPlayers());
          return response;
        } else {
          throw new Error('There was an error when adding a new player.');
        }
      })
      .catch(error => {
        dispatch(
          addToast({
            title: 'Error',
            subtitle: error.toString(),
            kind: 'error',
          })
        );
      });
  };
}

export function editPlayer(player) {
  return dispatch => {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(player),
    };

    fetch(`${BASE_URL}/players/${player.id}`, options)
      .then(response => {
        if (response.ok) {
          dispatch(editPlayerSuccess(player));
          dispatch(
            addToast({
              title: 'Success',
              subtitle: `Player ${player.id} was successfully updated.`,
              kind: 'success',
            })
          );
          return response;
        } else {
          throw new Error(
            `There was an error when updating player ${player.id}.`
          );
        }
      })
      .catch(error => {
        dispatch(
          addToast({
            title: 'Error',
            subtitle: error.toString(),
            kind: 'error',
          })
        );
      });
  };
}

export function deletePlayer(id) {
  return (dispatch, getState) => {
    const { players, page } = getState().players;

    fetch(`${BASE_URL}/players/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          dispatch(
            addToast({
              title: 'Success',
              subtitle: `Player ${id} was successfully deleted.`,
              kind: 'success',
            })
          );
          if (players.length <= 1 && page > 1) {
            dispatch(changePage(page - 1));
          }
          dispatch(fetchPlayers());
          return response;
        } else {
          throw new Error(`There was an error when deleting player ${id}.`);
        }
      })
      .catch(error => {
        dispatch(
          addToast({
            title: 'Error',
            subtitle: error.toString(),
            kind: 'error',
          })
        );
      });
  };
}

export function changePage(page) {
  return { type: CHANGE_PAGE, payload: { page } };
}

export function changePageSize(pageSize) {
  return { type: CHANGE_PAGE_SIZE, payload: { pageSize } };
}

export function changeSort(sort) {
  return { type: CHANGE_SORT, payload: { sort } };
}

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
