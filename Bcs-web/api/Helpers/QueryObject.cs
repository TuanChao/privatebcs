using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class QueryObject
    {
        // Tìm kiếm theo tên
        public string? UserName { get; set; }
        // Tìm kiếm theo email
        public string? Email { get; set; }
        // Lọc theo role
        public string? Role { get; set; }
        // Lọc theo loại (Type)
        public string? Type { get; set; }
        // Chỉ lấy những bản ghi đang active
        public bool? IsActive { get; set; }
        // Ngày tham gia từ ... đến
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        // Sắp xếp
        public string? OrderBy { get; set; }    // "UserName", "JoiningDate", v.v.
        public bool Desc { get; set; } = false; // true = giảm dần
        // Phân trang
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}