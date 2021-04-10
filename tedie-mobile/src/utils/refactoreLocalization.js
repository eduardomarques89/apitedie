export default function refactoreLocalization(local) {
  const UF = local.address_components.find((object) => object.types.includes('administrative_area_level_1'))?.short_name || '';
  const Cidade = local.address_components.find((object) => object.types.includes('administrative_area_level_2'))?.long_name || '';
  const Bairro = local.address_components.find((object) => object.types.includes('sublocality_level_1'))?.long_name || '';
  const Num = local.address_components.find((object) => object.types.includes('street_number'))?.short_name || 0;
  const Endereco = local.formatted_address || '';
  const cep = local.address_components.find((object) => object.types.includes('postal_code'))?.short_name || '';
  return {
    Cidade,
    UF,
    Num,
    Bairro,
    Endereco,
    CEP: cep,
    Latitude: local.geometry.location.lat,
    Longitude: local.geometry.location.lng,
    IdEndereco: local.place_id,
    Padrao: 'N',
    notExist: true,
  };
}
