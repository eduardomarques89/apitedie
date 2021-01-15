using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class Perfil
    {
        public int IdCliente { get; set; }
        public string NomeCliente { get; set; }
        public string Apelido { get; set; }
        public DateTime DataNascimento { get; set; }
        public string Telefone1 { get; set; }
        public string Telefone2 { get; set; }
        public string Email { get; set; }
        public string Cpf { get; set; }
        public string Status { get; set; }
        public DateTime DataCadastro { get; set; }
        public string Senha { get; set; }
        public string CodigoIndicacao { get; set; }
        public string SobreNome { get; set; }
        public string Sexo { get; set; }
        public string Endereco { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Uf { get; set; }
        public string Num { get; set; }
        public string Complemento { get; set; }
        public string Cep { get; set; }
      
        
    }

    public interface IPerfilRepositorio
    {
        IEnumerable<Perfil> GetAll();
        Perfil Get(int id);
        Perfil Add(Perfil item);
        void Remove(int id);
        bool Update(Perfil item);
    }
}
