using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using SmtpClient = System.Net.Mail.SmtpClient;

namespace AJsAuto.Managers
{
  public class Email
  {
    private string smtpAddress;
    private int portNumber;
    private bool enableSSL;
    private string emailFromAddress;
    private string password;
    private string emailToAddress;
    private string subject;

    public Email() {
      smtpAddress = "smtp.gmail.com";
      portNumber = 587;
      enableSSL = true;
      emailFromAddress = "put your own email address"; //Sender Email Address  
      password = "put your own password"; //Sender Password  
      emailToAddress = "recipient"; //Receiver Email Address  
      subject = "AJ's Auto registration";
    }
    public void SendEmail(string recipient, string body)
    {
      MailMessage mail = new MailMessage();
      mail.From = new MailAddress(emailFromAddress);
      mail.To.Add(recipient);
      mail.Subject = subject;
      mail.Body = body;
      mail.IsBodyHtml = false;
      using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
      {
        smtp.UseDefaultCredentials = false;
        smtp.Credentials = new NetworkCredential(emailFromAddress, password);
        smtp.EnableSsl = enableSSL;
        smtp.Send(mail);
      }
    }
  }
}
