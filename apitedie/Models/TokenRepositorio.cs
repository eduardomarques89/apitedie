using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Data.Common;

namespace apitedie.Models
{
    public class TokenRepositorio : ITokenRepositorio
    {
        private List<Tokens> Token = new List<Tokens>();

        public TokenRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"SELECT * FROM APP_DESENVOLVEDOR_TOKEN"))
            {
                if (reader.Read())
                {
                    Add(new Tokens
                    {
                        IdUsuario = Convert.ToInt32(reader["IDUSUARIO"]),
                        CodigoToken = reader["TOKEN"].ToString(),
                        Cadastrado = reader["DATACADASTRO"].ToString(),
                        Vencimento = reader["DATAEXPIRA"].ToString(),
                    });
                }
            }

            // Foi mudado a tabela onde o token é salvo para APP_DESENVOLVEDOR_TOKEN.
            //using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
            //    @"SELECT * FROM APP_DESENVOLVEDOR D JOIN APP_DESENVOLVEDOR_TOKEN T ON T.IDUSUARIO = D.IDUSUARIO where D.STATUS = 'A'"))
            //{
            //    if (reader.Read())
            //    {
            //        Add(new Tokens
            //        {
            //            CredencialName = reader["credencialname"].ToString(),
            //            CredencialKey = reader["credencialkey"].ToString(),
            //            CodigoToken = reader["token"].ToString()
            //        });
            //    }
            //}
        }

        public String GeraToken(Clientes cliente)
        {
            var generator = new RandomGenerator();
            var randomString = generator.RandomString(20);

            Database db = DatabaseFactory.CreateDatabase("DefaultConnection");

            try
            {
                DbCommand sqlCmd = db.GetSqlStringCommand(
               "DELETE FROM APP_DESENVOLVEDOR_TOKEN WHERE IDUSUARIO=@IDUSUARIO");
                db.AddInParameter(sqlCmd, "@IDUSUARIO", DbType.Int32, cliente.IdCliente);
                db.ExecuteNonQuery(sqlCmd);

                sqlCmd = db.GetSqlStringCommand(
                    "UPDATE APP_DESENVOLVEDOR_TOKEN SET TOKEN=@TOKEN, DATACADASTRO=@DATACADASTRO, DATAEXPIRA=@DATAEXPIRA" +
                    " WHERE IDUSUARIO=@IDUSUARIO");
                db.AddInParameter(sqlCmd, "@IDUSUARIO", DbType.Int32, cliente.IdCliente);
                db.AddInParameter(sqlCmd, "@TOKEN", DbType.String, randomString);
                db.AddInParameter(sqlCmd, "@DATACADASTRO", DbType.DateTime, DateTime.Now);
                db.AddInParameter(sqlCmd, "@DATAEXPIRA", DbType.DateTime, DateTime.Now.AddDays(5));

                db.ExecuteNonQuery(sqlCmd);
                return randomString;
            }
            catch (Exception ex)
            {
                throw new GerarTokenException("Erro ao gerar token. Message: " + ex.Message);
            }
        }

        public Tokens Add(Tokens item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            Token.Add(item);
            return item;
        }

        public Tokens Get(string codigo)
        {
            return Token.Find(p => p.CodigoToken == codigo);
        }

        public IEnumerable<Tokens> GetAll()
        {
            return Token;
        }
    }
    public class GerarTokenException : Exception
    {
        public GerarTokenException(string message) : base(message) { }
        public GerarTokenException() : base("Erro ao gerar token.") { }
    }
}