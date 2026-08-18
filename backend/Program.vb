Imports Microsoft.AspNetCore.Builder
Imports Microsoft.Extensions.DependencyInjection
Imports Microsoft.Extensions.Hosting

Module Program
    Sub Main(args As String())
        Dim builder = WebApplication.CreateBuilder(args)

        ' Add services to the container.
        builder.Services.AddControllers()
        
        ' Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer()
        builder.Services.AddSwaggerGen()

        ' Enable CORS to allow the frontend to connect
        builder.Services.AddCors(Sub(options)
                                     options.AddPolicy("AllowAll", Sub(policy)
                                                                       policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
                                                                   End Sub)
                                 End Sub)

        Dim app = builder.Build()

        ' Configure the HTTP request pipeline.
        If app.Environment.IsDevelopment() Then
            app.UseSwagger()
            app.UseSwaggerUI()
        End If

        app.UseHttpsRedirection()
        app.UseCors("AllowAll")
        app.UseAuthorization()
        app.MapControllers()

        app.Run()
    End Sub
End Module
