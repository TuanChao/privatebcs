using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProductBanner;
using api.Models;

namespace api.Mappers
{
    public static class ProductBannerMapper
    {

        // Entity -> DTOrrr
        public static ProductBannerDto ToProductBannerDto(this Manage manage)
        {
            if (manage == null) return null;

            return new ProductBannerDto
            {
                Id = manage.Id.ToString(),
                Name = manage.UserName,
                Description = manage.Description,
                Image = manage.ImageUrl,
                Content = manage.Content,
                PostingDate = manage.PostingDate,
                ViewCount = manage.ViewCount 
            };
        }

        // DTO -> Entity
        public static Manage ToManage(this ProductBannerDto dto)
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
                Type = DataType.ProductBanner,
                ViewCount = dto.ViewCount // Thêm dòng này
            };
        }
    }
}