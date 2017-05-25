using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using HelpMeApplication.Web.Models;

namespace HelpMeApplication.Web.Hubs
{
    public class TicketsHub : Hub
    {
        private static ICollection<Ticket> _tickets = new List<Ticket>();

        public void Clear()
        {
            _tickets = new List<Ticket>();
            Clients.Caller.loadTickets(_tickets);
        }

        public void CreateTicket(Ticket val)
        {
            val.Guid = Guid.NewGuid().ToString();
            val.Comments = new List<Comment>();
            _tickets.Add(val);
            Clients.All.ticketCreated(val);
        }

        public void CreateComment(string ticketId, Comment val)
        {
            var item = _tickets.FirstOrDefault(x => x.Guid == ticketId);

            if (item != null)
            {
                item.Comments.Add(val);
                Clients.All.commentCreated(ticketId, val);
            }
        }

        public override Task OnConnected()
        {
            Clients.Caller.loadTickets(_tickets);
            return base.OnConnected();
        }
    }
}