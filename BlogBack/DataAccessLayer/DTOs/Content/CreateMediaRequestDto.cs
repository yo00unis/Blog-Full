using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DTOs.Content;

public class CreateMediaRequestDto
{
    [Required]
    public string Url { get; set; } = string.Empty;

    [Required]
    public string MediaType { get; set; } = string.Empty; // Image, Video, Audio
}
