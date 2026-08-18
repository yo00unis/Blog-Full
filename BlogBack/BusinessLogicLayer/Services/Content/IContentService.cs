using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs.Pagenation;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Content;

public interface IContentService
{
    Task<ContentItem> AddPostAsync(string title, string content);
    Task<ContentItem> AddMediaAsync(string url, string mediaType);
    Task<bool> UpdateContentAsync(int id, string? title, string? content, string? url);
    Task<ContentItem?> GetByIdAsync(int id);
    Task<PagedResult<ContentItem>> GetAllAsync(PaginationParams paginationParams, string? mediaType = null);
    Task<bool> DeleteAsync(int id);
}
