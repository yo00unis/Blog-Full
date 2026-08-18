using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DTOs.Content;

public class UpdateContentRequestDto
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Url { get; set; }
}
