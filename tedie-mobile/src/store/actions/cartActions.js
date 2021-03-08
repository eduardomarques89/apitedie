const cartActions = {
    addProduct(product,idCompany){
        return {type:"ADD_PRODUCT", product,idCompany}
    },
    removeProduct(productId,idCompany){
        return {type:"REMOVE_PRODUCT", id:productId,idCompany}
    },
    addProductQuantity(productId,idCompany){
        return {type:"ADD_PRODUCT_QUANTITY", id:productId,idCompany}
    },
    removeProductQuantity(productId,idCompany){
        return {type:"REMOVE_PRODUCT_QUANTITY", id:productId,idCompany}
    },
    addSelectCompany(companyId,name){
        return {type:"ADD_SELECT_COMPANY", id:companyId,name}
    }
}

export default cartActions