# One-shot download of Swiss road-sign SVGs from Wikimedia Commons.
#
# Polite rate: ~1.5s between requests, custom User-Agent per WMF policy.
# Reads filename mappings from signs-manifest.tsv (UTF-8) so umlauts survive.
# Skips files that already exist.
#
# Licensing: SSV-defined road signs are Swiss federal-official signs and
# fall under URG Art. 5 (official acts — no copyright). Wikimedia renders
# are typically tagged {PD-Switzerland-official} or {PD-shape}. See
# public/signs/ATTRIBUTION.md for the per-file record.
#
# Run from the repo root:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/download-signs.ps1

$ErrorActionPreference = "Stop"
$OutDir = Resolve-Path (Join-Path (Join-Path (Join-Path $PSScriptRoot "..") "public") "signs")
$Manifest = Join-Path $PSScriptRoot "signs-manifest.tsv"
$UA = "SwissTheoryPrep/0.1 (personal study app; alexanderzheludev@gmail.com)"
$Base = "https://commons.wikimedia.org/wiki/Special:FilePath/"

# PS5.1's `Invoke-WebRequest -OutFile` honors the protocol's encoding header,
# but the URL itself must be byte-correct UTF-8. Reading the TSV with -Encoding
# UTF8 ensures the umlauts survive the journey.
$lines = Get-Content -Path $Manifest -Encoding UTF8

$failed = @()
$ok = 0
$skipped = 0
foreach ($line in $lines) {
    if (-not $line.Trim()) { continue }
    $parts = $line -split "`t", 2
    if ($parts.Count -ne 2) { continue }
    $code = $parts[0].Trim()
    $fname = $parts[1].Trim()
    $dest = Join-Path $OutDir "$code.svg"
    if ((Test-Path $dest) -and ((Get-Item $dest).Length -ge 200)) {
        $skipped++
        continue
    }
    $encoded = [uri]::EscapeDataString($fname)
    $url = "$Base$encoded"
    try {
        Invoke-WebRequest -Uri $url -UserAgent $UA -OutFile $dest -UseBasicParsing -TimeoutSec 30
        $size = (Get-Item $dest).Length
        if ($size -lt 200) {
            Remove-Item $dest -Force
            throw "suspiciously small ($size bytes)"
        }
        Write-Host "ok  $code  ($size bytes)"
        $ok++
    } catch {
        Write-Host "ERR $code  $fname  => $($_.Exception.Message)"
        $failed += "$code`t$fname"
    }
    Start-Sleep -Milliseconds 1500
}

Write-Host ""
Write-Host "Downloaded $ok new, skipped $skipped existing."
if ($failed.Count -gt 0) {
    Write-Host "FAILURES:"
    $failed | ForEach-Object { Write-Host "  $_" }
    exit 1
}
