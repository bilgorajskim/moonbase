import {captureException} from 'raven-js'

// Shows error screen
export function crash () {
  return {
    type: 'CRASH'
  }
}

export function handleException (e) {
  return (dispatch, getState) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(e)
      return
    }
    captureException(e)
    dispatch(crash())
  }
}

export function toggleLoading (loading) {
  return {
    type: 'TOGGLE_LOADING',
    loading
  }
}

const defaultState = {
  loading: false,
  error: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_LOADING':
      return {
        ...state,
        loading: action.loading
      }
    case 'CRASH':
      return {
        ...state,
        error: true
      }
    default:
      return state
  }
}
