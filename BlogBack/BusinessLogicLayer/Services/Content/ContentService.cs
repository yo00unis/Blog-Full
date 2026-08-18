using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Context;
using DataAccessLayer.DTOs.Pagenation;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogicLayer.Services.Content;

public class ContentService : IContentService
{
    private readonly BlogDbContext _context;

    public ContentService(BlogDbContext context) { _context = context; }

    public async Task<ContentItem> AddPostAsync(string title, string content)
    {
        var item = new ContentItem { Title = title, Content = content, MediaType = "Post" };
        await _context.ContentItems.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<ContentItem> AddMediaAsync(string url, string mediaType)
    {
        var item = new ContentItem { Url = url, MediaType = mediaType };
        await _context.ContentItems.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> UpdateContentAsync(int id, string? title, string? content, string? url)
    {
        var item = await _context.ContentItems.FindAsync(id);
        if (item == null) return false;

        if (item.MediaType == "Post")
        {
            item.Title = title ?? item.Title;
            item.Content = content ?? item.Content;
        }
        else
        {
            item.Url = url;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ContentItem?> GetByIdAsync(int id)
    {
        return await _context.ContentItems.FindAsync(id);
    }

    public async Task<PagedResult<ContentItem>> GetAllAsync(PaginationParams paginationParams, string? mediaType = null)
    {
        var query = _context.ContentItems.AsQueryable();

        if (!string.IsNullOrEmpty(mediaType))
        {
            query = query.Where(c => c.MediaType.ToLower() == mediaType.ToLower());
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync();

        return new PagedResult<ContentItem>
        {
            PageNumber = paginationParams.PageNumber,
            PageSize = paginationParams.PageSize,
            TotalCount = totalCount,
            Items = items
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _context.ContentItems.FindAsync(id);
        if (item == null)
            return false;

        _context.ContentItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

}