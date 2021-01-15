using System;
using System.Collections.Generic;

namespace apitedie.Models
{
    public class Ticket
    {
        public int IdTicket { get; set; }
        public int IdAplicativo { get; set; }
        public int IdEmpresa{ get; set; }
        public string Protocolo { get; set; }
        public DateTime DataCadastro { get; set; }
        public string Status { get; set; }
        public int IdCliente{ get; set; }
    }

    public interface ITicketRepositorio
    {
        IEnumerable<Ticket> GetAll();
        Ticket Get(int id);
        Ticket Add(Ticket item);
        void Remove(int id);
        bool Update(Ticket item);
    }
}