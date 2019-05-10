using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Models
{
  public class Client
  {
    [Key]
    public Guid ClientId { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string CellPhoneNumber { get; set; }
    public string Password { get; set; }
  }
}
