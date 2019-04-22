import { FETCH_PLAYERS_SUCCESS, EDIT_PLAYER_SUCCESS } from './constants';

const initialState = {
  players: [],
  total: 0,
};

export default function players(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS_SUCCESS:
      return {
        ...state,
        players: action.payload.data.players,
        total: action.payload.data.total,
      };
    case EDIT_PLAYER_SUCCESS:
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.player.id
            ? action.payload.player
            : player
        ),
      };
    default:
      return state;
  }
}
