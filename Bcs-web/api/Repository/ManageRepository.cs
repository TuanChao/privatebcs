using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using api.Interfaces;
using api.Models;
using System.Text.RegularExpressions;

namespace api.Repository
{
    public class ManageRepository : IManageRepository
    {
        private readonly IMongoCollection<Manage> _collection;

        public ManageRepository(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("BkavManage");
            _collection = database.GetCollection<Manage>("Manages");
            
            // Create indexes for better performance and security
            CreateIndexesAsync().ConfigureAwait(false);
        }

        private async Task CreateIndexesAsync()
        {
            try
            {
                // Index on Email for faster user lookup
                var emailIndexModel = new CreateIndexModel<Manage>(
                    Builders<Manage>.IndexKeys.Ascending(x => x.Email),
                    new CreateIndexOptions { Unique = true, Sparse = true }
                );
                
                // Index on Type for faster queries
                var typeIndexModel = new CreateIndexModel<Manage>(
                    Builders<Manage>.IndexKeys.Ascending(x => x.Type)
                );
                
                // Index on IsActive for faster filtering
                var activeIndexModel = new CreateIndexModel<Manage>(
                    Builders<Manage>.IndexKeys.Ascending(x => x.IsActive)
                );

                await _collection.Indexes.CreateManyAsync(new[] { emailIndexModel, typeIndexModel, activeIndexModel });
            }
            catch
            {
                // Indexes may already exist, ignore errors
            }
        }

        public async Task AddAsync(Manage manage)
        {
            // Validate input before insertion
            ValidateManageObject(manage);
            await _collection.InsertOneAsync(manage);
        }

        public async Task DeleteAsync(Manage manage)
        {
            if (manage?.Id == ObjectId.Empty)
                throw new ArgumentException("Invalid manage object for deletion");
                
            var filter = Builders<Manage>.Filter.Eq(x => x.Id, manage.Id);
            await _collection.DeleteOneAsync(filter);
        }

        public async Task<List<Manage>> GetAll()
        {
            var filter = Builders<Manage>.Filter.Empty;
            return await _collection.Find(filter).ToListAsync();
        }

        public async Task<List<Manage>> GetAllType(string type)
        {
            // Validate and parse the type parameter to prevent injection
            if (string.IsNullOrEmpty(type) || !Enum.TryParse<DataType>(type, true, out var dataType))
                return new List<Manage>();
                
            var filter = Builders<Manage>.Filter.Eq(x => x.Type, dataType);
            return await _collection.Find(filter).ToListAsync();
        }

        public async Task<Manage> GetAsync(string id)
        {
            // Strict validation of ObjectId format
            if (string.IsNullOrEmpty(id) || !ObjectId.TryParse(id, out var objectId))
                return null;
                
            var filter = Builders<Manage>.Filter.Eq(x => x.Id, objectId);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Secure method to find user by email with proper filtering
        /// </summary>
        public async Task<Manage> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email) || !IsValidEmail(email))
                return null;
                
            var filter = Builders<Manage>.Filter.And(
                Builders<Manage>.Filter.Eq(x => x.Email, email.ToLower().Trim()),
                Builders<Manage>.Filter.Eq(x => x.Type, DataType.User)
            );
            
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Get items by type with proper validation and filtering
        /// </summary>
        public async Task<List<Manage>> GetByTypeAsync(DataType type, bool activeOnly = false)
        {
            var filterBuilder = Builders<Manage>.Filter;
            var filter = filterBuilder.Eq(x => x.Type, type);
            
            if (activeOnly)
            {
                filter = filterBuilder.And(filter, filterBuilder.Eq(x => x.IsActive, true));
            }
            
            return await _collection.Find(filter).ToListAsync();
        }

        public Task<IEnumerable<object>> GetByTypeAsync(DataType news)
        {
            throw new NotImplementedException();
        }

        public Task SaveChangesAsync()
        {
            // MongoDB operations are immediate, so nothing to do here
            return Task.CompletedTask;
        }

        public async Task UpdateAsync(Manage manage)
        {
            // Validate input before update
            ValidateManageObject(manage);
            
            var filter = Builders<Manage>.Filter.Eq(x => x.Id, manage.Id);
            await _collection.ReplaceOneAsync(filter, manage);
        }

        /// <summary>
        /// Validates Manage object to prevent malicious data
        /// </summary>
        private static void ValidateManageObject(Manage manage)
        {
            if (manage == null)
                throw new ArgumentNullException(nameof(manage));

            // Validate email format if provided
            if (!string.IsNullOrEmpty(manage.Email) && !IsValidEmail(manage.Email))
                throw new ArgumentException("Invalid email format", nameof(manage.Email));

            // Sanitize string fields to prevent XSS
            if (!string.IsNullOrEmpty(manage.UserName))
                manage.UserName = SanitizeString(manage.UserName, 100);
                
            if (!string.IsNullOrEmpty(manage.Description))
                manage.Description = SanitizeString(manage.Description, 500);
                
            if (!string.IsNullOrEmpty(manage.Content))
                manage.Content = SanitizeString(manage.Content, 10000);
        }

        /// <summary>
        /// Validates email format
        /// </summary>
        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            return Regex.IsMatch(email, 
                @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", 
                RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(100));
        }

        /// <summary>
        /// Basic string sanitization with length limits
        /// </summary>
        private static string SanitizeString(string input, int maxLength)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            // Remove null bytes and control characters except newlines and tabs
            input = Regex.Replace(input, @"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", RegexOptions.None, TimeSpan.FromMilliseconds(100));
            
            // Trim whitespace and limit length
            input = input.Trim();
            if (input.Length > maxLength)
                input = input[..maxLength];

            return input;
        }

        /// <summary>
        /// Get user by ID with proper validation
        /// </summary>
        public async Task<Manage?> GetByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId) || !ObjectId.TryParse(userId, out var objectId))
                return null;
                
            var filter = Builders<Manage>.Filter.Eq(x => x.Id, objectId);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        public Task UpdateAsync(ObjectId id, Manage manage)
        {
            throw new NotImplementedException();
        }
    }
}