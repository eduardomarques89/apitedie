import * as Yup from 'yup'

export default Yup.object({
    cartão:Yup.string().required(),
    endereco:Yup.string().required()
})