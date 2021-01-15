using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class Enderecos
    {
        public int IdCliente { get; set; }
        public int IdEndereco { get; set; }
        public string Endereco { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string UF { get; set; }
        public string CEP { get; set; }
        public string Num { get; set; }
        public string Complemento { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Padrao { get; set; }
        public string Beautify { get { return "Rua " + Endereco + ", nº " + Num + ", " + Bairro + ", " + Cidade; } }
    }

    public interface IEnderecoRepositorio
    {
        IEnumerable<Enderecos> GetAll();
        Enderecos Get(int id);
        Enderecos Add(Enderecos item);
        void Remove(int id);
        bool Update(Enderecos item);
    }
}