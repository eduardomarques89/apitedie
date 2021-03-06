﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class ProdutoRepositorio : IProdutoRepositorio
    {
        private List<Produtos> produtos = new List<Produtos>();

        public ProdutoRepositorio()
        {
            /* 
             * O produto com promoção é identificado pela tabela APP_OFERTA, 
             * e não mais pelo campo VALOR_PROMOCIONAL em APP_PRODUTO_ATACADO.
             */
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"SELECT EL.CEP_INICIAL,EL.CEP_FINAL,P.IDPRODUTO, P.IDEMPRESA, P.NOME_ABREV, P.DESCRICAO, P.IMAGEM, P.CODIGO_BARRAS, P.STATUS, U.ABREVIACAO, P.PONTOS,
                    C.NOMECATEGORIA, C.idcategoria, P.QTDEPADRAO, PA.QTDEINICIAL, PA.QTDEFINAL, PA.VALOR FROM APP_PRODUTO P
                    JOIN APP_UNIDADE U ON U.IDUNIDADE = P.IDUNIDADE
                    JOIN APP_CATEGORIA C ON C.IDCATEGORIA = P.IDCATEGORIA
                    LEFT JOIN APP_PRODUTO_BASE PB ON PB.CODIGO_BARRAS = P.CODIGO_BARRAS
                    LEFT JOIN APP_EMPRESA_LOGISTICA EL ON EL.IDEMPRESA = P.IDEMPRESA
                    JOIN APP_PRODUTO_ATACADO PA ON PA.IDPRODUTO = P.IDPRODUTO ORDER BY P.NOME_ABREV"))
            {
                while (reader.Read())
                {
                    var idProduto = Convert.ToInt32(reader["idproduto"]);
                    var cons = string.Format(@"SELECT IDPRODUTO, SUM(QTDEENTRADA) - (SUM(QTDESAIDA) - SUM(QTDECARRINHO)) AS QTDEESTOQUE FROM (
                            SELECT IDPRODUTO, 0 AS QTDESAIDA, SUM(QTDE) AS QTDEENTRADA, 0 AS QTDECARRINHO FROM APP_ESTOQUE 
                            WHERE TIPO = 'E' AND IDPRODUTO = {0}
                            GROUP BY IDPRODUTO
                            UNION ALL
                            SELECT IDPRODUTO, SUM(QTDE) AS QTDESAIDA, 0 AS QTDEENTRADA, 0 AS QTDECARRINHO FROM APP_ESTOQUE
                            WHERE TIPO = 'S' AND IDPRODUTO = {0}
                            GROUP BY IDPRODUTO
                            UNION ALL
                            SELECT IDPRODUTO, 0 AS QTDESAIDA, 0 AS QTDEENTRADA, SUM(QTDE) AS QTDECARRINHO FROM APP_PEDIDO P
                            LEFT JOIN APP_PEDIDO_ITEM I ON I.NUMERO_PEDIDO = P.NUMERO_PEDIDO
                            WHERE I.STATUS = 'P' AND IDEMPRESA = {0} AND IDPRODUTO = {0}
                            GROUP BY IDPRODUTO) AS TAB
                            GROUP BY IDPRODUTO", idProduto);
                    using (IDataReader readerestoque = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                        cons))
                    {
                        if (readerestoque.Read())
                        {
                            Add(new Produtos
                            {
                                Id = idProduto,
                                IdEmpresa = Convert.ToInt32(reader["idempresa"]),
                                Nome = reader["nome_abrev"].ToString(),
                                Descricao = reader["descricao"].ToString(),
                                Categoria = reader["nomecategoria"].ToString(),
                                IdCategoria = reader["idcategoria"].ToString() == "" ? 0 : Convert.ToInt32(reader["idcategoria"]),
                                Codigo_Barras = reader["codigo_barras"]?.ToString(),
                                Preco_De = Convert.ToDouble(reader["valor"]),
                                Imagem = reader["imagem"].ToString(),
                                QtdePadrao = reader["qtdepadrao"].ToString() == "" ? 0 : Convert.ToDouble(reader["qtdepadrao"]),
                                UnidadeMedida = reader["abreviacao"].ToString(),
                                Estoque = Convert.ToDouble(readerestoque["qtdeestoque"]),
                                Status = reader["status"]?.ToString(),
                                Pontos = reader["pontos"].ToString() == "" ? 0 : Convert.ToDouble(reader["pontos"]),
                                Qtde_Inicial = reader["qtdeinicial"].ToString() == "" ? 0 : Convert.ToDouble(reader["qtdeinicial"]),
                                Qtde_Final = reader["qtdefinal"].ToString() == "" ? 0 : Convert.ToDouble(reader["qtdefinal"]),
                                CEPFinal = reader["cep_final"].ToString() == "" ? 0 : Convert.ToInt32(reader["cep_final"]),
                                CEPInicial = reader["cep_inicial"].ToString() == "" ? 0 : Convert.ToInt32(reader["cep_inicial"]),
                            });
                        }
                    }
                }
            }

            // Adiciona ofertas
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("SELECT * FROM APP_OFERTA WHERE CONVERT(date, DATA_INICIO) <= CONVERT(date, GETDATE()) " +
                "AND CONVERT(date, DATA_FIM) >= CONVERT(date, GETDATE())", _conn);
            List<Produtos> produtosComOfertas = produtos;
            _conn.Open();
            var dr = _comandoSQL.ExecuteReader();
            while (dr.Read())
            {
                int idProduto2 = Convert.ToInt32(dr["idproduto"]);
                produtos.Where(p => p.Id == idProduto2).ToList().ForEach(pa =>
                {
                    if (pa.Ofertas == null)
                        pa.Ofertas = new List<Ofertas>();
                    pa.Ofertas.Add(new Ofertas
                    {
                        IdOferta = Convert.ToInt32(dr["idoferta"]),
                        Data_inicio = dr["data_inicio"].ToString(),
                        Data_fim = dr["data_fim"].ToString(),
                        Valor = dr["valor"].ToString() == "" ? 0 : Convert.ToDouble(dr["valor"]),
                        ValorPromocional = dr["valor_promocional"].ToString() == "" ? 0 : Convert.ToDouble(dr["valor_promocional"]),
                        Status = dr["status"].ToString(),
                    });
                });
            }
        }

        public Produtos Add(Produtos item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            produtos.Add(item);
            return item;
        }

        public Produtos Get(int id)
        {
            return produtos.Find(p => p.Id == id);
        }

        public IEnumerable<Produtos> GetAll()
        {
            return produtos;
        }

        public Produtos GetProdutosPorCategoria(string categoria)
        {
            return produtos.Find(p => p.Categoria == categoria);
        }

        public void Remove(int id)
        {
            produtos.RemoveAll(p => p.Id == id);
        }

        public bool Update(Produtos item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = produtos.FindIndex(p => p.Id == item.Id);

            if (index == -1)
            {
                return false;
            }
            produtos.RemoveAt(index);
            produtos.Add(item);
            return true;
        }
    }
}
