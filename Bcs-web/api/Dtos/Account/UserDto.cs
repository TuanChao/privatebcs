using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class UserDto
    {
        public string? Id { get; set; }
        public string UserName { get; set; }
        public string? Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
        public string Avatar { get; set; }
        public string UserDetails { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoiningDate { get; set; }
        
        public string? Token { get; set; }
        public string? NewPassword { get; set; } 
    }
}