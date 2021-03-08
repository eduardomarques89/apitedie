export const convergeCep = (local) => {
    if (local.CEP != undefined && local.CEP != "") {
        return local.CEP.replace("-", "")
    }
    else {
        try {
            return (local.results[0]?.address_components.filter(ac => ac.types.filter(ty => ty == "postal_code")?.length > 0)[0]?.short_name ?? "").replace("-", "")
        } catch (e) {
            console.log(e)
            debugger
        }
    }
}