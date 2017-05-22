using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HelpMe.Web.Models
{
    public class TicketComment
    {
        public int Id { get; set; }

        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }

        public string Message { get; set; }

        public string AuthorId { get; set; }

        public string AuthorName { get; set; }
    }
}