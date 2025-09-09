using api.Dtos.News;
using api.Models;

namespace api.Mappers
{
    public static class NewsMapper
    {
        // Entity -> DTO
        public static NewsDto ToNewsDto(this Manage manage)
        {
            if (manage == null) return null;

            return new NewsDto
            {
                Id = manage.Id.ToString(),
                Name = manage.UserName,
                Description = manage.Description,
                Image = manage.ImageUrl,
                Content = manage.Content,
                PostingDate = manage.PostingDate,
                ViewCount = manage.ViewCount, 
                IsActive = manage.IsActive 
            };
        }

        // DTO -> Entity
        public static Manage ToManage(this NewsDto dto)
        {
            if (dto == null) return null;

            MongoDB.Bson.ObjectId objectId;
            if (string.IsNullOrEmpty(dto.Id) || !MongoDB.Bson.ObjectId.TryParse(dto.Id, out objectId))
                objectId = MongoDB.Bson.ObjectId.GenerateNewId();
            return new Manage
            {
                Id = objectId,
                UserName = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.Image,
                Content = dto.Content,
                PostingDate = dto.PostingDate,
                Type = DataType.News,
                ViewCount = dto.ViewCount, 
                IsActive = dto.IsActive 
            };
        }
    }
}
