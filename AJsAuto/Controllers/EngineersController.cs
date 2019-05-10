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
    public class EngineersController : ControllerBase
    {
        private readonly AJsAutoContext _context;

        public EngineersController(AJsAutoContext context)
        {
            _context = context;
        }

        // GET: api/Engineers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Engineer>>> GetEngineers()
        {
            return await _context.Engineers.ToListAsync();
        }

        // GET: api/Engineers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Engineer>> GetEngineer(Guid id)
        {
            var engineer = await _context.Engineers.FindAsync(id);

            if (engineer == null)
            {
                return NotFound();
            }

            return engineer;
        }

        // PUT: api/Engineers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEngineer(Guid id, Engineer engineer)
        {
            if (id != engineer.EngineerId)
            {
                return BadRequest();
            }

            _context.Entry(engineer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EngineerExists(id))
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

        // POST: api/Engineers
        [HttpPost]
        public async Task<ActionResult<Engineer>> PostEngineer(Engineer engineer)
        {
            _context.Engineers.Add(engineer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEngineer", new { id = engineer.EngineerId }, engineer);
        }

        // DELETE: api/Engineers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Engineer>> DeleteEngineer(Guid id)
        {
            var engineer = await _context.Engineers.FindAsync(id);
            if (engineer == null)
            {
                return NotFound();
            }

            _context.Engineers.Remove(engineer);
            await _context.SaveChangesAsync();

            return engineer;
        }

        private bool EngineerExists(Guid id)
        {
            return _context.Engineers.Any(e => e.EngineerId == id);
        }
    }
}
