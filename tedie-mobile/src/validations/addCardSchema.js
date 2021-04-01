import * as Yup from 'yup';

export default Yup.object().shape({
  Numero: Yup.string()
    .matches(/^(\d{4})\s(\d{4})\s(\d{4})\s(\d{4})/g, 'error')
    .required(),
  Titular: Yup.string().required(),
  CPF: Yup.string()
    .matches(
      /(\d{3}.\d{3}.\d{3}-\d{2})|(\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})/g,
      'error',
    )
    .required(),
  Validade: Yup.string()
    .matches(/^(\d{2})\/(\d{2})/g, 'error')
    .required(),
  CVV: Yup.string().min(3, 'error').max(3, 'error').required(),
});
