# Description: This script is used to build and push the docker image to the docker hub
# Usage: docker-make.ps1 [OPTIONS] [latest|dev]
# Options:
#   -b, --build: build the image
#   -p, --push: push the image
#   -r, --run: run the image
#   -h, --help: display the help message
#   If no options are provided, the script will build the image
# Arguments:
#   latest: script uses the tag 'latest'
#   dev: script uses the tag 'dev'
#   If no arguments are provided, the script uses the tag 'dev'
# Example:
#   docker-make.ps1 -br dev
#   docker-make.ps1 -bp latest


# Parse the command line arguments
# the arguments can be used with just their first letter, just like in linux
param (
    [switch]$build,
    [switch]$push,
    [switch]$run,
    [switch]$help,
    [string]$tag = "dev"
)

function help {
    Write-Host "Usage: docker-make.ps1 [OPTIONS] [latest|dev]"
    Write-Host "Options:"
    Write-Host "  -b, --build: build the image"
    Write-Host "  -p, --push: push the image"
    Write-Host "  -r, --run: run the image"
    Write-Host "  -h, --help: display the help message"
    Write-Host "  If no options are provided, the script will build the image"
    Write-Host "Arguments:"
    Write-Host "  latest: script uses the tag 'latest'"
    Write-Host "  dev: script uses the tag 'dev'"
    Write-Host "  If no arguments are provided, the script uses the tag 'dev'"
    Write-Host "Example:"
    Write-Host "  docker-make.ps1 -br dev"
    Write-Host "  docker-make.ps1 -bp latest"
}

if ($help) {
    help
    exit
}

$name = "reathe/armenian-alphabet"
$image = "${name}:${tag}"

# if all options are false, set build to true
if (-not $build -and -not $push -and -not $run) {
    $build = $true
}

if ($build) {
    Write-Host "Building the image..."
    docker build --platform linux/arm64/v8 -t $image .
}

if ($push) {
    Write-Host "Pushing the image..."
    docker push $image
}

if ($run) {
    Write-Host "Running the image..."
    docker run --rm -p 8080:8080 $image
}

exit
