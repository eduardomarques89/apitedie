import {combineReducers} from 'redux'
import cart from './cartReducer'
import user from './userReducer'

const reducers = combineReducers({
    cart,
    user
})

export default reducers