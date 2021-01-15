using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private List<Produtos> produtos = new List<Produtos>();
        private int _nextId = 1;

        public UsuarioRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"SELECT *from APP_CLIENTE "))
            {
                //Add(new Usuario { Id = Convert.ToInt32(reader["idproduto"].ToString()), });
            }
        }

        public Usuario Add(Usuario item)
        {
            throw new NotImplementedException();
        }

        public Usuario Get(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Usuario> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Remove(int id)
        {
            throw new NotImplementedException();
        }

        public bool Update(Usuario item)
        {
            throw new NotImplementedException();
        }
    }
}