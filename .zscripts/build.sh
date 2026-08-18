#!/bin/bash

# Redirect stderr to stdout so execute_command does not fail on stderr output
exec 2>&1

set -e

# Get the directory containing this script (the .zscripts directory, i.e. workspace-agent/.zscripts)
# Use $0 to get the script path (works with both sh and bash)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Path of the Next.js project (the parent directory of .zscripts)
NEXTJS_PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Check whether the Next.js project directory exists
if [ ! -d "$NEXTJS_PROJECT_DIR" ]; then
    echo "❌ Error: Next.js project directory does not exist: $NEXTJS_PROJECT_DIR"
    exit 1
fi

echo "🚀 Starting the build of the Next.js app and mini-services..."
echo "📁 Next.js project path: $NEXTJS_PROJECT_DIR"

# Switch to the Next.js project directory
cd "$NEXTJS_PROJECT_DIR" || exit 1

# Set environment variables
export NEXT_TELEMETRY_DISABLED=1

BUILD_DIR="/tmp/build_fullstack_$BUILD_ID"
echo "📁 Cleaning up and creating build directory: $BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build the Next.js app
echo "🔨 Building the Next.js app..."
bun run build

# Verify that the standalone server entry is generated (deployment success guard).
# Next produces .next/standalone/server.js only when next.config has output:"standalone".
# If a user edits the project and changes or removes that setting, bun run build still
# succeeds (static output is produced as usual, exit code 0), but standalone is missing —
# the package has no server.js, so after deploying to FC, start.sh cannot find
# next-service-dist/server.js → Next never starts → Caddy:81 reverse-proxies an empty
# port 3000 → the FC health check times out after 120s (the main cause of warmup_412 /
# FunctionNotStarted in production). Here we self-heal: only when it is actually missing,
# add output:"standalone" back to next.config and rebuild. Normal projects (where
# server.js was already generated) skip this whole block and never read or write user files.
if [ ! -f ".next/standalone/server.js" ]; then
    echo "⚠️  Build did not produce .next/standalone/server.js; self-healing the next.config output setting..."
    NEXT_CONFIG_FILE="$(ls next.config.ts next.config.js next.config.mjs next.config.cjs 2>/dev/null | head -1)"

    if [ -z "$NEXT_CONFIG_FILE" ]; then
        echo "❌ Build failed: no next.config.* found, cannot generate the standalone deployment artifact."
        exit 1
    fi

    if grep -Eq "output\s*:\s*['\"]standalone['\"]" "$NEXT_CONFIG_FILE"; then
        # standalone is already declared but server.js was still not produced, so this is
        # not a missing-config case (the build may have genuinely failed, custom distDir,
        # etc.). Do not guess-modify the user's config; fail outright and surface the cause.
        echo "❌ Build failed: $NEXT_CONFIG_FILE already has output:\"standalone\", but .next/standalone/server.js was still not generated."
        echo "   Check the errors in the build log above or the project's custom build configuration."
        exit 1
    fi

    if grep -Eq "output\s*:\s*['\"]" "$NEXT_CONFIG_FILE"; then
        # A different output is explicitly declared (e.g. "export" static export, or any
        # value other than "standalone"). "export" is mutually exclusive with this
        # deployment model (standalone + custom server) — we cannot inject a second output
        # to override the user's intent (duplicate JS object keys: the later one wins, so
        # injection would be ineffective). Fail explicitly.
        echo "❌ Build failed: $NEXT_CONFIG_FILE declares a non-standalone output (e.g. \"export\" static export), which is incompatible with the current deployment model."
        echo "   The current deployment requires output:\"standalone\". Change it to standalone, or confirm whether this project should use static hosting instead of the deployment sandbox."
        exit 1
    fi

    echo "🔧 Detected that $NEXT_CONFIG_FILE is missing output:\"standalone\"; injecting it and rebuilding..."
    cp "$NEXT_CONFIG_FILE" "${NEXT_CONFIG_FILE}.zbak"
    # Insert output:"standalone" right after the opening { of the first config object
    # literal, covering common scaffold styles: const nextConfig...= {  /  export default {  /  module.exports = {
    perl -0pi -e 's/((?:const\s+\w+[^=]*=|export\s+default|module\.exports\s*=)\s*\{)/$1\n  output: "standalone",/' "$NEXT_CONFIG_FILE"

    if ! grep -Eq "output\s*:\s*['\"]standalone['\"]" "$NEXT_CONFIG_FILE"; then
        echo "❌ Could not match an injectable config object; the next.config syntax is unconventional and needs output:\"standalone\" added manually."
        echo "   Current $NEXT_CONFIG_FILE contents:"
        cat "$NEXT_CONFIG_FILE"
        mv "${NEXT_CONFIG_FILE}.zbak" "$NEXT_CONFIG_FILE"
        exit 1
    fi

    echo "🔨 Injected output:\"standalone\"; rebuilding..."
    bun run build

    if [ ! -f ".next/standalone/server.js" ]; then
        echo "❌ After injecting output:\"standalone\" and rebuilding, .next/standalone/server.js was still not generated."
        exit 1
    fi
    echo "✅ Self-heal succeeded: the standalone server entry was generated."
fi

# Build mini-services
# Check whether the Next.js project has a mini-services directory
if [ -d "$NEXTJS_PROJECT_DIR/mini-services" ]; then
    echo "🔨 Building mini-services..."
    # Use the mini-services scripts from the workspace-agent directory
    sh "$SCRIPT_DIR/mini-services-install.sh"
    sh "$SCRIPT_DIR/mini-services-build.sh"

    # Copy mini-services-start.sh to the mini-services-dist directory
    echo "  - Copying mini-services-start.sh to $BUILD_DIR"
    cp "$SCRIPT_DIR/mini-services-start.sh" "$BUILD_DIR/mini-services-start.sh"
    chmod +x "$BUILD_DIR/mini-services-start.sh"
else
    echo "ℹ️  mini-services directory does not exist, skipping"
fi

# Copy all build artifacts to the temporary build directory
echo "📦 Collecting build artifacts into $BUILD_DIR..."

# Copy the Next.js standalone build output
if [ -d ".next/standalone" ]; then
    echo "  - Copying .next/standalone"
    cp -r .next/standalone "$BUILD_DIR/next-service-dist/"
fi

# Copy the Next.js static files
if [ -d ".next/static" ]; then
    echo "  - Copying .next/static"
    mkdir -p "$BUILD_DIR/next-service-dist/.next"
    cp -r .next/static "$BUILD_DIR/next-service-dist/.next/"
fi

# Copy the public directory
if [ -d "public" ]; then
    echo "  - Copying public"
    cp -r public "$BUILD_DIR/next-service-dist/"
fi

# Python does not inherit workspace-agent's /home/z/.venv. If the project contains Python
# source or a dependency manifest, freeze the production dependencies into the artifact at
# build time and preserve the project-relative paths of the Python source.
PROJECT_DIR="$NEXTJS_PROJECT_DIR" BUILD_DIR="$BUILD_DIR" \
    bash "$SCRIPT_DIR/python-runtime-build.sh"

# Copy the Caddyfile (if present)
if [ -f "Caddyfile" ]; then
    echo "  - Copying Caddyfile"
    cp Caddyfile "$BUILD_DIR/"
else
    echo "ℹ️  Caddyfile does not exist, skipping"
fi

# Copy the start.sh script
echo "  - Copying start.sh to $BUILD_DIR"
cp "$SCRIPT_DIR/start.sh" "$BUILD_DIR/start.sh"
chmod +x "$BUILD_DIR/start.sh"

# Package into $BUILD_DIR.tar.gz
PACKAGE_FILE="${BUILD_DIR}.tar.gz"
echo ""
echo "📦 Packaging build artifacts into $PACKAGE_FILE..."
cd "$BUILD_DIR" || exit 1
tar -czf "$PACKAGE_FILE" .
cd - > /dev/null || exit 1

# # Clean up the temporary directory
# rm -rf "$BUILD_DIR"

echo ""
echo "✅ Build complete! All artifacts packaged into $PACKAGE_FILE"
echo "📊 Package file size:"
ls -lh "$PACKAGE_FILE"
