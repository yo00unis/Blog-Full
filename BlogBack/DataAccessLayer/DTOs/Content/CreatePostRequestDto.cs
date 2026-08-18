using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DTOs.Content;

public class CreatePostRequestDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string? Content { get; set; }
}