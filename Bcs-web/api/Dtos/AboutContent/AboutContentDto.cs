using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.AboutContent
{
    public class AboutContentDto
    {
        public string? Id { get; set; }
        public string Content { get; set; } = string.Empty;
        // public string? Image { get; set; } // Thêm nếu chưa có
    }
}