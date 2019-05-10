using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AJsAuto.Models;
using System.Net.Http;
using AJsAuto.Managers;
using Appointment = AJsAuto.Managers.Appointment;

namespace AJsAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentItemsController : ControllerBase
    {
        private readonly AJsAutoContext _context;

    public AppointmentItemsController(AJsAutoContext context)
        {
            _context = context;
        }

    // GET: api/AppointmentItems
    [HttpGet]
    public object GetAppointmentItems()
    {
      List<Appointment> appointments = new List<Appointment>();
      var currentuser = Request.Cookies["username"];

      Dictionary<Guid, List<Guid>> AppoItems = new Dictionary<Guid, List<Guid>>();
      var query = currentuser == "sibabalwepeter2848@gmail.com"? (from appoItems in _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem") select (new { appoId = appoItems.AppointmentId, servItemId = appoItems.ServiceItemId })).Distinct().ToList(): (from appoItems in _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Where(currUser=> currUser.Appointment.Client.Email==currentuser) select( new { appoId = appoItems.AppointmentId, servItemId = appoItems.ServiceItemId })).Distinct().ToList();

      foreach(var item in query)
      {
        if (AppoItems.ContainsKey(item.appoId) )
        {
          AppoItems[item.appoId].Add(item.servItemId);
        }
        else
        {
          AppoItems.Add(item.appoId, new List<Guid> { item.servItemId });
        }
      }

      foreach(var item in AppoItems)
      {
        var test = _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Where(owner=> item.Key == owner.Appointment.AppointmentId).Select(clientName => clientName.Appointment.Client.Name);

        string engieerName = _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Select(row => row.Appointment.Engineer.Name).FirstOrDefault();
        string clientname = _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Where(owner => item.Key == owner.Appointment.AppointmentId).Select(clientName => clientName.Appointment.Client.Name).FirstOrDefault();
        var servItems = _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Where(x => x.AppointmentId == item.Key).Select(serviceItems => serviceItems.ServiceItem.Name).ToList();
        var date = _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Where(x => x.AppointmentId == item.Key).Select(serviceItems => serviceItems.Appointment.Date).FirstOrDefault();
        var numberofItems = _context.AppointmentItems.Include("Appointment").Include("Appointment.Client").Include("Appointment.Engineer").Include("ServiceItem").Where(x => x.AppointmentId == item.Key).Select(appo => appo.Appointment.NumberOfItems).ToList().LongCount();
        Appointment appointment = new Appointment(clientname, engieerName, servItems, date, numberofItems);
        
        appointments.Add(appointment);
      }
      return appointments;
    }

    // GET: api/AppointmentItems/5
    [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentItem>> GetAppointmentItem(Guid id)
        {
            var appointmentItem = await _context.AppointmentItems.FindAsync(id);

            if (appointmentItem == null)
            {
                return NotFound();
            }
            return appointmentItem;
        }

        // PUT: api/AppointmentItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointmentItem(Guid id, AppointmentItem appointmentItem)
        {
            if (id != appointmentItem.AppointmentItemId)
            {
                return BadRequest();
            }

            _context.Entry(appointmentItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
              if (!AppointmentItemExists(id))
              {
                  return NotFound();
              }
              else
              {
                  throw;
              }
            }

            return NoContent();
        }

        // POST: api/AppointmentItems
        [HttpPost]
        public void  PostAppointmentItem([FromBody]AppointmentItem appointmentItem)
        {
          var currentuser = Request.Cookies["username"];
          foreach (string item in appointmentItem.Items){
            appointmentItem.ServiceItem = (from servItems in _context.ServiceItems where servItems.Name == item select servItems).FirstOrDefault();
            appointmentItem.Appointment = (from appo in _context.Appointments where appo.AppointmentId == appointmentItem.AppointmentId select appo).FirstOrDefault();
            appointmentItem.Appointment.Engineer = (from engineer in _context.Engineers where engineer.SkillLevel == 1 select engineer).FirstOrDefault();
            appointmentItem.Appointment.Client = (from client in _context.Clients.Where(owner => owner.Email == currentuser) select client).FirstOrDefault();
            var t  = Guid.NewGuid();
            appointmentItem.AppointmentItemId = Guid.NewGuid();
            _context.AppointmentItems.Add(appointmentItem);
            _context.SaveChanges();
            CreatedAtAction("GetAppointmentItem", new { id = appointmentItem.AppointmentItemId }, appointmentItem);
          }
        }

        // DELETE: api/AppointmentItems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AppointmentItem>> DeleteAppointmentItem(Guid id)
        {
            var appointmentItem = await _context.AppointmentItems.FindAsync(id);
            if (appointmentItem == null)
            {
                return NotFound();
            }

            _context.AppointmentItems.Remove(appointmentItem);
            await _context.SaveChangesAsync();

            return appointmentItem;
        }

        private bool AppointmentItemExists(Guid id)
        {
            return _context.AppointmentItems.Any(e => e.AppointmentItemId == id);
        }
    }
}
