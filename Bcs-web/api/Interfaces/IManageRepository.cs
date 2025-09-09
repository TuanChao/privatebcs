using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface IManageRepository
    {
        Task<List<Manage>> GetAll();
        Task<List<Manage>> GetAllType(string Type);
        Task<Manage> GetAsync(string id);
        Task AddAsync(Manage manage);
        Task UpdateAsync(MongoDB.Bson.ObjectId id, Manage manage);
        Task DeleteAsync(Manage manage);
        Task SaveChangesAsync();
        Task<IEnumerable<object>> GetByTypeAsync(DataType news);
        Task<Manage?> GetByIdAsync(string userId);
        Task UpdateAsync(Manage user);
    }
}