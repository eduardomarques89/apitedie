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

        public EmpresaRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select LG.CEP_INICIAL,LG.CEP_FINAL, E.IDEMPRESA, E.STATUS, E.NOME_FANTASIA, ENDERECO, BAIRRO, NUM, 
                    CIDADE, UF, LOGO, SCORE, LATITUDE, LONGITUDE, CEP from app_empresa e
                    LEFT JOIN APP_EMPRESA_LOGISTICA LG ON LG.IDEMPRESA = E.IDEMPRESA AND LG.STATUS = 'A'
                    ORDER BY SCORE DESC"))
                //@"select LG.CEP_INICIAL,LG.CEP_FINAL, E.IDEMPRESA, E.STATUS, E.NOME_FANTASIA, ENDERECO, BAIRRO, NUM, CIDADE, UF, LOGO, SCORE, LATITUDE, LONGITUDE, CEP, TIPOENTREGA from app_empresa e
                //    join APP_EMPRESA_TIPOENTREGA Etp on e.idempresa = Etp.IDEMPRESA AND ETP.STATUS = 'A'
                //    join APP_TIPOENTREGA TP ON TP.IDTIPOENTREGA = Etp.IDTIPOENTREGA AND TP.STATUS = 'A'
                //    LEFT JOIN APP_EMPRESA_LOGISTICA LG ON LG.IDEMPRESA = E.IDEMPRESA AND LG.STATUS = 'A'
                //    ORDER BY SCORE DESC"))
            {
                //se o colaborador selecionado existir no banco dados avaliacao_colaborador,
                //dá uma mensagem de erro informando que o colaborador já está cadastrado
                while (reader.Read())
                {
                    Add(new Empresas
                    {
                        IdEmpresa = Convert.ToInt32(reader["idempresa"].ToString()),
                        Nome = reader["nome_fantasia"].ToString(),
                        Endereco = reader["endereco"].ToString(),
                        Bairro = reader["bairro"].ToString(),
                        Cidade = reader["cidade"].ToString(),
                        Uf = reader["uf"].ToString(),
                        Num = reader["num"].ToString(),
                        Logo = reader["logo"].ToString(),
                        Score = Convert.ToDouble(reader["score"].ToString()),
                        CEP = Convert.ToInt32(reader["cep"].ToString()),
                        Latitude = Convert.ToDouble(reader["latitude"].ToString()),
                        Status = reader["status"].ToString(),
                        Longitude = Convert.ToDouble(reader["longitude"].ToString()),
                        //TipoEntrega = reader["tipoentrega"].ToString(),
                        CEPFinal = reader["cep_final"].ToString() == "" ? 0 : Convert.ToInt32(reader["cep_final"]),
                        CEPInicial = reader["cep_inicial"].ToString() == "" ? 0 : Convert.ToInt32(reader["cep_inicial"]),
                    });
                }
            }
        }

        // TODO a funcao de adicionar cadastra na memoria, mas não cadastra no banco de dados. É assim em toda API.
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
            return ForceGet.Find(p => p.IdEmpresa == id);
            //return empresas.Find(p => p.IdEmpresa == id);
        }

        public IEnumerable<Empresas> GetAll()
        {
            return ForceGet()
            //return empresas;
        }
        
        // Workaround para entender mudanças direto pelo banco.
        public List<Empresas> ForceGet(){
            List<Empresas> empAux = new List<Empresas>();
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select LG.CEP_INICIAL,LG.CEP_FINAL, E.IDEMPRESA, E.STATUS, E.NOME_FANTASIA, ENDERECO, BAIRRO, NUM, 
                    CIDADE, UF, LOGO, SCORE, LATITUDE, LONGITUDE, CEP from app_empresa e
                    LEFT JOIN APP_EMPRESA_LOGISTICA LG ON LG.IDEMPRESA = E.IDEMPRESA AND LG.STATUS = 'A'
                    ORDER BY SCORE DESC"))
                //@"select LG.CEP_INICIAL,LG.CEP_FINAL, E.IDEMPRESA, E.STATUS, E.NOME_FANTASIA, ENDERECO, BAIRRO, NUM, CIDADE, UF, LOGO, SCORE, LATITUDE, LONGITUDE, CEP, TIPOENTREGA from app_empresa e
                //    join APP_EMPRESA_TIPOENTREGA Etp on e.idempresa = Etp.IDEMPRESA AND ETP.STATUS = 'A'
                //    join APP_TIPOENTREGA TP ON TP.IDTIPOENTREGA = Etp.IDTIPOENTREGA AND TP.STATUS = 'A'
                //    LEFT JOIN APP_EMPRESA_LOGISTICA LG ON LG.IDEMPRESA = E.IDEMPRESA AND LG.STATUS = 'A'
                //    ORDER BY SCORE DESC"))
            {
                //se o colaborador selecionado existir no banco dados avaliacao_colaborador,
                //dá uma mensagem de erro informando que o colaborador já está cadastrado
                while (reader.Read())
                {
                    empAux.Add(new Empresas
                    {
                        IdEmpresa = Convert.ToInt32(reader["idempresa"].ToString()),
                        Nome = reader["nome_fantasia"].ToString(),
                        Endereco = reader["endereco"].ToString(),
                        Bairro = reader["bairro"].ToString(),
                        Cidade = reader["cidade"].ToString(),
                        Uf = reader["uf"].ToString(),
                        Num = reader["num"].ToString(),
                        Logo = reader["logo"].ToString(),
                        Score = Convert.ToDouble(reader["score"].ToString()),
                        CEP = Convert.ToInt32(reader["cep"].ToString()),
                        Latitude = Convert.ToDouble(reader["latitude"].ToString()),
                        Status = reader["status"].ToString(),
                        Longitude = Convert.ToDouble(reader["longitude"].ToString()),
                        //TipoEntrega = reader["tipoentrega"].ToString(),
                        CEPFinal = reader["cep_final"].ToString() == "" ? 0 : Convert.ToInt32(reader["cep_final"]),
                        CEPInicial = reader["cep_inicial"].ToString() == "" ? 0 : Convert.ToInt32(reader["cep_inicial"]),
                    });
                }
            }
            return empAux;
        }
    }
}
