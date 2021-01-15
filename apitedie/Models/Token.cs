using System.Collections.Generic;

namespace apitedie.Models
{
    public class Tokens
    {
        public int IdUsuario { get; set; }
        public string CodigoToken { get; set; }
        public string Cadastrado { get; set; }
        public string Vencimento { get; set; }
    }

    public interface ITokenRepositorio
    {
        IEnumerable<Tokens> GetAll();
        Tokens Get(string id);
        Tokens Add(Tokens item);
    }
}