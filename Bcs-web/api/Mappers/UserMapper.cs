using api.Dtos.Account;
using api.Models;
using MongoDB.Bson;

namespace api.Mappers
{
    public static class UserMapper
    {
        // Convert from Manage Entity to UserDto (Admin only - includes sensitive data)
        public static UserDto ToDto(this Manage entity)
        {
            if (entity == null) return null;

            return new UserDto
            {
                Id = entity.Id.ToString(),
                UserName = entity.UserName,
                // Password = entity.Password, // REMOVED - don't expose password
                Email = entity.Email,
                Phone = entity.Phone,
                Role = entity.Role,
                Avatar = entity.Avatar,
                UserDetails = entity.UserDetails,
                IsActive = entity.IsActive,
                JoiningDate = entity.JoiningDate
                // Token and NewPassword are only used for requests, not responses
            };
        }

        // Convert from Manage Entity to PublicUserDto (Public - safe data only)
        public static PublicUserDto ToPublicDto(this Manage entity)
        {
            if (entity == null) return null;

            return new PublicUserDto
            {
                Id = entity.Id.ToString(),
                UserName = entity.UserName,
                Role = entity.Role,
                Avatar = entity.Avatar,
                IsActive = entity.IsActive,
                JoiningDate = entity.JoiningDate
            };
        }

        // Convert from UserDto to Manage Entity
        public static Manage ToEntity(this UserDto dto)
        {
            if (dto == null) return null;

            ObjectId objectId;
            if (string.IsNullOrEmpty(dto.Id) || !ObjectId.TryParse(dto.Id, out objectId))
                objectId = ObjectId.GenerateNewId();
            return new Manage
            {
                Id = objectId,
                UserName = dto.UserName,
                Password = dto.Password,
                Email = dto.Email,
                Phone = dto.Phone,  // Sử dụng Phone nhất quán
                Role = dto.Role,
                Avatar = dto.Avatar,
                UserDetails = dto.UserDetails,
                IsActive = dto.IsActive,
                JoiningDate = dto.JoiningDate,
                Type = DataType.User  // Set type là User khi lưu
            };
        }
    }
}
