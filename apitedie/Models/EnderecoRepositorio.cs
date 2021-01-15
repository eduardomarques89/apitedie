using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class EnderecoRepositorio : IEnderecoRepositorio
    {
        private List<Enderecos> enderecos = new List<Enderecos>();

        public EnderecoRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select idcliente, idendereco, endereco, bairro, cidade, uf, num, complemento, cep,
                    contato, referencia, latitude, longitude, padrao from app_endereco
                    order by datacadastro desc"))
            {
                while (reader.Read())
                {
                    Add(new Enderecos
                    {
                        IdCliente = Convert.ToInt32(reader["idcliente"]),
                        IdEndereco = Convert.ToInt32(reader["idendereco"]),
                        Endereco = reader["endereco"].ToString(),
                        Bairro = reader["bairro"].ToString(),
                        CEP = reader["cep"].ToString(),
                        Num = reader["num"].ToString(),
                        Cidade = reader["cidade"].ToString(),
                        UF = reader["uf"].ToString(),
                        Complemento = reader["complemento"].ToString(),
                        Latitude = Convert.ToDouble(reader["latitude"]),
                        Longitude = Convert.ToDouble(reader["longitude"]),
                        Padrao = reader["padrao"].ToString()
                    });
                }
            }
        }

        public Enderecos Add(Enderecos item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            enderecos.Add(item);
            return item;
        }

        public Enderecos Get(int id)
        {
            return enderecos.Find(p => p.IdCliente == id);
        }

        public IEnumerable<Enderecos> GetAll()
        {
            return enderecos;
        }

        public void Remove(int id)
        {
            enderecos.RemoveAll(p => p.IdCliente == id);
        }

        public bool Update(Enderecos item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = enderecos.FindIndex(p => p.IdCliente == item.IdCliente);

            if (index == -1)
            {
                return false;
            }
            enderecos.RemoveAt(index);
            enderecos.Add(item);
            return true;
        }
    }
}