# STEP 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# STEP 2: Build image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "./services/auth/AuthService.API/AuthService.API.csproj"
RUN dotnet build "./services/auth/AuthService.API/AuthService.API.csproj" -c Release -o /app/build

# STEP 3: Publish
FROM build AS publish
RUN dotnet publish "./services/auth/AuthService.API/AuthService.API.csproj" -c Release -o /app/publish

# STEP 4: Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AuthService.API.dll"]