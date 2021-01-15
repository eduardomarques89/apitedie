using apitedie.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace apitedie.DAO
{
    internal class UsuarioBD : Banco
    {
        internal UsuarioBD() { }

        internal String Autenticar(string login, string senha)
        {
            ComandoSQL.Parameters.Clear();
            ComandoSQL.CommandText = @"select * from app_cliente
                 where email = @email and senha = @senha";
            //senha = Criptografia.Encrypt(senha);
            ComandoSQL.Parameters.AddWithValue("@email", login);
            ComandoSQL.Parameters.AddWithValue("@senha", senha);

            DataTable dt = ExecutaSelect();
            if (dt != null && dt.Rows.Count > 0)
            {
                //Usuario f = new Usuario();
                //f.Codigo = Convert.ToInt32(dt.Rows[0]["fun_codigo"]);
                //f.Login = dt.Rows[0]["fun_login"].ToString();
                //f.Senha = dt.Rows[0]["fun_senha"].ToString();
                return "Sucess";
            }
            else
                return "Denied";
        }
    }
}