import ACTIONS from "../actions";


const initialState = {
    users: [],
    isLogged: false,
    isAdmin: false,
}

const authReducer = (state = initialState, action) => {
    return action.type ===  ACTIONS.LOGIN ? {...state, isLogged: true,} : state;
}

export  default  authReducer