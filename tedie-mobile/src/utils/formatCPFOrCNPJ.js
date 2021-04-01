function formatCPFOrCNPJ(value, oldValue) {
  let newValue = value.match(/\d+/g)?.join('') || '';
  const { length } = newValue;
  newValue = newValue.replace(/\D/g, '');
  newValue = newValue.replace(/^(\d{3})(\d)/g, '$1.$2');
  newValue = newValue.replace(/(\d{3}).(\d{3})(\d)/g, '$1.$2.$3');
  newValue = newValue.replace(/(\d{3}).(\d{3}).(\d{3})(\d)/g, '$1.$2.$3-$4');
  newValue = newValue.replace(
    /(\d{2})(\d{1}).(\d{2})(\d{1}).(\d{2})(\d{1})-(\d{2})(\d)/g,
    '$1.$2$3.$4$5/$6$7$8',
  );
  newValue = newValue.replace(
    /(\d{2}).(\d{1})(\d{2}).(\d{1})(\d{2})\/(\d{4})(\d)/g,
    '$1.$2$3.$4$5/$6-$7',
  );
  if (length > 14) {
    return oldValue;
  }
  return newValue;
}

export default formatCPFOrCNPJ;
