using System.Collections.Generic;

namespace apitedie.Models
{
    public class Clientes
    {
        public int IdCliente { get; set; }
        public string NomeCliente { get; set; }
        public string Apelido { get; set; }
        public string datanasc { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string CPF { get; set; }
        public string Sexo { get; set; }
        public string Codigo_Indicacao { get; set; }
        public string Senha { get; set; }

        // É preciso entender porque tem campo de endereço nessa tabela se já existe a tabela APP_ENDERECOS para isso.
        // Desta forma esse campos foram retirados por ora.
        //public string Endereco { get; set; }
        //public string Bairro { get; set; }
        //public string Cidade { get; set; }
        //public string UF { get; set; }
        //public string CEP { get; set; }
        //public string Num { get; set; }
        //public string Complemento { get; set; }
        //public double Latitude { get; set; }
        //public double Longitude { get; set; }

        public IList<Enderecos> Enderecos { get; set; }
}

    public interface IClienteRepositorio
    {
        IEnumerable<Clientes> GetAll();
        Clientes Get(int id);
        void Insere(Clientes item);
        void Atualiza(Clientes item);
        Clientes Add(Clientes item);
        void Remove(int id);
        bool Update(Clientes item);
    }
}