using System;

namespace api.Dtos.Account
{
    /// <summary>
    /// DTO for public user information - excludes sensitive data
    /// </summary>
    public class PublicUserDto
    {
        public string? Id { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string Avatar { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoiningDate { get; set; }
        
        // Removed sensitive fields: Password, Token, NewPassword, Email, Phone, UserDetails
    }
}