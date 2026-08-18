using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Models.Configurations;

public class ContentItemConfiguration : IEntityTypeConfiguration<ContentItem>
{
    public void Configure(EntityTypeBuilder<ContentItem> builder)
    {
        builder.ToTable("ContentItems");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.MediaType)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Post");

        builder.Property(c => c.Title)
            .HasMaxLength(200);

        builder.Property(c => c.Content)
            .HasColumnType("nvarchar(max)");

        builder.Property(c => c.Url)
            .HasMaxLength(1000);

        builder.Property(c => c.CreatedAt)
            .IsRequired();

        builder.Property(c => c.UpdatedAt)
            .IsRequired();
    }
}