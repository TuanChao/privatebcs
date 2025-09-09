using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StringLength(48, MinimumLength = 6, ErrorMessage = "Mật khẩu từ 6–48 ký tự")]
        public string Password { get; set; }

        public string Website { get; set; } // Honeypot
        public string Otp { get; set; }
    }
}