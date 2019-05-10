using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Models
{
  public class AppointmentItem
  {
    [Key]
    public Guid AppointmentItemId { get; set; }

    // Relationship
    [NotMapped]
    public string[] Items { get; set; }
    public Guid ServiceItemId { get; set; }
    public ServiceItem ServiceItem { get; set; }

    public Guid AppointmentId { get; set; }
    public Appointment Appointment { get; set; }
  }
}
