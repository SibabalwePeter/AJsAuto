using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AJsAuto.Models
{
  public class AJsAutoContext : DbContext
  {
    public AJsAutoContext(DbContextOptions options) : base()
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

      var config = Startup.Configuration.GetConnectionString("AJsAutoDatabase");

      optionsBuilder.UseSqlServer(config);

      base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      //modelBuilder.Entity<Engineer>()
      //  .Property(d => d.EngineerId)
      //  .ValueGeneratedOnAdd();

      //modelBuilder.Entity<Engineer>().HasData(
      //    new Engineer { Name = "engineer", Email = "mail@mail.com", SkillLevel = 1, Surname = "surname" }
      //    );
    }

    public DbSet<Client> Clients { get; set; }
    public DbSet<Engineer> Engineers { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<AppointmentItem> AppointmentItems { get; set; }
    public DbSet<ServiceItem> ServiceItems { get; set; }
    public DbSet<Users> Users { get; set; }
  }
}