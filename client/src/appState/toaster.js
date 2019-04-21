import { ADD_TOAST, REMOVE_TOAST } from './constants';

const initialState = {
  nextToastId: 0,
  toasts: [],
};

export default function toaster(state = initialState, action) {
  switch (action.type) {
    case ADD_TOAST:
      return {
        nextToastId: state.nextToastId + 1,
        toasts: [
          ...state.toasts,
          {
            ...action.payload.options,
            id: state.nextToastId,
          },
        ],
      };
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(({ id }) => action.payload.id !== id),
      };
    default:
      return state;
  }
}
