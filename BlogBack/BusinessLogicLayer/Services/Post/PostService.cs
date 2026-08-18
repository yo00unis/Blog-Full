using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Context;
using DataAccessLayer.DTOs.Medias;
using DataAccessLayer.DTOs.Pagenation;
using DataAccessLayer.DTOs.Posts;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SharedLayer.Helpers;

namespace BusinessLogicLayer.Services.Post;

public class PostService : IPostService
{
    private readonly BlogDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PostService(BlogDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PostResponseDto> CreatePostAsync(CreatePostDto dto)
    {
        var post = new DataAccessLayer.Models.Post
        {
            Title = dto.Title,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            Medias = dto.Medias.Select(m => new DataAccessLayer.Models.Media
            {
                Url = m.Url,
                MediaType = m.MediaType
            }).ToList()
        };

        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();

        // جلب الـ BaseUrl لتنسيق روابط الـ Media للداونلود
        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = $"{request?.Scheme}://{request?.Host}";

        // إرجاع PostResponseDto يمنع مشكلة الـ Object Cycle تماماً
        return new PostResponseDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Medias = post.Medias.Select(m => new MediaResponseDto
            {
                Id = m.Id,
                Url = PublicHelperShared.IsGuidFileName(m.Url)
                    ? $"{baseUrl}/api/Upload/download/{m.Url}"
                    : m.Url,
                MediaType = m.MediaType
            }).ToList()
        };
    }

    public async Task<PagedResult<PostResponseDto>> GetAllPostsAsync(PaginationParams paginationParams)
    {
        var totalCount = await _context.Posts.CountAsync();

        var posts = await _context.Posts
            .Include(p => p.Medias)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync();

        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = $"{request?.Scheme}://{request?.Host}";

        var postDtos = posts.Select(p => new PostResponseDto
        {
            Id = p.Id,
            Title = p.Title,
            Content = p.Content,
            CreatedAt = p.CreatedAt,
            Medias = p.Medias!.Select(m => new MediaResponseDto
            {
                Id = m.Id,
                Url = PublicHelperShared.IsGuidFileName(m.Url) ? $"{baseUrl}/api/Upload/download/{m.Url}" : m.Url,
                MediaType = m.MediaType
            }).ToList()
        }).ToList();

        return new PagedResult<PostResponseDto>
        {
            Items = postDtos,
            PageNumber = paginationParams.PageNumber,
            PageSize = paginationParams.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<PostResponseDto> GetPostByIdAsync(int id)
    {
        var post = await _context.Posts
            .Include(p => p.Medias)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
            throw new KeyNotFoundException("Post not found.");

        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = $"{request?.Scheme}://{request?.Host}";

        return new PostResponseDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Medias = post.Medias!.Select(m => new MediaResponseDto
            {
                Id = m.Id,
                Url = PublicHelperShared.IsGuidFileName(m.Url) ? $"{baseUrl}/api/Upload/download/{m.Url}" : m.Url,
                MediaType = m.MediaType
            }).ToList()
        };
    }

    public async Task<PostResponseDto?> UpdatePostAsync(int id, UpdatePostDto dto)
    {
        var post = await _context.Posts
            .Include(p => p.Medias)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
            return null;

        post.Title = dto.Title;
        post.Content = dto.Content;

        _context.Posts.Update(post);
        await _context.SaveChangesAsync();

        var request = _httpContextAccessor.HttpContext?.Request;
        var baseUrl = $"{request?.Scheme}://{request?.Host}";

        return new PostResponseDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Medias = post.Medias!.Select(m => new MediaResponseDto
            {
                Id = m.Id,
                Url = PublicHelperShared.IsGuidFileName(m.Url)
                    ? $"{baseUrl}/api/Upload/download/{m.Url}"
                    : m.Url,
                MediaType = m.MediaType
            }).ToList()
        };
    }

    public async Task<bool> DeletePostAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            return false; 

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return true;
    }

}
