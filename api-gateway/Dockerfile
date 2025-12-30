# STEP 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# STEP 2: Build image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "./api-gateway/ApiGateway.csproj"
RUN dotnet build "./api-gateway/ApiGateway.csproj" -c Release -o /app/build

# STEP 3: Publish
FROM build AS publish
RUN dotnet publish "./api-gateway/ApiGateway.csproj" -c Release -o /app/publish

# STEP 4: Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApiGateway.dll"]