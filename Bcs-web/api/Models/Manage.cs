using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace api.Models
{
    public enum DataType
    {
        User,
        Product,
        CsService,
        News,
        Poster,
        AboutContent,
        Introduce,
        NewsBanner,
        ProductBanner,
        CsServiceBanner
    }
    public class Manage
    {
        [MongoDB.Bson.Serialization.Attributes.BsonId]
        [MongoDB.Bson.Serialization.Attributes.BsonIgnoreIfDefault]
        public MongoDB.Bson.ObjectId Id { get; set; }

        public DataType Type { get; set; }
        public bool IsActive { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string UserDetails { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime JoiningDate { get; set; } = DateTime.Now;
        public DateTime PostingDate { get; set; } = DateTime.Now;
        public int Year { get; set; }
        public int ViewCount { get; set; }
        public string? Secret2FA { get; set; }
        public string? Pdf { get; set; } // Thêm dòng này vào class Manage
    }
}