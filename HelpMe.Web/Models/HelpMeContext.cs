namespace HelpMe.Web.Models
{
    using System;
    using System.Data.Entity;
    using System.Linq;

    public class HelpMeContext : DbContext
    {
        public virtual DbSet<Ticket> Tickets { get; set; }

        public virtual DbSet<TicketComment> TicketComments { get; set; }

        public HelpMeContext()
            : base("name=HelpMeContext")
        {
        }
        
    }
}