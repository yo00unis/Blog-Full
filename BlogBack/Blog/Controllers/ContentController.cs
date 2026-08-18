using BusinessLogicLayer.Services.Content;
using DataAccessLayer.DTOs.Content;
using DataAccessLayer.DTOs.Pagenation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize] // لو حابب تحمي الـ Endpoints وتخليها للي مسجلين دخول فقط
public class ContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpPost("post")]
    public async Task<IActionResult> AddPost([FromBody] CreatePostRequestDto dto)
    {
        var result = await _contentService.AddPostAsync(dto.Title, dto.Content);
        return Ok(new { success = true, message = "Post added successfully", data = result });
    }

    [HttpPost("media")]
    public async Task<IActionResult> AddMedia([FromBody] CreateMediaRequestDto dto)
    {
        var result = await _contentService.AddMediaAsync(dto.Url, dto.MediaType);
        return Ok(new { success = true, message = "Media added successfully", data = result });
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams paginationParams, [FromQuery] string? mediaType)
    {
        var result = await _contentService.GetAllAsync(paginationParams, mediaType);
        return Ok(new { success = true, data = result });
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _contentService.GetByIdAsync(id);
        if (result == null)
            return NotFound(new { success = false, message = "Content not found" });

        return Ok(new { success = true, data = result });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateContentRequestDto dto)
    {
        var updated = await _contentService.UpdateContentAsync(id, dto.Title, dto.Content, dto.Url);
        if (!updated)
            return NotFound(new { success = false, message = "Content not found" });

        return Ok(new { success = true, message = "Content updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _contentService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { success = false, message = "Content not found" });

        return Ok(new { success = true, message = "Content deleted successfully" });
    }
}
