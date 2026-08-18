#!/bin/bash

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
BUILD_DIR="${BUILD_DIR:?BUILD_DIR is required}"
PYTHON_VERSION="${PYTHON_VERSION:-3.12}"
NEXT_DIST_DIR="$BUILD_DIR/next-service-dist"
PYTHON_RUNTIME_DIR="$BUILD_DIR/python-runtime"
PYTHON_PACKAGES_DIR="$PYTHON_RUNTIME_DIR/site-packages"

has_python_sources() {
    find "$PROJECT_DIR" \
        \( -type d \( -name '.git' \
        -o -name '.next' \
        -o -name '.venv' \
        -o -name 'node_modules' \
        -o -name '__pycache__' \
        -o -name 'mini-services' \
        -o -name 'upload' \
        -o -name 'download' \
        \) -prune \) \
        -o -type f \( -name '*.py' -o -name '*.pyi' \) -print -quit | grep -q .
}

if ! has_python_sources \
    && [ ! -f "$PROJECT_DIR/requirements.txt" ] \
    && [ ! -f "$PROJECT_DIR/pyproject.toml" ]; then
    echo "ℹ️  No Python source or dependency manifest detected, skipping Python runtime build"
    exit 0
fi

if ! command -v uv >/dev/null 2>&1; then
    echo "❌ A Python project was detected, but uv is not available in the build environment"
    exit 1
fi

echo "🐍 Python runtime detected, target version: $PYTHON_VERSION"
mkdir -p "$NEXT_DIST_DIR" "$PYTHON_PACKAGES_DIR"

install_requirements() {
    local requirements_file="$1"
    local target_dir="${2:-$PYTHON_PACKAGES_DIR}"
    if [ ! -s "$requirements_file" ]; then
        echo "ℹ️  Python dependency manifest is empty, skipping dependency install"
        return 0
    fi

    echo "📦 Freezing Python production dependencies from $(basename "$requirements_file")..."
    uv pip install \
        --python "$PYTHON_VERSION" \
        --target "$target_dir" \
        --requirements "$requirements_file"

    # --target-generated console scripts keep the build machine's absolute Python shebang.
    # Rewrite it to a python resolvable inside the Runner; start scripts add this bin
    # directory to PATH.
    if [ -d "$target_dir/bin" ]; then
        for script in "$target_dir"/bin/*; do
            [ -f "$script" ] || continue
            perl -0pi -e 's/\A#![^\n]*python[^\n]*\n/#!\/usr\/bin\/env python\n/' "$script"
        done
    fi
}

install_pyproject() {
    local project_dir="$1"
    local target_dir="$2"
    local output_name="$3"
    local requirements_file="$PYTHON_RUNTIME_DIR/$output_name"

    if [ -f "$project_dir/uv.lock" ]; then
        uv export \
            --project "$project_dir" \
            --frozen \
            --no-dev \
            --no-emit-project \
            --format requirements.txt \
            --output-file "$requirements_file"
    else
        uv pip compile \
            "$project_dir/pyproject.toml" \
            --python-version "$PYTHON_VERSION" \
            --output-file "$requirements_file"
    fi
    install_requirements "$requirements_file" "$target_dir"
}

if [ -f "$PROJECT_DIR/pyproject.toml" ] && [ -f "$PROJECT_DIR/uv.lock" ]; then
    echo "🔒 Exporting production dependencies using pyproject.toml + uv.lock..."
    install_pyproject "$PROJECT_DIR" "$PYTHON_PACKAGES_DIR" "requirements.lock.txt"
elif [ -f "$PROJECT_DIR/requirements.txt" ]; then
    cp "$PROJECT_DIR/requirements.txt" "$PYTHON_RUNTIME_DIR/requirements.txt"
    install_requirements "$PYTHON_RUNTIME_DIR/requirements.txt"
elif [ -f "$PROJECT_DIR/pyproject.toml" ]; then
    echo "📦 pyproject.toml has no accompanying uv.lock, resolving production dependencies..."
    install_pyproject "$PROJECT_DIR" "$PYTHON_PACKAGES_DIR" "requirements.txt"
else
    echo "⚠️  Python source detected, but no requirements.txt or pyproject.toml; only the Python standard library is supported"
fi

if has_python_sources; then
    echo "📄 Copying Python source to the deployment project, preserving relative paths..."
    (
        cd "$PROJECT_DIR"
        find . \
            \( -type d \( -name '.git' \
            -o -name '.next' \
            -o -name '.venv' \
            -o -name 'node_modules' \
            -o -name '__pycache__' \
            -o -name 'mini-services' \
            -o -name 'upload' \
            -o -name 'download' \
            \) -prune \) \
            -o -type f \( -name '*.py' -o -name '*.pyi' \) -print0 \
            | tar --null -T - -cf -
    ) | tar -C "$NEXT_DIST_DIR" -xf -
fi

echo "✅ Python runtime frozen into the deployment artifact"
