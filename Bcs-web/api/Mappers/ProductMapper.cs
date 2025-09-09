using api.Dtos;
using api.Dtos.Product;
using api.Models;

namespace api.Mappers
{
    public static class ProductMapper
    {
        // Chuyển từ Manage Entity sang ProductDto
        public static ProductDto ToProductDto(this Manage entity)
        {
            if (entity == null) return null;

            return new ProductDto
            {
                Id = entity.Id.ToString(),
                Name = entity.UserName,    
                Description = entity.Description,
                Image = entity.ImageUrl,          
                Content = entity.Content,
                PostingDate = entity.PostingDate,
                ViewCount = entity.ViewCount,
                Pdf = entity.Pdf,
                IsActive = entity.IsActive // Map trạng thái ẩn/hiện
            };
        }

        // Chuyển từ ProductDto sang Manage entity (dùng khi tạo mới hoặc cập nhật)
        public static Manage ToEntity(this ProductDto dto)
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
                Type = DataType.Product,
                ViewCount = dto.ViewCount,
                Pdf = dto.Pdf,
                IsActive = dto.IsActive // Map trạng thái ẩn/hiện
            };
        }
    }
}
