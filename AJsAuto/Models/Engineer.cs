using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Models
{
  public class Engineer
  {
    [Key]
    public Guid EngineerId { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public int SkillLevel { get; set; }
  }
}
