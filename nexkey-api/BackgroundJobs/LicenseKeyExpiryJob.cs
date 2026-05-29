using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NexKey.Api.Interfaces;

namespace NexKey.Api.BackgroundJobs;

public class LicenseKeyExpiryJob : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<LicenseKeyExpiryJob> _logger;

    public LicenseKeyExpiryJob(IServiceProvider services, ILogger<LicenseKeyExpiryJob> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var keyService = scope.ServiceProvider.GetRequiredService<ILicenseKeyService>();
                await keyService.UpdateExpiredKeysAsync();
                _logger.LogInformation("License key expiry check completed at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running license key expiry job");
            }

            // Run once per day
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
