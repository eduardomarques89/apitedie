using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class EmpresaRepositorio : IEmpresaRepositorio
    {
        private List<Empresas> empresas = new List<Empresas>();
        private int _nextId = 1;

        public EmpresaRepositorio(int idempresa)
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select E.IDEMPRESA, E.STATUS, E.NOME_FANTASIA, ENDERECO, BAIRRO, NUM, CIDADE, UF, LOGO, SCORE, LATITUDE, LONGITUDE, CEP, TIPOENTREGA from app_empresa e
                    join APP_EMPRESA_TIPOENTREGA Etp on e.idempresa = Etp.IDEMPRESA AND ETP.STATUS = 'A'
                    join APP_TIPOENTREGA TP ON TP.IDTIPOENTREGA = Etp.IDTIPOENTREGA AND TP.STATUS = 'A'
                    LEFT JOIN APP_EMPRESA_LOGISTICA LG ON LG.IDEMPRESA = E.IDEMPRESA AND LG.STATUS = 'A'
                    --WHERE '13870410' > CEP_INICIAL AND '13870410' < CEP_FINAL
                    ORDER BY SCORE DESC"))
            {
                //se o colaborador selecionado existir no banco dados avaliacao_colaborador,
                //dá uma mensagem de erro informando que o colaborador já está cadastrado
                while (reader.Read())
                {
                    Add(new Empresas { IdEmpresa = Convert.ToInt32(reader["idempresa"].ToString()), Nome = reader["nome_fantasia"].ToString(), Endereco = reader["endereco"].ToString(), Bairro = reader["bairro"].ToString(), Cidade = reader["cidade"].ToString(), Uf = reader["uf"].ToString(), Num = reader["num"].ToString(), Logo = reader["logo"].ToString(), Score = Convert.ToDouble(reader["score"].ToString()), CEP = Convert.ToInt32(reader["cep"].ToString()), Latitude = Convert.ToDouble(reader["latitude"].ToString()), Status = reader["status"].ToString(), Longitude = Convert.ToDouble(reader["longitude"].ToString()), TipoEntrega = reader["tipoentrega"].ToString() });
                }
            }

            //Add(new Empresas { IdEmpresa = 1, Nome = "Milk Moni", Cidade = "São João da Boa Vista", Score = 4.59 });
            //Add(new Empresas { IdEmpresa = 2, Nome = "Big Bom", Cidade = "São João da Boa Vista", Score = 5.75 });
            //Add(new Empresas { IdEmpresa = 3, Nome = "Sempre Vale", Cidade = "São João da Boa Vista", Score = 3.9 });
            //Add(new Empresas { IdEmpresa = 4, Nome = "Marino Loja 1", Cidade = "São João da Boa Vista", Score = 2.99 });
            //Add(new Empresas { IdEmpresa = 5, Nome = "Quinta Hiper +", Cidade = "São João da Boa Vista", Score = 6.50 });
            //Add(new Empresas { IdEmpresa = 6, Nome = "PaneGill", Cidade = "São João da Boa Vista", Score = 4.25 });
        }

        public Empresas Add(Empresas item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.IdEmpresa = _nextId++;
            empresas.Add(item);
            return item;
        }

        public Empresas Get(int id)
        {
            return empresas.Find(p => p.IdEmpresa == id);
        }

        public IEnumerable<Empresas> GetAll()
        {
            return empresas;
        }
    }
}