#!/usr/bin/env bash
set -Eeuo pipefail

project_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
release_version='1.15.1'
archive="$project_root/ponkodactyl-v${release_version}.tar.gz"
temporary_archive=$(mktemp "${TMPDIR:-/tmp}/ponkodactyl-v${release_version}.XXXXXX")

cleanup() {
    rm -f "$temporary_archive"
}
trap cleanup EXIT

if ! grep -Fq "'version' => '${release_version}'," "$project_root/config/app.php"; then
    echo "config/app.php must target Pterodactyl ${release_version} before packaging." >&2
    exit 1
fi

if ! command -v yarn >/dev/null; then
    echo 'Install Node.js 22+ and Yarn 1 before building the release.' >&2
    exit 1
fi

cd "$project_root"
yarn build:production

tar -czf "$temporary_archive" \
    --exclude='./.git' \
    --exclude='./.env*' \
    --exclude='./vendor' \
    --exclude='./node_modules' \
    --exclude='./storage' \
    --exclude='./public/storage' \
    --exclude='./database/*.sqlite' \
    --exclude='./bootstrap/cache/*.php' \
    --exclude='./ponkodactyl.zip' \
    --exclude='./deploy-ponkodactyl.ps1' \
    --exclude='./ponkodactyl-*.tar.gz' \
    --exclude='./ponkodactyl-*.tar.gz.sha256' \
    -C "$project_root" .

mv "$temporary_archive" "$archive"
trap - EXIT
sha256sum "$archive"
printf 'Release ready: %s\n' "$archive"