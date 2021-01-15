
using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;

namespace apitedie.Models
{
    public class TicketRepositorio : ITicketRepositorio
    {
        private List<Ticket> tickets = new List<Ticket>();
        private int _nextId = 1;

        public TicketRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"SELECT * from APP_TICKET"))
            {
                while (reader.Read())
                {
                    Add(new Ticket
                    {
                        IdTicket = Convert.ToInt32(reader["IDTICKET"].ToString()),
                        IdAplicativo = Convert.ToInt32(reader["IDAPLICATIVO"].ToString()),
                        IdEmpresa = Convert.ToInt32(reader["IDEMPRESA"].ToString()),
                        Protocolo = reader["PROTOCOLO"].ToString(),
                        DataCadastro = Convert.ToDateTime(reader["DATACADASTRO"].ToString()),
                        Status = reader["STATUS"].ToString(),
                        IdCliente = Convert.ToInt32(reader["IDECLIENTE"].ToString())

                    });
                }
            }
        }

        public Ticket Add(Ticket item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.IdTicket = _nextId++;
            tickets.Add(item);
            return item;
        }

        public Ticket Get(int id)
        {
            return tickets.Find(p => p.IdTicket == id);
        }

        public IEnumerable<Ticket> GetAll()
        {
            return tickets;
        }

        public void Remove(int id)
        {
            tickets.RemoveAll(p => p.IdTicket == id);
        }

        public bool Update(Ticket item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = tickets.FindIndex(p => p.IdTicket == item.IdTicket);

            if (index == -1)
            {
                return false;
            }
            tickets.RemoveAt(index);
            tickets.Add(item);
            return true;
        }
    }
}