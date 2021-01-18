using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class CategoriaRepositorio : ICategoriaRepositorio
    {
        private List<Categorias> categorias = new List<Categorias>();
        private int _nextId = 1;

        public CategoriaRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select distinct p.idempresa, p.idcategoria, nomecategoria, icone from APP_PRODUTO p
                    join APP_CATEGORIA c on c.IDCATEGORIA = p.IDCATEGORIA and p.status = 'A'
                    where c.STATUS = 'A'
                    order by NOMECATEGORIA"))
            {
                while (reader.Read())
                {
                    Add(new Categorias { IdEmpresa = Convert.ToInt32(reader["idempresa"].ToString()), IdCategoria = Convert.ToInt16(reader["idcategoria"].ToString()), NomeCategoria = reader["nomecategoria"].ToString(), Icone = reader["icone"].ToString() });
                }
            } 
        }

        public Categorias Get(int id)
        {
            return categorias.Find(p => p.IdEmpresa == id);
        }

        public Categorias Add(Categorias item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.IdEmpresa = _nextId++;
            categorias.Add(item);
            return item;
        }


        public IEnumerable<Categorias> GetAll()
        {
            return categorias;
        }
    }
}