using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Models
{
  public class Users
  {
    [Key]
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public DateTime LastLogin { get; set; }
  }
}
