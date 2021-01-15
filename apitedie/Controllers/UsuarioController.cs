using System.Web.Http;

namespace apitedie.Controllers
{
    public class UsuarioController : ApiController
    {
        //UsuarioBD bd = new UsuarioBD();

        // Método de autenticação fica no ClienteController.
        //public String Autenticar(string login, string senha)
        //{
        //    if (login != "" && senha.Trim().Length > 0)
        //        return new UsuarioBD().Autenticar(login, senha);
        //    else
        //        return null;
        //}

        public UsuarioController() { }
    }
}