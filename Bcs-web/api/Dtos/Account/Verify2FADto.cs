using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class Verify2FADto
    {
         public string Email { get; set; }
        public string Otp { get; set; }
    }
}