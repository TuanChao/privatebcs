using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Introduce;
using api.Models;
using MongoDB.Bson;

namespace api.Mappers
{
    public static class IntroduceMapper
    {
        // Entity -> DTO
        public static IntroduceDto ToIntroduceDto(this Manage manage)
        {
            if (manage == null) return null;

            return new IntroduceDto
            {
                Id = manage.Id.ToString(),
                Year = manage.Year,
                Name = manage.UserName,
                Description = manage.Description
            };
        }

        // DTO -> Entity
        public static Manage ToManage(this IntroduceDto dto)
        {
            if (dto == null) return null;

            return new Manage
            {
                Id = string.IsNullOrEmpty(dto.Id) ? ObjectId.GenerateNewId() : ObjectId.Parse(dto.Id),
                Year = dto.Year,
                UserName = dto.Name,
                Description = dto.Description,
                Type = DataType.Introduce
            };
        }
    }
}