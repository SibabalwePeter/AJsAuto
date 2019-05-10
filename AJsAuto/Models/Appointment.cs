using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AJsAuto.Models
{
  public class Appointment
  {
    [Key]
    public Guid AppointmentId { get; set; }
    public DateTime Date { get; set; }
    public string TimeIn { get; set; }
    public int NumberOfItems { get; set; }

    [NotMapped]
    public string[] Items { get; set; }

    [NotMapped]
    public string CurrentUser { get; set; }

    // Relationships
    public Guid EngineerId { get; set; }
    public Engineer Engineer { get; set; }

    public Guid ClientId { get; set; }
    public Client Client { get; set; }
  }
}