using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Context;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccessLayer.Seeders;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        // 1. Seeding Users
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        var usersData = new Dictionary<string, string>
        {
            {"ymtawfiq2003@gmail.com", "22" },
            {"fatmaeed2001@gmail.com", "22" },
        };

        foreach(var userData in usersData)
        {
            var user = await userManager.FindByEmailAsync(userData.Key);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = userData.Key,
                    Email = userData.Key,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, userData.Value);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(x => x.Description));
                    throw new Exception($"Failed to create default admin user: {errors}");
                }
            }
        }

        

        // 2. Seeding Posts and Media
        var context = services.GetRequiredService<BlogDbContext>();

        if (!await context.Categories.AnyAsync())
        {
            var techCategory = new Category { Name = "Technology" };
            var lifeCategory = new Category { Name = "Lifestyle" };

            context.Categories.AddRange(techCategory, lifeCategory);
            await context.SaveChangesAsync(); 

            var samplePosts = new List<Post>
            {
                new Post
                {
                    Title = "Welcome to my new blog!",
                    Content = "This is the first post on my blog...",
                    CreatedAt = DateTime.UtcNow,
                    Category = techCategory, 
                    Medias = new List<Media>
                    {
                        new Media { Url = "https://example.com/images/intro.jpg", MediaType = "Image" }
                    }
                },
                new Post
                {
                    Title = "My Favorite Coding Playlist",
                    Content = "Here are some great music tracks...",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    Category = lifeCategory, 
                    Medias = new List<Media>
                    {
                        new Media { Url = "https://youtube.com/watch?v=example", MediaType = "Link" }
                    }
                }
            };

            await context.Posts.AddRangeAsync(samplePosts);
            await context.SaveChangesAsync();
        }
    }
}