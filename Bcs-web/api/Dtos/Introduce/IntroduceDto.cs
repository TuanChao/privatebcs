using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Introduce
{
    public class IntroduceDto
    {
        public string? Id { get; set; }
        public int Year { get; set; }
        public string Name { get; set; } = string.Empty; // map từ UserName
        public string Description { get; set; } = string.Empty;
    }
}