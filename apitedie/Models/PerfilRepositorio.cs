
using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class PerfilRepositorio : IPerfilRepositorio
    {
        private List<Perfil> perfil = new List<Perfil>();
        private int _nextId = 1;

        public PerfilRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"SELECT * from APP_CLIENTE "))
            {
                while (reader.Read())
                {
                    Add(new Perfil { IdCliente = Convert.ToInt32(reader["IDCLIENTE"].ToString()), 
                        NomeCliente = reader["NOMECLIENTE"].ToString(), 
                        Apelido = reader["APELIDO"].ToString(), 
                        DataNascimento = Convert.ToDateTime(reader["DATANASC"].ToString()), 
                        Telefone1 = reader["TELEFONE1"].ToString(), 
                        Telefone2 = reader["TELEFONE2"].ToString(),  
                        Email = reader["email"].ToString(), 
                        Cpf = reader["CPF"].ToString(), 
                        Status = reader["CPF"].ToString(),
                        DataCadastro = Convert.ToDateTime(reader["CPF"].ToString()),
                        Senha = reader["SENHA"].ToString(),
                        CodigoIndicacao = reader["codigo_indicacao"].ToString(),
                        SobreNome = reader["sexo"].ToString(),
                        Sexo = reader["sexo"].ToString(),
                        Endereco = reader["endereco"].ToString(),
                        Bairro = reader["bairro"].ToString(),
                        Cidade = reader["cidade"].ToString(),
                        Uf = reader["uf"].ToString(),
                        Num = reader["num"].ToString(),
                        Complemento = reader["complemento"].ToString(),
                        Cep = reader["cep"].ToString()
                    });
                }
            }
        }

        public Perfil Add(Perfil item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.IdCliente = _nextId++;
            perfil.Add(item);
            return item;
        }

        public Perfil Get(int id)
        {
            return perfil.Find(p => p.IdCliente == id);
        }

        public IEnumerable<Perfil> GetAll()
        {
            return perfil;
        }

        public void Remove(int id)
        {
            perfil.RemoveAll(p => p.IdCliente == id);
        }

        public bool Update(Perfil item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = perfil.FindIndex(p => p.IdCliente == item.IdCliente);

            if (index == -1)
            {
                return false;
            }
            perfil.RemoveAt(index);
            perfil.Add(item);
            return true;
        }
    }
}