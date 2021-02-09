using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class CartaoCredito
    {
        public int IdCliente { get; set; }
        public int IdCartao { get; set; }
        public string Token { get; set; }
        public string Numero { get; set; }
        public string IdBandeira { get; set; }
        public string Validade { get; set; }
        public string CPF { get; set; }
        public string CVV { get; set; }
        public string Titular { get; set; }
        public string Bandeira { get; set; }
    }
}