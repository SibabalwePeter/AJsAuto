using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Managers
{
  public class Appointment
  {
    public string Clientname { get; set; }
    public string EngineerName { get; set; }
    public List<string> ServiceItems { get; set; }

    public DateTime Date { get; set; }
    public long NumberofItems { get; set; }

    public Appointment(string clientName, string engineerName, List<string> serviceItems, DateTime date, long numberofItems)
    {
      Clientname = clientName;
      EngineerName = engineerName;
      ServiceItems = serviceItems;
      NumberofItems = numberofItems;
      Date = date;
    }
  }
}
