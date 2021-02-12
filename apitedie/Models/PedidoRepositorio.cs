using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class PedidoRepositorio : IPedidoRepositorio
    {
        private List<Pedidos> Pedidos = new List<Pedidos>();

        public PedidoRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select p.idcliente, p.numero_pedido, data, p.valor, desconto, taxa, c.descricao as cupom, te.TIPOENTREGA, ds.DIASEMANA, h.HORARIO, p.STATUS,
                    e.ENDERECO, e.BAIRRO, e.CIDADE, e.UF, e.cep, e.num, e.COMPLEMENTO, fp.FORMAPAGAMENTO, p.QTDEPARCELA, p.OBSERVACAO, sc.SCORE from APP_PEDIDO p
                    left join APP_CUPOM_CLIENTE cc on cc.IDCLIENTE = p.IDCLIENTE and cc.IDCUPOM = p.IDCUPOM
                    join APP_CUPOM c on c.IDCUPOM = cc.IDCUPOM and c.IDEMPRESA = p.IDEMPRESA
                    join APP_TIPOENTREGA te on te.IDTIPOENTREGA = p.IDTIPOENTREGA
                    join APP_DIASEMANA ds on ds.IDDIASEMANA = p.IDDIASEMANA
                    join APP_HORARIO h on h.IDHORARIO = p.IDHORARIO
                    join APP_ENDERECO e on e.IDCLIENTE = p.IDCLIENTE and e.IDENDERECO = p.IDENDERECO
                    join APP_FORMAPAGAMENTO fp on fp.IDFORMAPAGAMENTO = p.IDFORMAPAGAMENTO
                    left join APP_SCORE sc on sc.NUMERO_PEDIDO = p.NUMERO_PEDIDO"))
            {
                while (reader.Read())
                {
                    Add(new Pedidos
                    {
                        IdCliente = Convert.ToInt32(reader["idcliente"].ToString()),
                        NumeroPedido = reader["numeropedido"].ToString(),
                        Data = Convert.ToDateTime(reader["data"].ToString()),
                        Valor = Convert.ToDouble(reader["valor"].ToString()),
                        Taxa = Convert.ToDouble(reader["taxa"].ToString()),
                        Desconto = Convert.ToDouble(reader["desconto"].ToString()),
                        Cupom = reader["cupom"].ToString(),
                        TipoEntrega = reader["tipoentrega"].ToString(),
                        DiaSemana = reader["diasemana"].ToString(),
                        Horario = reader["horario"].ToString(),
                        Status = reader["status"].ToString(),
                        Endereco = reader["endereco"].ToString(),
                        Bairro = reader["bairro"].ToString(),
                        CEP = reader["cep"].ToString(),
                        Num = reader["num"].ToString(),
                        Cidade = reader["cidade"].ToString(),
                        UF = reader["uf"].ToString(),
                        Complemento = reader["complemento"].ToString(),
                        FormaPagamento = reader["formapagamento"].ToString(),
                        QtdeParcela = Convert.ToInt16(reader["qtdeparcela"].ToString()),
                        Observacao = reader["observacao"].ToString(),
                        Score = Convert.ToDouble(reader["score"].ToString())
                    });
                }
            }
        }

        public Pedidos Add(Pedidos item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            Pedidos.Add(item);
            return item;
        }

        public void Insere(Pedidos c)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand(
                " INSERT INTO APP_PEDIDO (IdCliente, Numero_Pedido, Data, Valor, Taxa, Desconto, IdCupom, IdTipoEntrega, " +
                " IdDiaSemana, IdHorario, IdEndereco, IdCartao, IdFormaPagamento, QtdeParcela, Observacao) " +
                " VALUES (@IdCliente, @Numero_Pedido, @Data, @Valor, @Taxa, @Desconto, @IdCupom, @IdTipoEntrega, " +
                " @IdDiaSemana, @IdHorario, @IdEndereco, @IdCartao, @IdFormaPagamento, @QtdeParcela, @Observacao) ", _conn);

            _comandoSQL.Parameters.AddWithValue("@IdCliente", c.IdCliente);
            _comandoSQL.Parameters.AddWithValue("@Numero_Pedido", c.NumeroPedido);
            _comandoSQL.Parameters.AddWithValue("@Data", c.Data);
            _comandoSQL.Parameters.AddWithValue("@Valor", c.Valor);
            _comandoSQL.Parameters.AddWithValue("@Taxa", c.Taxa);
            _comandoSQL.Parameters.AddWithValue("@Desconto", c.Desconto);
            _comandoSQL.Parameters.AddWithValue("@IdCupom", c.IdCupom);
            _comandoSQL.Parameters.AddWithValue("@IdTipoEntrega", c.IdTipoEntrega);
            _comandoSQL.Parameters.AddWithValue("@IdDiaSemana", c.IdDiaSemana);
            _comandoSQL.Parameters.AddWithValue("@IdHorario", c.IdHorario);
            _comandoSQL.Parameters.AddWithValue("@IdEndereco", c.IdEndereco);
            _comandoSQL.Parameters.AddWithValue("@IdCartao", c.IdCartao);
            _comandoSQL.Parameters.AddWithValue("@IdFormaPagamento", c.IdFormaPagamento);
            _comandoSQL.Parameters.AddWithValue("@QtdeParcela", c.QtdeParcela);
            _comandoSQL.Parameters.AddWithValue("@Observacao", c.Observacao);

            //_comandoSQL = new SqlCommand(
            //   " INSERT INTO APP_PEDIDO_ITEM (IdProduto, NumeroPedido, QTDE, Valor) " +
            //   " VALUES (@IdProduto, @NumeroPedido, @QTDE, @Valor) ", _conn);
            //_comandoSQL.Parameters.AddWithValue("@IdProduto", c.IdCliente);
            //_comandoSQL.Parameters.AddWithValue("@NumeroPedido", c.IdCliente);
            //_comandoSQL.Parameters.AddWithValue("@QTDE", c.IdCliente);
            //_comandoSQL.Parameters.AddWithValue("@Valor", c.IdCliente);

            try
            {
                _conn.Open();
                _comandoSQL.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _conn.Close();
            }
        }

        public void AvaliarPedido(int id, int nota, string observacao)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("INSERT INTO APP_SCORE " +
                " (NUMERO_PEDIDO, SCORE, OBSERVACAO) VALUES (@ID, @SCORE, @OBSERVACAO)", _conn);
            _comandoSQL.Parameters.AddWithValue("@ID", id);
            _comandoSQL.Parameters.AddWithValue("@SCORE", nota);
            _comandoSQL.Parameters.AddWithValue("@OBSERVACAO", observacao);
            try
            {
                _conn.Open();
                int affectedRows = _comandoSQL.ExecuteNonQuery();
                if (affectedRows > 0)
                {
                    return;
                }
                else
                    throw new Exception("Não foi possível avaliar o pedido.");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _conn.Close();
            }
        }

        public Pedidos Get(string id)
        {
            return Pedidos.Find(p => p.NumeroPedido == id);
        }

        public IEnumerable<Pedidos> GetAll()
        {
            return Pedidos;
        }

        public void Update(Pedidos item)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("UPDATE APP_PEDIDO SET status = 'F' WHERE numero_pedido = @numeroPedido", _conn);
            _comandoSQL.Parameters.AddWithValue("@numeroPedido", Convert.ToInt32(item.NumeroPedido)); // TODO verificar se precisa fazer conversão para int32
            try
            {
                _conn.Open();
                int affectedRows = _comandoSQL.ExecuteNonQuery();
                if (affectedRows > 0) return;
                else throw new Exception("Número de pedido não encontrado ou já foi feito checkout.");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _conn.Close();
            }
        }
    }
}
