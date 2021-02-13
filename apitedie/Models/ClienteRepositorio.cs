using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace apitedie.Models
{
    public class ClienteRepositorio : IClienteRepositorio
    {
        private List<Clientes> clientes = new List<Clientes>();

        public ClienteRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"select c.idcliente, c.nomecliente, c.apelido, c.datanasc, c.telefone1, c.email, c.cpf, c.sexo, c.codigo_indicacao,
                e.idendereco, e.endereco, e.bairro, e.cidade, e.uf, e.num, e.complemento, e.cep, e.latitude, e.longitude, e.padrao from app_cliente as c 
                LEFT JOIN APP_ENDERECO as e ON c.IDCLIENTE=e.IDCLIENTE;"))
            {
                Clientes cc = new Clientes();
                int idAnterior = 0;
                while (reader.Read())
                {
                    int idCliente = Convert.ToInt32(reader["idcliente"]);
                    if (idAnterior != idCliente)
                    {
                        cc = new Clientes
                        {
                            IdCliente = idCliente,
                            NomeCliente = reader["nomecliente"].ToString(),
                            Apelido = reader["apelido"].ToString(),
                            datanasc = reader["datanasc"].ToString(),
                            Telefone = reader["telefone1"].ToString(),
                            Email = reader["email"].ToString(),
                            CPF = reader["cpf"].ToString(),
                            Sexo = reader["sexo"].ToString(),
                            Codigo_Indicacao = reader["codigo_indicacao"].ToString(),
                            Enderecos = new List<Enderecos>()
                        };
                        Add(cc);
                        idAnterior = cc.IdCliente;
                    }

                    if (reader["idendereco"].ToString() == "")
                        continue;

                    cc.Enderecos.Add(
                        new Enderecos
                        {
                            IdCliente = idCliente,
                            IdEndereco = Convert.ToInt32(reader["idendereco"]),
                            Endereco = reader["endereco"].ToString(),
                            Bairro = reader["bairro"].ToString(),
                            CEP = reader["cep"].ToString(),
                            Num = reader["num"].ToString(),
                            Cidade = reader["cidade"].ToString(),
                            UF = reader["uf"].ToString(),
                            Complemento = reader["complemento"].ToString(),
                            Longitude = Convert.ToDouble(reader["longitude"]),
                            Latitude = Convert.ToDouble(reader["latitude"]),
                            Padrao = reader["padrao"].ToString(),
                        });
                }
            }
        }

        public Clientes Add(Clientes item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            clientes.Add(item);
            return item;
        }

        public void Insere(Clientes c)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("INSERT INTO APP_CLIENTE" +
                " (senha, nomecliente, apelido, datanasc, telefone1, email, " +
                " cpf, sexo, codigo_indicacao) " +
                " output INSERTED.IDCLIENTE VALUES (@senha, @nomecliente, @apelido, @datanasc, @telefone1, @email, " +
                " @cpf, @sexo, @codigo_indicacao)", _conn);
            _comandoSQL.Parameters.AddWithValue("@nomecliente", c.NomeCliente);
            _comandoSQL.Parameters.AddWithValue("@apelido", c.Apelido);
            _comandoSQL.Parameters.AddWithValue("@datanasc", c.datanasc);
            _comandoSQL.Parameters.AddWithValue("@telefone1", c.Telefone ?? "");
            _comandoSQL.Parameters.AddWithValue("@email", c.Email);
            _comandoSQL.Parameters.AddWithValue("@cpf", c.CPF);
            _comandoSQL.Parameters.AddWithValue("@sexo", c.Sexo ?? "");
            _comandoSQL.Parameters.AddWithValue("@codigo_indicacao", c.Codigo_Indicacao ?? "");
            _comandoSQL.Parameters.AddWithValue("@senha", c.Senha);
            try
            {
                _conn.Open();
                bool allAddressSaved = true;
                int idCliente = (int)_comandoSQL.ExecuteScalar();
                if (idCliente > 0)
                {
                    if (c.Enderecos != null)
                        foreach (var end in c.Enderecos)
                        {
                            _comandoSQL = new SqlCommand("INSERT INTO APP_ENDERECO " +
                                  " (idcliente, endereco, bairro, cidade, uf, num, complemento, cep, latitude, longitude, padrao) " +
                                  " output INSERTED.IDENDERECO VALUES (@idcliente, @endereco, @bairro, @cidade, @uf, @num," +
                                  " @complemento, @cep, @latitude, @longitude, @padrao)", _conn);
                            _comandoSQL.Parameters.AddWithValue("@endereco", end.Endereco);
                            _comandoSQL.Parameters.AddWithValue("@bairro", end.Bairro);
                            _comandoSQL.Parameters.AddWithValue("@cidade", end.Cidade);
                            _comandoSQL.Parameters.AddWithValue("@uf", end.UF);
                            _comandoSQL.Parameters.AddWithValue("@num", end.Num);
                            _comandoSQL.Parameters.AddWithValue("@complemento", end.Complemento);
                            _comandoSQL.Parameters.AddWithValue("@cep", end.CEP);
                            _comandoSQL.Parameters.AddWithValue("@latitude", end.Latitude);
                            _comandoSQL.Parameters.AddWithValue("@longitude", end.Longitude);
                            _comandoSQL.Parameters.AddWithValue("@padrao", end.Padrao);
                            _comandoSQL.Parameters.AddWithValue("@idcliente", idCliente);
                            int idEndereco = (int)_comandoSQL.ExecuteScalar();
                            if (idEndereco < 0)
                            {
                                c.Enderecos.Remove(end);
                                allAddressSaved = false;
                            }
                            else
                            {
                                end.IdEndereco = idEndereco;
                                end.IdCliente = idCliente;
                            }
                        }
                    c.IdCliente = idCliente;
                    Add(c);
                    if (!allAddressSaved)
                        throw new EnderecoNaoSalvoException("Alguns endereços não foram salvos.");
                    return;
                }
                else
                    throw new Exception("Não foi possível cadastrar o cliente.");
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

        public void Atualiza(Clientes c)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("UPDATE APP_CLIENTE SET " +
                " nomecliente =@nomecliente, apelido=@apelido, datanasc=@datanasc, telefone1=@telefone1, email=@email, " +
                " cpf=@cpf, sexo=@sexo, codigo_indicacao=@codigo_indicacao WHERE IDCLIENTE =@ID ", _conn);
            _comandoSQL.Parameters.AddWithValue("@nomecliente", c.NomeCliente);
            _comandoSQL.Parameters.AddWithValue("@apelido", c.Apelido);
            _comandoSQL.Parameters.AddWithValue("@datanasc", c.datanasc);
            _comandoSQL.Parameters.AddWithValue("@telefone1", c.Telefone);
            _comandoSQL.Parameters.AddWithValue("@email", c.Email);
            _comandoSQL.Parameters.AddWithValue("@cpf", c.CPF);
            _comandoSQL.Parameters.AddWithValue("@sexo", c.Sexo);
            _comandoSQL.Parameters.AddWithValue("@codigo_indicacao", c.Codigo_Indicacao);
            _comandoSQL.Parameters.AddWithValue("@ID", c.IdCliente);
            try
            {
                _conn.Open();
                bool allAddressSaved = true;
                int modificado = (int)_comandoSQL.ExecuteNonQuery();
                if (modificado > 0)
                {
                    foreach (var end in c.Enderecos)
                    {
                        _comandoSQL = new SqlCommand("UPDATE APP_ENDERECO SET" +
                              " endereco=@endereco, bairro=@bairro, cidade=@cidade, uf=@uf, num=@num, complemento=@complemento, cep=@cep, " +
                              " latitude=@latitude, longitude=@longitude, padrao=padrao WHERE IDCLIENTE =@ID AND IDENDERECO=@IDEND", _conn);
                        _comandoSQL.Parameters.AddWithValue("@endereco", end.Endereco);
                        _comandoSQL.Parameters.AddWithValue("@bairro", end.Bairro);
                        _comandoSQL.Parameters.AddWithValue("@cidade", end.Cidade);
                        _comandoSQL.Parameters.AddWithValue("@uf", end.UF);
                        _comandoSQL.Parameters.AddWithValue("@num", end.Num);
                        _comandoSQL.Parameters.AddWithValue("@complemento", end.Complemento);
                        _comandoSQL.Parameters.AddWithValue("@cep", end.CEP);
                        _comandoSQL.Parameters.AddWithValue("@latitude", end.Latitude);
                        _comandoSQL.Parameters.AddWithValue("@longitude", end.Longitude);
                        _comandoSQL.Parameters.AddWithValue("@padrao", end.Padrao);
                        _comandoSQL.Parameters.AddWithValue("@ID", c.IdCliente);
                        _comandoSQL.Parameters.AddWithValue("@IDEND", end.IdEndereco);
                        if (_comandoSQL.ExecuteNonQuery() < 0)
                        {
                            allAddressSaved = false;

                        }
                    }
                    Update(c);
                    if (!allAddressSaved)
                        throw new EnderecoNaoSalvoException("Alguns endereços não foram atualizados.");
                    return;
                }
                else
                    throw new Exception("Não foi possível atualizar o cliente.");
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

        public Clientes Get(int id)
        {
            return clientes.Find(p => p.IdCliente == id);
        }

        public IEnumerable<Clientes> GetAll()
        {
            return clientes;
        }

        public void Remove(int id)
        {
            clientes.RemoveAll(p => p.IdCliente == id);
        }

        public bool Update(Clientes item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = clientes.FindIndex(p => p.IdCliente == item.IdCliente);

            if (index == -1)
            {
                return false;
            }
            clientes.RemoveAt(index);
            clientes.Add(item);
            return true;
        }
    }

    public class EnderecoNaoSalvoException : Exception
    {
        public EnderecoNaoSalvoException(string message) : base(message) { }
        public EnderecoNaoSalvoException() : base("Erro ao salvar endereço.") { }
    }
}