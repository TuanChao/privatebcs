using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ProductBanner
{
    public class ProductBannerDto
    {
        public string? Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime PostingDate { get; set; } = DateTime.Now;
        public int ViewCount { get; set; }
        public bool IsActive { get; set; } = true;
    }
}