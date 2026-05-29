using NexKey.Api.Models.DTOs.Articles;

namespace NexKey.Api.Interfaces;

public interface IArticleService
{
    Task<(List<ArticleDto> Items, int Total)> GetListAsync(ArticleQueryParams query);
    Task<ArticleDto> GetByIdAsync(string id);
    Task<ArticleDto> GetBySlugAsync(string slug);
    Task<ArticleDto> CreateAsync(CreateArticleRequest request);
    Task<ArticleDto> UpdateAsync(string id, UpdateArticleRequest request);
    Task DeleteAsync(string id);
    Task<ArticleDto> PublishAsync(string id);
}
