using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HelpMeApplication.Web.Models
{
    public class Ticket
    {
        public string Guid { get; set; }

        public string AuthorName { get; set; }

        public string Head { get; set; }

        public string Body { get; set; }

        public virtual ICollection<Comment> Comments { get; set; }
    }
}