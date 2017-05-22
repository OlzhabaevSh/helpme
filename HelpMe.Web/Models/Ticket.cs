using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HelpMe.Web.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        public string Topic { get; set; }

        public string Description { get; set; }

        public DateTime? Date { get; set; }

        public string AuthorId { get; set; }

        public string AuthorName { get; set; }

        public TicketStatusEnum TicketStatus { get; set; }

        public virtual ICollection<TicketComment> TicketComments { get; set; }
    }
}