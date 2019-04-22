import {
  CHANGE_PAGE,
  CHANGE_PAGE_SIZE,
  CHANGE_SORT,
  BEGIN_LOADING,
  DONE_LOADING,
  FETCH_PLAYERS_SUCCESS,
  EDIT_PLAYER_SUCCESS,
} from './constants';

const initialState = {
  loading: false,
  page: 1,
  pageSize: 10,
  sortBy: null,
  sortOrder: null,
  players: [],
  total: 0,
};

export default function players(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        page: action.payload.page,
      };
    case CHANGE_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload.pageSize,
      };
    case CHANGE_SORT:
      return {
        ...state,
        sortBy: action.payload.sort.sortBy,
        sortOrder: action.payload.sort.sortOrder,
      };
    case BEGIN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case DONE_LOADING:
      return {
        ...state,
        loading: false,
      };
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
