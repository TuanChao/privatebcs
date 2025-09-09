using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.AboutContent;
using api.Models;


namespace api.Mappers
{
    public static class AboutContentMapper
    {
        // Entity -> DTO
        public static AboutContentDto ToAboutContentDto(this Manage manage)
        {
            if (manage == null) return null;

            return new AboutContentDto
            {
                Id = manage.Id.ToString(),
                Content = manage.Description
            };
        }

        // DTO -> Entity
        public static Manage ToManage(this AboutContentDto dto)
        {
            if (dto == null) return null;

            MongoDB.Bson.ObjectId objectId;
            if (string.IsNullOrEmpty(dto.Id) || !MongoDB.Bson.ObjectId.TryParse(dto.Id, out objectId))
                objectId = MongoDB.Bson.ObjectId.GenerateNewId();
            return new Manage
            {
                Id = objectId,
                Description = dto.Content,
                Type = DataType.AboutContent
            };
        }
    }
}