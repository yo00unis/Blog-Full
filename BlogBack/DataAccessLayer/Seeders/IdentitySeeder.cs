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

        const string email = "ymtawfiq2003@gmail.com";
        const string password = "22";

        var user = await userManager.FindByEmailAsync(email);

        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(x => x.Description));
                throw new Exception($"Failed to create default admin user: {errors}");
            }
        }

        // 2. Seeding Posts and Media
        var context = services.GetRequiredService<BlogDbContext>();

        if (!await context.Posts.AnyAsync())
        {
            var samplePosts = new List<Post>
            {
                new Post
                {
                    Title = "Welcome to my new blog!",
                    Content = "This is the first post on my blog...",
                    CreatedAt = DateTime.UtcNow,
                    Medias = new List<Media>
                    {
                        new Media { Url = "https://example.com/images/intro.jpg", MediaType = "Image" },
                        new Media { Url = "https://example.com/music/welcome-track.mp3", MediaType = "Music" }
                    }
                },
                new Post
                {
                    Title = "My Favorite Coding Playlist",
                    Content = "Here are some great music tracks...",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    Medias = new List<Media>
                    {
                        new Media { Url = "https://example.com/music/lofi-beats.mp3", MediaType = "Music" },
                        new Media { Url = "https://youtube.com/watch?v=example", MediaType = "Link" }
                    }
                }
            };

            await context.Posts.AddRangeAsync(samplePosts);
            await context.SaveChangesAsync();
        }
    }
}