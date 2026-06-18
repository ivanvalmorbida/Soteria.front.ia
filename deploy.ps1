param(
    [string]$ApiUrl = "/soteria/api",
    [string]$Base = "/soteria/",
    [string]$BackendUrl = "https://soteria-backend-node-sqlite.vercel.app",
    [string]$Destino = "C:\inetpub\wwwroot\soteria",
    [string]$IisAppName = "soteria"
)

Write-Host "=== Deploy Soteria Frontend ===" -ForegroundColor Cyan

$origApiUrl = $env:VITE_API_URL
$env:VITE_API_URL = $ApiUrl

try {
    Write-Host "`n[1/3] Buildando com --base=$Base e VITE_API_URL=$ApiUrl ..." -ForegroundColor Yellow
    npx vite build --base=$Base
    if (-not $?) { throw "Build falhou" }

    Write-Host "`n[2/3] Copiando para $Destino ..." -ForegroundColor Yellow
    if (-not (Test-Path $Destino)) {
        New-Item -ItemType Directory -Path $Destino -Force | Out-Null
    }
    Copy-Item -Path "dist\*" -Destination $Destino -Recurse -Force

    Write-Host "`n[3/3] Ajustando web.config (API proxy -> $BackendUrl) ..." -ForegroundColor Yellow
    $webConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
    </staticContent>
    <rewrite>
      <rules>
        <rule name="API Proxy" stopProcessing="true">
          <match url="^api/(.*)" />
          <action type="Rewrite" url="$BackendUrl/api/{R:1}" />
        </rule>
        <rule name="SPA Fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^$Base/api/" negate="true" />
          </conditions>
          <action type="Rewrite" url="$($Base)index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
"@
    Set-Content -Path "$Destino\web.config" -Value $webConfig -Encoding UTF8

    Write-Host "`n=== Deploy concluido! ===" -ForegroundColor Green
    Write-Host "Acesse: http://localhost:80/soteria/" -ForegroundColor Cyan
}
finally {
    if ($origApiUrl) { $env:VITE_API_URL = $origApiUrl }
    else { Remove-Item Env:\VITE_API_URL -ErrorAction SilentlyContinue }
}
