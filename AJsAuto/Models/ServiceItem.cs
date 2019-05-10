using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Models
{
  public class ServiceItem
  {
    [Key]
    public Guid ServiceItemId { get; set; }
    public DateTime Duration { get; set; }
    public string Name { get; set; }
    public int SkillLevel { get; set; }
  }
}
