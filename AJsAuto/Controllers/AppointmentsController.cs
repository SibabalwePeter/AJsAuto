using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AJsAuto.Models;

namespace AJsAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AJsAutoContext _context;

        public AppointmentsController(AJsAutoContext context)
        {
            this._context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
          var appointmentList = _context.Appointments.Include("Client").Include("Engineer").Include("AppointmentItem.ServiceItem").FirstOrDefault();
          return await _context.Appointments.Include("Client").Include("Engineer").Include("AppointmentItem.ServiceItem").ToListAsync();
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(Guid id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(Guid id, Appointment appointment)
        {
            if (id != appointment.AppointmentId)
            {
                return BadRequest();
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
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

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<Guid>> PostAppointment([FromBody]Appointment appointment)
        {
          appointment.EngineerId = (from g in _context.Engineers where g.SkillLevel == 1 select g.EngineerId).FirstOrDefault();
          appointment.ClientId = (from g in _context.Clients select g.ClientId).FirstOrDefault(); // must be from client frond end
          appointment.AppointmentId = Guid.NewGuid();
          DateTime currenTime = DateTime.Now;
          appointment.Date = new DateTime(appointment.Date.Year, appointment.Date.Month, appointment.Date.Day);
          appointment.TimeIn = appointment.TimeIn;
          appointment.NumberOfItems = appointment.Items.Length;
          _context.Appointments.Add(appointment);
          await _context.SaveChangesAsync();
          return Ok(appointment.AppointmentId);
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Appointment>> DeleteAppointment(Guid id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return appointment;
        }

        private bool AppointmentExists(Guid id)
        {
            return _context.Appointments.Any(e => e.AppointmentId == id);
        }
    }
}
