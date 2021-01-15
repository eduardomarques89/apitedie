using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class CupomRepositorio : ICupomRepositorio
    {
        private List<Cupons> Cupons = new List<Cupons>();
        private int _nextId = 1;

        public CupomRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select NOME_FANTASIA, c.IDCUPOM, c.DESCRICAO, c.CODIGO, c.STATUS, case when c.TIPO = 'C' then 'Cliente' when c.TIPO = 'G' then 'GERAL' else 'ND' end as tipo_cupom,
                    c.DATA_INICIO, c.DATA_FIM, c.BENEFICIO, C.VALOR, c.QTDE_CLIENTE, c.QTDE_GERAL from app_cupom c
                    left join app_cupom_cliente cc on cc.IDCUPOM = c.IDCUPOM and c.TIPO = 'C'
                    join APP_EMPRESA e on e.IDEMPRESA = c.IDEMPRESA"))
            {
                while (reader.Read())
                {
                    Add(new Cupons { IdCupom = Convert.ToInt32(reader["idCupom"].ToString()), NomeCupom = reader["descricao"].ToString(), NomeEmpresa = reader["nome_fantasia"].ToString(), Codigo = reader["codigo"].ToString(), Tipo = reader["tipo_cupom"].ToString(), Inicio = Convert.ToDateTime(reader["data_inicio"].ToString()), Final = Convert.ToDateTime(reader["data_fim"].ToString()), Beneficio = reader["beneficio"].ToString(), Valor = Convert.ToDouble(reader["valor"].ToString()), Qtde_Geral = Convert.ToInt16(reader["qtde_geral"].ToString()), Qtde_Cliente = Convert.ToInt16(reader["qtde_cliente"].ToString()), Status = reader["status"].ToString() });
                }
            }
        }

        public Cupons Add(Cupons item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.IdCupom = _nextId++;
            Cupons.Add(item);
            return item;
        }

        public Cupons Get(int id)
        {
            return Cupons.Find(p => p.IdCupom == id);
        }

        public IEnumerable<Cupons> GetAll()
        {
            return Cupons;
        }

        public void Remove(int id)
        {
            Cupons.RemoveAll(p => p.IdCupom == id);
        }

        public bool Update(Cupons item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = Cupons.FindIndex(p => p.IdCupom == item.IdCupom);

            if (index == -1)
            {
                return false;
            }
            Cupons.RemoveAt(index);
            Cupons.Add(item);
            return true;
        }
    }
}