---
title: Remote client's IP in server side Blazor (2021)
date: '2021-03-14'
tags: ['blazor']
draft: false
summary: How to get remote client IP address in server side Blazor
---

## Two approaches

### Approach 1: Call external service using JavaScript

Pros:

- Slightly more simpler if you are using reverse proxy like nginx, traefik

Cons:

- May be blocked by external extensions/adblockers
- You will have to configure CORS

#### `_Host.cshtml`

```html
<script>
  window.getIpAddress = () => {
    return fetch('https://jsonip.com/')
      .then((response) => response.json())
      .then((data) => {
        return data.ip
      })
  }
</script>
```

#### `RazorPage.razor.cs`

```cs
    public partial class RazorPage : ComponentBase
    {
        [Inject] public IJSRuntime jsRuntime { get; set; }

        public async Task<string> GetIpAddress()
        {
            try
            {
                var ipAddress = await jsRuntime.InvokeAsync<string>("getIpAddress")
                    .ConfigureAwait(true);
                return ipAddress;
            }
            catch(Exception e)
            {
                //If your request was blocked by CORS or some extension like uBlock Origin then you will get an exception.
                return string.Empty;
            }
        }
    }
```

#### `Startup.cs`

```cs
        public void ConfigureServices(IServiceCollection services)
        {
            //code...
            services
                .AddCors(x => x.AddPolicy("externalRequests",
                    policy => policy
                .WithOrigins("https://jsonip.com")));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //code...
            app.UseCors("externalRequests");
        }
```

### Approach 2: Expose an endpoint in our Blazor app and call it using JavaScript

Pros:

- You won't have to configure CORS
- Won't be blocked by extensions or adblockers

Cons:

- May be slightly more complicated if you are using a reverse proxy like nginx, traefik, etc.

Now take care as you will use this approach, because if you are using a reverse proxy, then you will actually receive your reverse proxy IP address.
It is very possible that your reverse proxy is already forwarding an IP address of the external client in some sort of header, but it is up to you to figure it out.

Example: https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/

#### `InfoController.cs`

```cs
    [Route("api/[controller]")]
    [ApiController]
    public class InfoController : ControllerBase
    {
        [HttpGet]
        [Route("ipaddress")]
        public async Task<string> GetIpAddress()
        {
            var remoteIpAddress = this.HttpContext.Request.HttpContext.Connection.RemoteIpAddress;
            if (remoteIpAddress != null)
                return remoteIpAddress.ToString();
            return string.Empty;
        }
    }
```

#### `Startup.cs`

```cs
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers(); //remember to map controllers if you don't have this line
                endpoints.MapBlazorHub();
                endpoints.MapFallbackToPage("/_Host");
            });
```

#### `_Host.cshtml`

```html
<script>
  window.getIpAddress = () => {
    return fetch('/api/info/ipaddress')
      .then((response) => response.text())
      .then((data) => {
        return data
      })
  }
</script>
```

#### `RazorPage.razor.cs`

```cs
    public partial class RazorPage : ComponentBase
    {
        [Inject] public IJSRuntime jsRuntime { get; set; }

        public async Task<string> GetIpAddress()
        {
            try
            {
                var ipAddress = await jsRuntime.InvokeAsync<string>("getIpAddress")
                    .ConfigureAwait(true);
                return ipAddress;
            }
            catch(Exception e)
            {
                //If your request was blocked by CORS or some extension like uBlock Origin then you will get an exception.
                return string.Empty;
            }
        }
    }
```
