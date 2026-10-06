[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$')]
    [string] $Target,

    [ValidatePattern('^/[A-Za-z0-9._/-]+$')]
    [string] $PanelPath = '/var/www/pterodactyl',

    [string] $ArchivePath
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ArchivePath)) {
    $scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
    $ArchivePath = Join-Path $scriptDirectory 'ponkodactyl-v1.15.1.tar.gz'
}

if (-not (Test-Path -LiteralPath $ArchivePath -PathType Leaf)) {
    throw "Release archive not found: $ArchivePath"
}

$archive = (Resolve-Path -LiteralPath $ArchivePath).Path
$localHash = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
$remoteArchive = '/tmp/ponkodactyl-v1.15.1.tar.gz'
$staging = '/tmp/ponkodactyl-v1.15.1-' + [guid]::NewGuid().ToString('N').Substring(0, 8)

Write-Host "Uploading Ponkodactyl 1.15.1 to $Target..."
& scp $archive "${Target}:$remoteArchive"
if ($LASTEXITCODE -ne 0) {
    throw 'SCP failed. The VPS was not updated.'
}

Write-Host 'Verifying the uploaded archive...'
$remoteHashOutput = & ssh $Target "sha256sum '$remoteArchive'"
if ($LASTEXITCODE -ne 0) {
    throw 'Could not verify the VPS archive. The VPS was not updated.'
}

$remoteHash = ($remoteHashOutput -split '\s+')[0].ToLowerInvariant()
if ($remoteHash -ne $localHash) {
    throw "Archive checksum mismatch. Local: $localHash; VPS: $remoteHash. The VPS was not updated."
}

$remoteCommand = @"
set -e
sudo mkdir -p '$staging'
sudo tar -xzf '$remoteArchive' -C '$staging'
sudo '$staging/deploy-existing-panel.sh' '$PanelPath' '$remoteArchive'
"@

Write-Host 'Starting the guarded update. Confirm the panel hostname when prompted.'
& ssh -t $Target $remoteCommand
if ($LASTEXITCODE -ne 0) {
    throw 'The guarded update stopped. Check the VPS output; it leaves the panel in maintenance mode if deployment had begun.'
}

Write-Host 'Ponkodactyl update completed.'