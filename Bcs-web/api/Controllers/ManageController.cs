using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.Extensions.Logging;
using api.Dtos.Account;
using api.Dtos.Product;
using api.Dtos.Service;
using api.Dtos.News;
using api.Dtos.Poster;
using api.Dtos.Introduce;
using api.Dtos.AboutContent;
using api.Mappers;
using api.Helpers;
// using api.Service;
using Microsoft.AspNetCore.Identity;
using api.Interfaces;
using Microsoft.Extensions.Configuration;
using OtpNet;
using Humanizer;
using MongoDB.Driver.Linq;
using Microsoft.AspNetCore.Authorization;
using api.Dtos.ProductBanner;
using api.Dtos.CsServiceBanner;
using api.Helpers;



namespace api.Controllers
{
    [Route("api/Manage")]
    [ApiController]
    public class ManageController : ControllerBase
    {
        // ...existing code...
        // private readonly UserManager<Manage> _userManager;
        // private readonly SignInManager<Manage> _signinManager;
        private readonly ITokenService _tokenService;

        private readonly SendGridEmailServiceV2 _emailService;

        private readonly IPasswordHasher<Manage> _passwordHasher;

        private readonly IConfiguration _config;
        private readonly IManageRepository _manageRepository;


        // private readonly EmailService _emailService;

        public ManageController(
            IPasswordHasher<Manage> passwordHasher,
            SendGridEmailServiceV2 emailService,
            ITokenService tokenService,
            IManageRepository manageRepository,
            IConfiguration config)
        {
            _passwordHasher = passwordHasher;
            _manageRepository = manageRepository;
            _emailService = emailService;
            _tokenService = tokenService;
            _config = config;
        }

        //lấy hết - chỉ admin
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var manages = await _manageRepository.GetAll();
            return Ok(manages);
        }

        //lấy hết theo type - chỉ admin
        [HttpGet("{type}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByType(string type)
        {
            if (!Enum.TryParse<DataType>(type, true, out var dataType))
                return BadRequest("Invalid data type.");
            var all = await _manageRepository.GetAll();
            var data = all.Where(d => d.Type == dataType).ToList();
            if (data == null || !data.Any())
                return NotFound($"No data found for type: {type}");
            return Ok(data);
        }

        //---------------------------------------------------------------------------------//
        //------------- USER --------------------------------------------------------------//
        //---------------------------------------------------------------------------------//

        //lấy user
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] QueryObject query)
        {
            // Removed sensitive session logging
            if (!IsAdmin())
                return StatusCode(403, "Bạn không đủ quyền truy cập chức năng này!");

            var all = await _manageRepository.GetAll();
            var users = all.Where(m => m.Type == DataType.User).AsQueryable();

            // Lọc theo tên
            if (!string.IsNullOrEmpty(query.UserName))
                users = users.Where(u => u.UserName.Contains(query.UserName));

            // Lọc theo email

            if (!string.IsNullOrEmpty(query.Email))
                users = users.Where(u => u.Email.Contains(query.Email));

            // Lọc theo role
            if (!string.IsNullOrEmpty(query.Role))
                users = users.Where(u => u.Role == query.Role);

            // Lọc theo IsActive
            if (query.IsActive != null)
                users = users.Where(u => u.IsActive == query.IsActive);

            // Lọc theo ngày tham gia
            if (query.FromDate != null)
                users = users.Where(u => u.JoiningDate >= query.FromDate);
            if (query.ToDate != null)
                users = users.Where(u => u.JoiningDate <= query.ToDate);

            // Sắp xếp
            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    users = query.Desc ? users.OrderByDescending(u => u.UserName) : users.OrderBy(u => u.UserName);
                else if (query.OrderBy == "JoiningDate")
                    users = query.Desc ? users.OrderByDescending(u => u.JoiningDate) : users.OrderBy(u => u.JoiningDate);
                // Thêm các sort khác nếu cần
            }
            else
            {
                users = users.OrderBy(u => u.Id); // mặc định theo Id
            }

            // Phân trang
            users = users.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var userDtos = users.Select(u => u.ToDto()).ToList();
            return Ok(userDtos);
        }



        //lấy user theo id
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            if (!IsAdmin())
                return StatusCode(403, "Bạn không đủ quyền truy cập chức năng này!");

            var user = await _manageRepository.GetAsync(id);
            if (user == null || user.Type != DataType.User)
                return NotFound();
            var userDto = user.ToDto();
            return Ok(userDto);
        }

        //tạo mới user
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto)
        {
            if (!IsAdmin())
                return StatusCode(403, "Bạn không đủ quyền truy cập chức năng này!");

            if (userDto == null)
                return BadRequest("User data is null.");

            // Chuyển từ UserDto sang Manage entity
            var userEntity = userDto.ToEntity();

            // Hash password trước khi lưu
            if (!string.IsNullOrEmpty(userDto.Password))
                userEntity.Password = _passwordHasher.HashPassword(userEntity, userDto.Password);

            // Thêm người dùng mới vào MongoDB
            await _manageRepository.AddAsync(userEntity);

            // Chuyển entity vừa tạo thành UserDto để trả về cho client
            var createdUserDto = userEntity.ToDto();

            // Trả về thông tin người dùng mới được tạo
            return CreatedAtAction(nameof(GetUser), new { id = userEntity.Id }, createdUserDto);
        }

        //sửa user
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDto userDto)
        {
            if (!IsAdmin())
                return StatusCode(403, "Bạn không đủ quyền truy cập chức năng này!");

            if (userDto == null) return BadRequest();

            var existingUser = await _manageRepository.GetAsync(id);
            if (existingUser == null || existingUser.Type != DataType.User) return NotFound();

            // Cập nhật các trường khác...
            existingUser.UserName = userDto.UserName;
            existingUser.Phone = userDto.Phone;
            existingUser.Email = userDto.Email;
            existingUser.Role = userDto.Role;
            existingUser.Avatar = userDto.Avatar;
            existingUser.UserDetails = userDto.UserDetails;
            existingUser.IsActive = userDto.IsActive;
            existingUser.JoiningDate = userDto.JoiningDate;

            // Đổi mật khẩu nếu có nhập
            if (!string.IsNullOrEmpty(userDto.NewPassword))
            {
                existingUser.Password = _passwordHasher.HashPassword(existingUser, userDto.NewPassword);
            }

            await _manageRepository.UpdateAsync(existingUser);
            return Ok(existingUser.ToDto());
        }

        //xóa user
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            // Kiểm tra không được xóa admin cuối cùng
            var all = await _manageRepository.GetAll();
            var adminCount = all.Count(x => x.Role == "Admin" && x.Type == DataType.User);
            
            var userToDelete = await _manageRepository.GetAsync(id);
            if (userToDelete?.Role == "Admin" && adminCount <= 1)
            {
                return BadRequest("Không thể xóa admin cuối cùng!");
            }
    
            var user = await _manageRepository.GetAsync(id);
            if (user == null || user.Type != DataType.User) return NotFound();
            await _manageRepository.DeleteAsync(user);
            return NoContent();
        }

        //---------------------------------------------------------------------------------//
        //------------- PRODUCT -----------------------------------------------------------//
        //---------------------------------------------------------------------------------//
        //Lấy sản phẩm
        // GET: api/Manage/Product?UserName=&Description=&FromDate=&ToDate=&OrderBy=&Desc=&Page=&PageSize=
        [HttpGet("Product")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProduct([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var products = all.Where(m => m.Type == DataType.Product).AsQueryable();

            if (!string.IsNullOrEmpty(query.UserName))
                products = products.Where(u => u.UserName.Contains(query.UserName));

            if (!string.IsNullOrEmpty(query.Description))
                products = products.Where(u => u.Description.Contains(query.Description));

            if (query.FromDate != null)
                products = products.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                products = products.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp
            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    products = query.Desc ? products.OrderByDescending(u => u.UserName) : products.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    products = query.Desc ? products.OrderByDescending(u => u.PostingDate) : products.OrderBy(u => u.PostingDate);
            }
            else
            {
                products = products.OrderBy(u => u.Id);
            }

            products = products.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var ProductDtos = products.Select(u => u.ToProductDto()).ToList();
            return Ok(ProductDtos);
        }

        // GET: api/Manage/Product/Public - Chỉ lấy sản phẩm active để hiển thị ra ngoài homepage
        [HttpGet("Product/Public")]
        public async Task<IActionResult> GetPublicProduct([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var products = all.Where(m => m.Type == DataType.Product && m.IsActive).AsQueryable();

            if (!string.IsNullOrEmpty(query.UserName))
                products = products.Where(u => u.UserName.Contains(query.UserName));

            if (!string.IsNullOrEmpty(query.Description))
                products = products.Where(u => u.Description.Contains(query.Description));

            if (query.FromDate != null)
                products = products.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                products = products.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp
            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    products = query.Desc ? products.OrderByDescending(u => u.UserName) : products.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    products = query.Desc ? products.OrderByDescending(u => u.PostingDate) : products.OrderBy(u => u.PostingDate);
            }
            else
            {
                products = products.OrderBy(u => u.Id);
            }

            products = products.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var ProductDtos = products.Select(u => u.ToProductDto()).ToList();
            return Ok(ProductDtos);
        }


        // GET: api/Manage/Product/{id}
        [HttpGet("Product/{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            var product = await _manageRepository.GetAsync(id);
            if (product == null || product.Type != DataType.Product)
                return NotFound();
            product.ViewCount += 1;
            await _manageRepository.UpdateAsync(product);
            var productDto = product.ToProductDto();
            return Ok(productDto);
        }

        // POST: api/Manage/Product
        [HttpPost("Product")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto productDto)
        {
            if (productDto == null) return BadRequest("Product data is null.");

            var product = new Manage
            {
                Type = DataType.Product,
                UserName = productDto.Name,
                Description = productDto.Description,
                ImageUrl = productDto.Image,    // FE gửi lên là 'image'
                Content = productDto.Content,
                PostingDate = productDto.PostingDate,
                Pdf = productDto.Pdf,
            };

            await _manageRepository.AddAsync(product);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product.ToProductDto());
        }

        // PUT: api/Manage/Product/{id}
        [HttpPut("Product/{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] ProductDto productDto)
        {
            if (productDto == null) return BadRequest();

            var existingProduct = await _manageRepository.GetAsync(id);
            if (existingProduct == null || existingProduct.Type != DataType.Product) return NotFound();
            existingProduct.UserName = productDto.Name;
            existingProduct.Description = productDto.Description;
            existingProduct.ImageUrl = productDto.Image;
            existingProduct.Content = productDto.Content;
            existingProduct.PostingDate = productDto.PostingDate;
            existingProduct.Pdf = productDto.Pdf;
           existingProduct.IsActive = productDto.IsActive;
            await _manageRepository.UpdateAsync(existingProduct);
            return Ok(existingProduct.ToProductDto());
        }

        // DELETE: api/Manage/Product/{id}
        [HttpDelete("Product/{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var product = await _manageRepository.GetAsync(id);
            if (product == null || product.Type != DataType.Product) return NotFound();
            await _manageRepository.DeleteAsync(product);
            return NoContent();
        }


        //---------------------------------------------------------------------------------//
        //------------- CSSERVICE ---------------------------------------------------------//
        //---------------------------------------------------------------------------------//


        [HttpGet("CsService")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCsService([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var csService = all.Where(m => m.Type == DataType.CsService).AsQueryable();

            if (!string.IsNullOrEmpty(query.UserName))
                csService = csService.Where(u => u.UserName.Contains(query.UserName));

            if (!string.IsNullOrEmpty(query.Description))
                csService = csService.Where(u => u.Description.Contains(query.Description));

            if (query.FromDate != null)
                csService = csService.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                csService = csService.Where(u => u.PostingDate <= query.ToDate);

            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    csService = query.Desc ? csService.OrderByDescending(u => u.UserName) : csService.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    csService = query.Desc ? csService.OrderByDescending(u => u.PostingDate) : csService.OrderBy(u => u.PostingDate);
            }
            else
            {
                csService = csService.OrderBy(u => u.Id);
            }

            csService = csService.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var serviceDto = csService.Select(u => u.ToServiceDto()).ToList();
            return Ok(serviceDto);
        }

        // GET: api/Manage/CsService/Public - Chỉ lấy dịch vụ active để hiển thị ra ngoài homepage
        [HttpGet("CsService/Public")]
        public async Task<IActionResult> GetPublicCsService([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var csService = all.Where(m => m.Type == DataType.CsService && m.IsActive).AsQueryable();

            if (!string.IsNullOrEmpty(query.UserName))
                csService = csService.Where(u => u.UserName.Contains(query.UserName));

            if (!string.IsNullOrEmpty(query.Description))
                csService = csService.Where(u => u.Description.Contains(query.Description));

            if (query.FromDate != null)
                csService = csService.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                csService = csService.Where(u => u.PostingDate <= query.ToDate);

            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    csService = query.Desc ? csService.OrderByDescending(u => u.UserName) : csService.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    csService = query.Desc ? csService.OrderByDescending(u => u.PostingDate) : csService.OrderBy(u => u.PostingDate);
            }
            else
            {
                csService = csService.OrderBy(u => u.Id);
            }

            csService = csService.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var serviceDto = csService.Select(u => u.ToServiceDto()).ToList();
            return Ok(serviceDto);
        }


        //lấy Dịch vụ theo id
        [HttpGet("CsService/{id}")]
        public async Task<IActionResult> GetCsServiceById(string id)
        {
            var csService = await _manageRepository.GetAsync(id);
            if (csService == null || csService.Type != DataType.CsService) return NotFound();
            csService.ViewCount += 1;
            await _manageRepository.UpdateAsync(csService);
            return Ok(csService.ToServiceDto());
        }


        //tạo mới Dịch vụ
        [HttpPost("CsService")]
        public async Task<IActionResult> CreateCsService([FromBody] ServiceDto dto)
        {
            if (dto == null) return BadRequest("Service data is null.");

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var entity = dto.ToManage(); // Gán Type = CsService bên trong mapper rồi
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetCsServiceById), new { id = entity.Id }, entity.ToServiceDto());
        }

        //Sửa Dịch vụ
        [HttpPut("CsService/{id}")]
        public async Task<IActionResult> UpdateCsService(string id, [FromBody] ServiceDto dto)
        {
            if (dto == null) return BadRequest();

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var existing = await _manageRepository.GetAsync(id);
            if (existing == null || existing.Type != DataType.CsService) return NotFound();
            existing.UserName = dto.Name;
            existing.Description = dto.Description;
            existing.ImageUrl = dto.Image;
            existing.Content = dto.Content;
           existing.IsActive = dto.IsActive;
            existing.PostingDate = dto.PostingDate;
            await _manageRepository.UpdateAsync(existing);
            return NoContent();
        }

        //xóa Dịch vụ
        [HttpDelete("CsService/{id}")]
        public async Task<IActionResult> DeleteCsService(string id)
        {
            var csService = await _manageRepository.GetAsync(id);
            if (csService == null || csService.Type != DataType.CsService) return NotFound();
            await _manageRepository.DeleteAsync(csService);
            return NoContent();
        }


        //---------------------------------------------------------------------------------//
        //--------------- NEWS ------------------------------------------------------------//
        //---------------------------------------------------------------------------------//

        [HttpGet("News")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetNews([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var newsList = all.Where(m => m.Type == DataType.News).AsQueryable();

            if (!string.IsNullOrEmpty(query.UserName))
                newsList = newsList.Where(u => u.UserName.Contains(query.UserName));

            if (!string.IsNullOrEmpty(query.Description))
                newsList = newsList.Where(u => u.Description.Contains(query.Description));

            if (query.FromDate != null)
                newsList = newsList.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                newsList = newsList.Where(u => u.PostingDate <= query.ToDate);

            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    newsList = query.Desc ? newsList.OrderByDescending(u => u.UserName) : newsList.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    newsList = query.Desc ? newsList.OrderByDescending(u => u.PostingDate) : newsList.OrderBy(u => u.PostingDate);
            }
            else
            {
                newsList = newsList.OrderBy(u => u.Id);
            }

            newsList = newsList.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var dtoList = newsList.Select(n => n.ToNewsDto()).ToList();
            return Ok(dtoList);
        }


        //lấy tin tức theo id
        [HttpGet("News/{id}")]
        public async Task<IActionResult> GetNewsById(string id)
        {
            var news = await _manageRepository.GetAsync(id);
            if (news == null || news.Type != DataType.News) return NotFound();
            news.ViewCount += 1;
            await _manageRepository.UpdateAsync(news);
            return Ok(news.ToNewsDto());
        }


        //tạo mới tin tức
        [HttpPost("News")]
        public async Task<IActionResult> CreateNews([FromBody] NewsDto dto)
        {
            if (dto == null) return BadRequest("News data is null.");

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var entity = dto.ToManage(); // Mapper đã gán Type = News
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetNewsById), new { id = entity.Id }, entity.ToNewsDto());
        }

        //Sửa tin tức
        [HttpPut("News/{id}")]
        public async Task<IActionResult> UpdateNews(string id, [FromBody] NewsDto dto)
        {
            if (dto == null) return BadRequest();

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var existingNews = await _manageRepository.GetAsync(id);
            if (existingNews == null || existingNews.Type != DataType.News) return NotFound();
            existingNews.UserName = dto.Name;
            existingNews.Description = dto.Description;
            existingNews.ImageUrl = dto.Image; // Không trả về ảnh dạng base64, chỉ lưu đường dẫn hoặc URL ảnh
            existingNews.Content = dto.Content;
            existingNews.PostingDate = dto.PostingDate;
            existingNews.ViewCount = dto.ViewCount; // ✅ Cập nhật ViewCount
            existingNews.IsActive = dto.IsActive; // ✅ Cập nhật IsActive để có thể toggle hiển thị
            await _manageRepository.UpdateAsync(existingNews);
            return NoContent();
        }

        // xóa Tin tức
        [HttpDelete("News/{id}")]
        public async Task<IActionResult> DeleteNews(string id)
        {
            var news = await _manageRepository.GetAsync(id);
            if (news == null || news.Type != DataType.News) return NotFound();
            await _manageRepository.DeleteAsync(news);
            return NoContent();
        }

        // GET: api/Manage/News/Public - Chỉ lấy tin tức active để hiển thị ra ngoài
        [HttpGet("News/Public")]
        public async Task<IActionResult> GetPublicNews([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var data = all.Where(x => x.Type == DataType.News && x.IsActive == true);

            if (!string.IsNullOrEmpty(query.UserName))
                data = data.Where(x => x.UserName.Contains(query.UserName));

            if (!string.IsNullOrEmpty(query.Description))
                data = data.Where(x => x.Description.Contains(query.Description));

            if (query.FromDate != null)
                data = data.Where(x => x.PostingDate >= query.FromDate);

            if (query.ToDate != null)
                data = data.Where(x => x.PostingDate <= query.ToDate);

            // Sắp xếp theo thời gian đăng mới nhất
            data = data.OrderByDescending(x => x.PostingDate);

            var dtoList = data.Select(x => x.ToNewsDto()).ToList();
            return Ok(dtoList);
        }

        //---------------------------------------------------------------------------------//
        //------------- POSTER ------------------------------------------------------------//
        //---------------------------------------------------------------------------------//

        // Lấy danh sách Poster (có lọc, phân trang)
        [HttpGet("Poster")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPoster([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var posters = all.Where(m => m.Type == DataType.Poster).AsQueryable();

            // Lọc theo UserName, Description, PostingDate
            if (!string.IsNullOrEmpty(query.UserName))
                posters = posters.Where(u => u.UserName.Contains(query.UserName));
            if (!string.IsNullOrEmpty(query.Description))
                posters = posters.Where(u => u.Description.Contains(query.Description));
            if (query.FromDate != null)
                posters = posters.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                posters = posters.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp
            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    posters = query.Desc ? posters.OrderByDescending(u => u.UserName) : posters.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    posters = query.Desc ? posters.OrderByDescending(u => u.PostingDate) : posters.OrderBy(u => u.PostingDate);
            }
            else
            {
                posters = posters.OrderBy(u => u.Id);
            }

            // Phân trang
            posters = posters.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var posterDtos = posters.Select(u => u.ToPosterDto()).ToList();
            return Ok(posterDtos);
        }

        // GET: api/Manage/Poster/Public - Chỉ lấy poster active để hiển thị ra ngoài homepage
        [HttpGet("Poster/Public")]
        public async Task<IActionResult> GetPublicPoster([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            // Tạm thời bỏ điều kiện IsActive để test
            var posters = all.Where(m => m.Type == DataType.Poster).AsQueryable(); // && m.IsActive

            // Lọc theo UserName, Description, PostingDate
            if (!string.IsNullOrEmpty(query.UserName))
                posters = posters.Where(u => u.UserName.Contains(query.UserName));
            if (!string.IsNullOrEmpty(query.Description))
                posters = posters.Where(u => u.Description.Contains(query.Description));
            if (query.FromDate != null)
                posters = posters.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                posters = posters.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp theo thời gian đăng mới nhất
            posters = posters.OrderByDescending(u => u.PostingDate);

            // Phân trang
            posters = posters.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var posterDtos = posters.Select(u => u.ToPosterDto()).ToList();
            return Ok(posterDtos);
        }

        // API để activate tất cả poster (chỉ dùng cho debug)
        [HttpGet("Poster/ActivateAll")]
        public async Task<IActionResult> ActivateAllPosters()
        {
            try
            {
                var all = await _manageRepository.GetAll();
                var posters = all.Where(m => m.Type == DataType.Poster && !m.IsActive).ToList();
                
                foreach (var poster in posters)
                {
                    poster.IsActive = true;
                    await _manageRepository.UpdateAsync(poster);
                }
                
                return Ok($"Activated {posters.Count} posters");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        // Lấy Poster theo id
        [HttpGet("Poster/{id}")]
        public async Task<IActionResult> GetPosterById(string id)
        {
            var poster = await _manageRepository.GetAsync(id);
            if (poster == null || poster.Type != DataType.Poster) return NotFound();
            poster.ViewCount += 1;
            await _manageRepository.UpdateAsync(poster);
            return Ok(poster.ToPosterDto());
        }


        // Tạo mới Poster
        [HttpPost("Poster")]
        public async Task<IActionResult> CreatePoster([FromBody] PosterDto dto)
        {
            if (dto == null) return BadRequest("Poster data is null.");

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var entity = dto.ToManage(); // Gán sẵn Type = Poster
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetPosterById), new { id = entity.Id }, entity.ToPosterDto());
        }

        // Sửa Poster
        [HttpPut("Poster/{id}")]
        public async Task<IActionResult> UpdatePoster(string id, [FromBody] PosterDto dto)
        {
            if (dto == null) return BadRequest();

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var existingPoster = await _manageRepository.GetAsync(id);
            if (existingPoster == null || existingPoster.Type != DataType.Poster) return NotFound();
            existingPoster.UserName = dto.Name;
            existingPoster.Description = dto.Description;
            existingPoster.ImageUrl = dto.Image;
            existingPoster.Content = dto.Content;
            existingPoster.PostingDate = dto.PostingDate;
            await _manageRepository.UpdateAsync(existingPoster);
            return NoContent();
        }

        // Xóa Poster
        [HttpDelete("Poster/{id}")]
        public async Task<IActionResult> DeletePoster(string id)
        {
            var poster = await _manageRepository.GetAsync(id);
            if (poster == null || poster.Type != DataType.Poster) return NotFound();
            await _manageRepository.DeleteAsync(poster);
            return NoContent();
        }

        //---------------------------------------------------------------------------------//

        //---------------------------------------------------------------------------------//
        //------------- PRODUCTBANNER ------------------------------------------------------------//
        //---------------------------------------------------------------------------------//

        // Lấy danh sách ProductBanner (có lọc, phân trang)
        [HttpGet("ProductBanner")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProductBanner([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var productBanners = all.Where(m => m.Type == DataType.ProductBanner).AsQueryable();

            // Lọc theo UserName, Description, PostingDate
            if (!string.IsNullOrEmpty(query.UserName))
                productBanners = productBanners.Where(u => u.UserName.Contains(query.UserName));
            if (!string.IsNullOrEmpty(query.Description))
                productBanners = productBanners.Where(u => u.Description.Contains(query.Description));
            if (query.FromDate != null)
                productBanners = productBanners.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                productBanners = productBanners.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp
            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    productBanners = query.Desc ? productBanners.OrderByDescending(u => u.UserName) : productBanners.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    productBanners = query.Desc ? productBanners.OrderByDescending(u => u.PostingDate) : productBanners.OrderBy(u => u.PostingDate);
            }
            else
            {
                productBanners = productBanners.OrderBy(u => u.Id);
            }

            // Phân trang
            productBanners = productBanners.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var productBannerDtos = productBanners.Select(u => u.ToProductBannerDto()).ToList();
            return Ok(productBannerDtos);
        }

        // GET: api/Manage/ProductBanner/Public - Chỉ lấy product banner active để hiển thị ra ngoài
        [HttpGet("ProductBanner/Public")]
        public async Task<IActionResult> GetPublicProductBanner([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            // Tạm thời bỏ điều kiện IsActive để test
            var productBanners = all.Where(m => m.Type == DataType.ProductBanner).AsQueryable(); // && m.IsActive

            // Lọc theo UserName, Description, PostingDate
            if (!string.IsNullOrEmpty(query.UserName))
                productBanners = productBanners.Where(u => u.UserName.Contains(query.UserName));
            if (!string.IsNullOrEmpty(query.Description))
                productBanners = productBanners.Where(u => u.Description.Contains(query.Description));
            if (query.FromDate != null)
                productBanners = productBanners.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                productBanners = productBanners.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp theo thời gian đăng mới nhất
            productBanners = productBanners.OrderByDescending(u => u.PostingDate);

            // Phân trang
            productBanners = productBanners.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var productBannerDtos = productBanners.Select(u => u.ToProductBannerDto()).ToList();
            return Ok(productBannerDtos);
        }

        // Lấy ProductBanner theo id
        [HttpGet("ProductBanner/{id}")]
        public async Task<IActionResult> GetProductBannerById(string id)
        {
            var productBanner = await _manageRepository.GetAsync(id);
            if (productBanner == null || productBanner.Type != DataType.ProductBanner) return NotFound();
            productBanner.ViewCount += 1;
            await _manageRepository.UpdateAsync(productBanner);
            return Ok(productBanner.ToProductBannerDto());
        }

        // GET: api/Manage/ProductBanner/{id}/Public - Lấy chi tiết product banner công khai
        [HttpGet("ProductBanner/{id}/Public")]
        public async Task<IActionResult> GetPublicProductBannerById(string id)
        {
            var productBanner = await _manageRepository.GetAsync(id);
            if (productBanner == null || productBanner.Type != DataType.ProductBanner) return NotFound();
            productBanner.ViewCount += 1;
            await _manageRepository.UpdateAsync(productBanner);
            return Ok(productBanner.ToProductBannerDto());
        }


        // Tạo mới ProductBanner
        [HttpPost("ProductBanner")]
        public async Task<IActionResult> CreateProductBanner([FromBody] ProductBannerDto dto)
        {
            if (dto == null) return BadRequest("ProductBanner data is null.");

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var entity = dto.ToManage(); // Gán sẵn Type = ProductBanner
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetProductBannerById), new { id = entity.Id }, entity.ToProductBannerDto());
        }

        // Sửa ProductBanner
        [HttpPut("ProductBanner/{id}")]
        public async Task<IActionResult> UpdateProductBanner(string id, [FromBody] ProductBannerDto dto)
        {
            if (dto == null) return BadRequest();

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var existingProductBanner = await _manageRepository.GetAsync(id);
            if (existingProductBanner == null || existingProductBanner.Type != DataType.ProductBanner) return NotFound();
            existingProductBanner.UserName = dto.Name;
            existingProductBanner.Description = dto.Description;
            existingProductBanner.ImageUrl = dto.Image;
            existingProductBanner.Content = dto.Content;
            existingProductBanner.PostingDate = dto.PostingDate;
            await _manageRepository.UpdateAsync(existingProductBanner);
            return Ok(existingProductBanner.ToProductBannerDto());
        }

        // Xóa ProductBanner
        [HttpDelete("ProductBanner/{id}")]
        public async Task<IActionResult> DeleteProductBanner(string id)
        {
            var productBanner = await _manageRepository.GetAsync(id);
            if (productBanner == null || productBanner.Type != DataType.ProductBanner) return NotFound();
            await _manageRepository.DeleteAsync(productBanner);
            return NoContent();
        }

        //---------------------------------------------------------------------------------//
        //------------- CSSERVICEBANNER ------------------------------------------------------------//
        //---------------------------------------------------------------------------------//

        // Lấy danh sách CsServiceBanner (có lọc, phân trang)
        [HttpGet("CsServiceBanner")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCsServiceBanner([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            var csServiceBanners = all.Where(m => m.Type == DataType.CsServiceBanner).AsQueryable();

            // Lọc theo UserName, Description, PostingDate
            if (!string.IsNullOrEmpty(query.UserName))
                csServiceBanners = csServiceBanners.Where(u => u.UserName.Contains(query.UserName));
            if (!string.IsNullOrEmpty(query.Description))
                csServiceBanners = csServiceBanners.Where(u => u.Description.Contains(query.Description));
            if (query.FromDate != null)
                csServiceBanners = csServiceBanners.Where(u => u.PostingDate >= query.FromDate);
            if (query.ToDate != null)
                csServiceBanners = csServiceBanners.Where(u => u.PostingDate <= query.ToDate);

            // Sắp xếp
            if (!string.IsNullOrEmpty(query.OrderBy))
            {
                if (query.OrderBy == "UserName")
                    csServiceBanners = query.Desc ? csServiceBanners.OrderByDescending(u => u.UserName) : csServiceBanners.OrderBy(u => u.UserName);
                else if (query.OrderBy == "PostingDate")
                    csServiceBanners = query.Desc ? csServiceBanners.OrderByDescending(u => u.PostingDate) : csServiceBanners.OrderBy(u => u.PostingDate);
            }
            else
            {
                csServiceBanners = csServiceBanners.OrderBy(u => u.Id);
            }

            // Phân trang
            csServiceBanners = csServiceBanners.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var CsServiceBannerDto = csServiceBanners.Select(u => u.ToCsServiceBannerDto()).ToList();
            return Ok(CsServiceBannerDto);
        }


        // Lấy CsServiceBanner theo id
        [HttpGet("CsServiceBanner/{id}")]
        public async Task<IActionResult> GetCsServiceBannerById(string id)
        {
            var csServiceBanner = await _manageRepository.GetAsync(id);
            if (csServiceBanner == null || csServiceBanner.Type != DataType.CsServiceBanner) return NotFound();
            csServiceBanner.ViewCount += 1;
            await _manageRepository.UpdateAsync(csServiceBanner);
            return Ok(csServiceBanner.ToCsServiceBannerDto());
        }

        // GET: api/Manage/CsServiceBanner/{id}/Public - Lấy chi tiết service banner công khai
        [HttpGet("CsServiceBanner/{id}/Public")]
        public async Task<IActionResult> GetPublicCsServiceBannerById(string id)
        {
            var csServiceBanner = await _manageRepository.GetAsync(id);
            if (csServiceBanner == null || csServiceBanner.Type != DataType.CsServiceBanner) return NotFound();
            csServiceBanner.ViewCount += 1;
            await _manageRepository.UpdateAsync(csServiceBanner);
            return Ok(csServiceBanner.ToCsServiceBannerDto());
        }


        // Tạo mới CsServiceBanner
        [HttpPost("CsServiceBanner")]
        public async Task<IActionResult> CreateCsServiceBanner([FromBody] CsServiceBannerDto dto)
        {
            if (dto == null) return BadRequest("CsServiceBanner data is null.");

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var entity = dto.ToManage(); // Gán sẵn Type = CsServiceBanner
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetCsServiceBannerById), new { id = entity.Id }, entity.ToCsServiceBannerDto());
        }

        // Sửa CsServiceBanner
        [HttpPut("CsServiceBanner/{id}")]
        public async Task<IActionResult> UpdateCsServiceBanner(string id, [FromBody] CsServiceBannerDto dto)
        {
            if (dto == null) return BadRequest();

            // Validate content for XSS
            var contentValidation = new Dictionary<string, string>
            {
                { "Name", dto.Name },
                { "Description", dto.Description },
                { "Content", dto.Content }
            };
            
            var validationErrors = InputSanitizer.ValidateContents(contentValidation);
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            var existingCsServiceBanner = await _manageRepository.GetAsync(id);
            if (existingCsServiceBanner == null || existingCsServiceBanner.Type != DataType.CsServiceBanner) return NotFound();
            existingCsServiceBanner.UserName = dto.Name;
            existingCsServiceBanner.Description = dto.Description;
            existingCsServiceBanner.ImageUrl = dto.Image;
            existingCsServiceBanner.Content = dto.Content;
            existingCsServiceBanner.PostingDate = dto.PostingDate;
            await _manageRepository.UpdateAsync(existingCsServiceBanner);
            return Ok(existingCsServiceBanner.ToCsServiceBannerDto());
        }

        // Xóa CsServiceBanner
        [HttpDelete("CsServiceBanner/{id}")]
        public async Task<IActionResult> DeleteCsServiceBanner(string id)
        {
            var csServiceBanner = await _manageRepository.GetAsync(id);
            if (csServiceBanner == null || csServiceBanner.Type != DataType.CsServiceBanner) return NotFound();
            await _manageRepository.DeleteAsync(csServiceBanner);
            return NoContent();
        }

        // GET: api/Manage/CsServiceBanner/Public - Chỉ lấy service banner active để hiển thị ra ngoài
        [HttpGet("CsServiceBanner/Public")]
        public async Task<IActionResult> GetPublicCsServiceBanner([FromQuery] ContentQueryObject query)
        {
            var all = await _manageRepository.GetAll();
            // Bỏ điều kiện IsActive để luôn trả về tất cả banner dịch vụ
            var csServiceBanners = all.Where(m => m.Type == DataType.CsServiceBanner).AsQueryable();

            csServiceBanners = csServiceBanners.OrderByDescending(u => u.PostingDate);

            csServiceBanners = csServiceBanners.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize);

            var csServiceBannerDtos = csServiceBanners.Select(u => u.ToCsServiceBannerDto()).ToList();
            return Ok(csServiceBannerDtos);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null) return BadRequest("Thiếu dữ liệu đăng nhập!");

            // HONEYPOT kiểm tra bot
            if (!string.IsNullOrEmpty(loginDto.Website))
                return BadRequest("Bot detected!");

            var inputEmail = loginDto.Email.Trim().ToLower();
            var inputPassword = loginDto.Password.Trim();

            var all = await _manageRepository.GetAll();
            var user = all.FirstOrDefault(x => x.Email.ToLower() == inputEmail);

            // Sử dụng IPasswordHasher để kiểm tra mật khẩu
            try
            {
                if (user == null || _passwordHasher.VerifyHashedPassword(user, user.Password, inputPassword) == PasswordVerificationResult.Failed)
                    return Unauthorized("Sai tài khoản hoặc mật khẩu!");
            }
            catch (FormatException)
            {
                // Password hash bị corrupt - rehash với password hiện tại
                user.Password = _passwordHasher.HashPassword(user, inputPassword);
                await _manageRepository.UpdateAsync(user);
                // Thử verify lại
                if (_passwordHasher.VerifyHashedPassword(user, user.Password, inputPassword) == PasswordVerificationResult.Failed)
                    return Unauthorized("Sai tài khoản hoặc mật khẩu!");
            }

            // Xác thực 2 yếu tố (chỉ khi user đã bật 2FA)
            if (!string.IsNullOrEmpty(user.Secret2FA))
            {
                // User đã bật 2FA, bắt buộc phải có mã OTP
                if (string.IsNullOrEmpty(loginDto.Otp))
                    return BadRequest("Tài khoản này yêu cầu mã xác thực 2FA!");
                    
                var totp = new Totp(Base32Encoding.ToBytes(user.Secret2FA));
                bool isValid = totp.VerifyTotp(loginDto.Otp, out long _);
                if (!isValid) return Unauthorized("Mã xác thực không đúng!");
            }

            // Tạo JWT token thay vì dùng session
            var token = _tokenService.CreateToken(user);
            
            // Vẫn giữ session cho backward compatibility 
            HttpContext.Session.SetString("UserRole", user.Role);

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                email = user.Email,
                role = user.Role,
                userName = user.UserName,
                token = token // Trả về JWT token
            });
        }
        // <-- ĐÓNG method Login TẠI ĐÂY

        // Các method khác bắt đầu từ đây
        [HttpGet("admin-dashboard")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminDashboard()
        {
            // JWT Authorization đã kiểm tra role, không cần kiểm tra session
            return Ok("Chào mừng Admin tới dashboard quản trị!");
        }

        // Đếm số lượng user
        [HttpGet("User/count")]
        public async Task<IActionResult> GetUserCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.User);
            return Ok(new { count });
        }

        // Đếm số lượng poster
        [HttpGet("Poster/count")]
        public async Task<IActionResult> GetPosterCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.Poster);
            return Ok(new { count });
        }

        // Đếm số lượng sản phẩm
        [HttpGet("Product/count")]
        public async Task<IActionResult> GetProductCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.Product);
            return Ok(new { count });
        }

        // Đếm số lượng dịch vụ
        [HttpGet("Service/count")]
        public async Task<IActionResult> GetServiceCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.CsService);
            return Ok(new { count });
        }

        // Đếm số lượng tin tức
        [HttpGet("News/count")]
        public async Task<IActionResult> GetNewsCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.News);
            return Ok(new { count });
        }

        // Đếm số lượng product banner
        [HttpGet("ProductBanner/count")]
        public async Task<IActionResult> GetProductBannerCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.ProductBanner);
            return Ok(new { count });
        }

        // Đếm số lượng service banner
        [HttpGet("CsServiceBanner/count")]
        public async Task<IActionResult> GetCsServiceBannerCount()
        {
            var all = await _manageRepository.GetAll();
            var count = all.Count(m => m.Type == DataType.CsServiceBanner);
            return Ok(new { count });
        }

        [HttpPost("Image")]
        [RequestSizeLimit(15 * 1024 * 1024)] // 15MB limit
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Kiểm tra file size (15MB max)
            if (file.Length > 15 * 1024 * 1024)
                return BadRequest("File too large. Maximum size is 15MB.");

            // Kiểm tra file type
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest("Invalid file type. Only JPEG, PNG, GIF, WebP are allowed.");

            try
            {
                // Tạo thư mục uploads nếu chưa có
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Đặt tên file duy nhất với timestamp
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                var fileName = $"{DateTime.UtcNow:yyyyMMdd_HHmmss}_{Guid.NewGuid():N}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Log thông tin file để debug
                var fileSizeMB = Math.Round((double)file.Length / (1024 * 1024), 2);
                Console.WriteLine($"📁 Uploading: {fileName} ({fileSizeMB}MB) - Type: {file.ContentType}");

                // Lưu file với buffer để xử lý file lớn
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về đường dẫn truy cập ảnh
                var url = $"/uploads/{fileName}";
                Console.WriteLine($"✅ Upload success: {url}");
                
                return Ok(new { 
                    url = url,
                    fileName = fileName,
                    size = file.Length,
                    type = file.ContentType
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Upload error: {ex.Message}");
                return StatusCode(500, $"Upload failed: {ex.Message}");
            }
        }

        [HttpGet("ViewCount/total")]
        public async Task<IActionResult> GetTotalViewCount()
        {
            var all = await _manageRepository.GetAll();
            var total = all.Sum(m => m.ViewCount);
            return Ok(new { count = total });
        }

        [HttpPost("enable-2fa/{userId}")]
        public async Task<IActionResult> Enable2FA(string userId)
        {
            var user = await _manageRepository.GetAsync(userId);
            if (user == null) return NotFound();
            var secretKey = OtpNet.KeyGeneration.GenerateRandomKey(20);
            var base32Secret = OtpNet.Base32Encoding.ToString(secretKey);
            user.Secret2FA = base32Secret;
            await _manageRepository.UpdateAsync(user);
            string issuer = "BCS-Web";
            string otpauthUrl = $"otpauth://totp/{issuer}:{user.Email}?secret={base32Secret}&issuer={issuer}";
            return Ok(new { secret = base32Secret, otpauthUrl });
        }

        [HttpPost("verify-2fa")]
        public async Task<IActionResult> Verify2FA([FromBody] Verify2FADto dto)
        {
            // Bây giờ bạn có thể dùng dto.Email và dto.Otp
            var all = await _manageRepository.GetAll();
            var user = all.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return NotFound();
            var totp = new Totp(Base32Encoding.ToBytes(user.Secret2FA));
            bool isValid = totp.VerifyTotp(dto.Otp, out long _);
            if (!isValid) return Unauthorized("Mã xác thực không đúng!");
            return Ok(new { message = "Xác thực 2FA thành công!" });
        }

        // Introduce APIs
        [HttpGet("Introduce")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetIntroduceList()
        {
            var all = await _manageRepository.GetAll();
            var list = all.Where(m => m.Type == DataType.Introduce)
                          .OrderBy(m => m.Year)
                          .Select(m => m.ToIntroduceDto())
                          .ToList();
            return Ok(list);
        }

        [HttpGet("Introduce/{id}")]
        public async Task<IActionResult> GetIntroduceById(string id)
        {
            var entity = await _manageRepository.GetAsync(id);
            if (entity == null || entity.Type != DataType.Introduce) return NotFound();
            return Ok(entity.ToIntroduceDto());
        }

        [HttpPost("Introduce")]
        public async Task<IActionResult> CreateIntroduce([FromBody] IntroduceDto dto)
        {
            if (dto == null) return BadRequest("Data is null.");

            var entity = dto.ToManage();
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetIntroduceById), new { id = entity.Id }, entity.ToIntroduceDto());
        }

        [HttpPut("Introduce/{id}")]
        public async Task<IActionResult> UpdateIntroduce(string id, [FromBody] IntroduceDto dto)
        {
            if (dto == null) return BadRequest();

            var entity = await _manageRepository.GetAsync(id);
            if (entity == null || entity.Type != DataType.Introduce) return NotFound();
            entity.Year = dto.Year;
            entity.UserName = dto.Name;
            entity.Description = dto.Description;
            await _manageRepository.UpdateAsync(entity);
            return Ok(entity.ToIntroduceDto());
        }

        [HttpDelete("Introduce/{id}")]
        public async Task<IActionResult> DeleteIntroduce(string id)
        {
            var entity = await _manageRepository.GetAsync(id);
            if (entity == null || entity.Type != DataType.Introduce) return NotFound();
            await _manageRepository.DeleteAsync(entity);
            return NoContent();
        }

        // AboutContent APIs

        [HttpGet("AboutContent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAboutContentList()
        {
            var all = await _manageRepository.GetAll();
            var list = all.Where(m => m.Type == DataType.AboutContent)
                          .OrderBy(m => m.Id)
                          .Select(m => m.ToAboutContentDto())
                          .ToList();
            return Ok(list);
        }

        [HttpGet("AboutContent/{id}")]
        public async Task<IActionResult> GetAboutContentById(string id)
        {
            var entity = await _manageRepository.GetAsync(id);
            if (entity == null || entity.Type != DataType.AboutContent) return NotFound();
            return Ok(entity.ToAboutContentDto());
        }

        [HttpPost("AboutContent")]
        public async Task<IActionResult> CreateAboutContent([FromBody] AboutContentDto dto)
        {
            if (dto == null) return BadRequest("Data is null.");

            var entity = dto.ToManage();
            await _manageRepository.AddAsync(entity);
            return CreatedAtAction(nameof(GetAboutContentById), new { id = entity.Id }, entity.ToAboutContentDto());
        }

        [HttpPut("AboutContent/{id}")]
        public async Task<IActionResult> UpdateAboutContent(string id, [FromBody] AboutContentDto dto)
        {
            if (dto == null) return BadRequest();

            var entity = await _manageRepository.GetAsync(id);
            if (entity == null || entity.Type != DataType.AboutContent) return NotFound();
            entity.Description = dto.Content;
            await _manageRepository.UpdateAsync(entity);
            return Ok(entity.ToAboutContentDto());
        }

        [HttpDelete("AboutContent/{id}")]
        public async Task<IActionResult> DeleteAboutContent(string id)
        {
            var entity = await _manageRepository.GetAsync(id);
            if (entity == null || entity.Type != DataType.AboutContent) return NotFound();
            await _manageRepository.DeleteAsync(entity);
            return NoContent();
        }

        // GET: api/Manage/AboutContent/Public - Lấy nội dung giới thiệu để hiển thị ra ngoài
        [HttpGet("AboutContent/Public")]
        public async Task<IActionResult> GetPublicAboutContent()
        {
            var all = await _manageRepository.GetAll();
            var list = all.Where(m => m.Type == DataType.AboutContent)
                          .OrderByDescending(m => m.Id)
                          .Select(m => m.ToAboutContentDto())
                          .ToList();
            return Ok(list);
        }

        // GET: api/Manage/Introduce/Public - Lấy danh sách giới thiệu để hiển thị ra ngoài
        [HttpGet("Introduce/Public")]
        public async Task<IActionResult> GetPublicIntroduce()
        {
            var all = await _manageRepository.GetAll();
            var list = all.Where(m => m.Type == DataType.Introduce)
                          .OrderBy(m => m.Year)
                          .Select(m => m.ToIntroduceDto())
                          .ToList();
            return Ok(list);
        }

        // Lấy banner tin tức
        
        [HttpGet("NewsBanner")]
        public async Task<IActionResult> GetNewsBanner()
        {
            var all = await _manageRepository.GetAll();
            var banners = all.Where(m => m.Type == DataType.NewsBanner)
                             .OrderByDescending(m => m.Id)
                             .Select(m => new { imageUrl = m.ImageUrl, id = m.Id })
                             .ToList();
            return Ok(banners);
        }

        // Thêm/sửa banner tin tức
        [HttpPost("NewsBanner")]
        public async Task<IActionResult> SetNewsBanner([FromBody] List<BannerDto> dtos)
        {
            if (!IsAdmin())
                return StatusCode(403, "Bạn không đủ quyền truy cập chức năng này!");

            if (dtos == null || dtos.Count == 0) return BadRequest();

            // Validate all ImageUrls for XSS
            var validationErrors = new List<string>();
            foreach (var dto in dtos)
            {
                var contentValidation = new Dictionary<string, string>
                {
                    { "ImageUrl", dto.ImageUrl }
                };
                
                var errors = InputSanitizer.ValidateContents(contentValidation);
                validationErrors.AddRange(errors);
            }
            
            if (validationErrors.Any())
            {
                return BadRequest(new { errors = validationErrors });
            }

            // Xóa banner cũ (nếu muốn chỉ giữ các banner mới)
            var all = await _manageRepository.GetAll();
            var oldBanners = all.Where(m => m.Type == DataType.NewsBanner).ToList();
            foreach (var banner in oldBanners)
            {
                await _manageRepository.DeleteAsync(banner);
            }
            foreach (var dto in dtos)
            {
                var banner = new Manage
                {
                    Type = DataType.NewsBanner,
                    ImageUrl = dto.ImageUrl,
                    PostingDate = DateTime.Now
                };
                await _manageRepository.AddAsync(banner);
            }
            return Ok(new { success = true });
        }

        // GET: api/Manage/NewsBanner/Public - Lấy news banner để hiển thị ra ngoài
        [HttpGet("NewsBanner/Public")]
        public async Task<IActionResult> GetPublicNewsBanner()
        {
            var all = await _manageRepository.GetAll();
            var banners = all.Where(m => m.Type == DataType.NewsBanner)
                             .OrderByDescending(m => m.Id)
                             .Select(m => new { imageUrl = m.ImageUrl, id = m.Id })
                             .ToList();
            return Ok(banners);
        }

        // Hàm kiểm tra quyền (đặt ở đầu controller)
        private string GetUserRole()
        {
            var role = HttpContext.Session.GetString("UserRole");
            return string.IsNullOrEmpty(role) ? "" : role;
        }
        private bool IsAdmin() => GetUserRole() == "Admin";

        
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Clear session
            HttpContext.Session.Clear();
            
            // Optional: Log logout event
            // _logger.LogInformation($"User logged out at {DateTime.Now}");
            
            return Ok(new { message = "Đăng xuất thành công!" });
        }

        // Debug endpoint to check JWT config
        [HttpGet("debug/jwt-info")]
        public IActionResult GetJwtInfo()
        {
            var jwtSigningKey = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY") ?? _config["JWT:SigningKey"];
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _config["JWT:Issuer"];
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _config["JWT:Audience"];
            
            return Ok(new {
                keyLength = jwtSigningKey?.Length ?? 0,
                keyBits = (jwtSigningKey?.Length ?? 0) * 8,
                issuer = jwtIssuer,
                audience = jwtAudience,
                headers = Request.Headers.ContainsKey("Authorization") ? "Authorization header present" : "No Authorization header",
                authHeader = Request.Headers.ContainsKey("Authorization") ? 
                    Request.Headers["Authorization"].ToString().Substring(0, Math.Min(20, Request.Headers["Authorization"].ToString().Length)) + "..." : 
                    "Not provided"
            });
        }
    }
}