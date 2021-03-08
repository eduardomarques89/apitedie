const initialValues={
    id:null,
    token:null,
    cardDefault:null,
    addressDefault:null,
    selectedCompany:null,
}

export default function userReducer(state = initialValues,action){
    switch (action.type){
        case "ADD_CARD_DEFAULT":
            return state;
        
        case "ADD_ADDRESS_DEFAULT":
            return state;
        
        case "ADD_SELECTED_COMPANY":
            return state ;

        case "ADD_USER_SESSION":
            return state;
        
        case "REMOVE_USER_SESSION":
            return state;
        default:
            return state
    }
}

 