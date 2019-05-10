using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AJsAuto.Models;
using AJsAuto.Managers;
using System.Web;

namespace AJsAuto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly AJsAutoContext _context;

        public ClientsController(AJsAutoContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return await _context.Clients.ToListAsync();
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
            {
                return NotFound();
            }

            return client;
        }

        // PUT: api/Clients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(Guid id, [FromBody] Client client)
        {
            if (id != client.ClientId)
            {
                return BadRequest();
            }

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
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

      // POST: api/Clients
      [HttpPost]
      public async Task<ActionResult<string>> PostClient(Client client)
      {
      if (_context.Clients.Where(clnt => clnt.Email == client.Email).Count() == 0)
        {
          _context.Clients.Add(client);
          await _context.SaveChangesAsync();

          // send email
          string body = "Dear " + client.Name + " " + client.Surname + "\n \n"
                        + "You are now registered on AJ's Auto. Your login details are as follows: \n"
                        + "Username: " + client.Email + " \n"
                        + "Password: " + client.Password + "\n \n"
                        + "Kindly regards, \n"
                        + "AJ's Auto Administrator";
          Email email = new Email();
          email.SendEmail(client.Email, body);

          return Ok("Successfully");
      }
        else
        {
          return Ok("Not successfully");
        }
      }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Client>> DeleteClient(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return client;
        }

        private bool ClientExists(Guid id)
        {
            return _context.Clients.Any(e => e.ClientId == id);
        }
        
        [HttpPost]
        [Route("IsValidUser")]
        public bool IsValidUser([FromBody]Input input)
        {
          if(_context.Clients.Where(e => e.Email == input.Email && e.Password == input.Password).ToList().Count > 0)
          {
            CookieOptions cookie = new CookieOptions();
            Response.Cookies.Append("username", input.Email);
          }

           
         return _context.Clients.Any(e => e.Email == input.Email && e.Password == input.Password);
        }
    }

  public class Input
  {
    public string Email { get; set; }
    public string Password { get; set; }
  }
}
