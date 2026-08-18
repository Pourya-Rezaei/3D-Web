#!/bin/bash

# Configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/../mini-services"

main() {
    echo "🚀 Starting batch dependency install..."
    
    # Check whether the root directory exists
    if [ ! -d "$ROOT_DIR" ]; then
        echo "ℹ️  Directory $ROOT_DIR does not exist, skipping install"
        return
    fi
    
    # Counters
    success_count=0
    fail_count=0
    failed_projects=""
    
    # Iterate over all folders under the mini-services directory
    for dir in "$ROOT_DIR"/*; do
        # Check whether it is a directory that contains a package.json
        if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
            project_name=$(basename "$dir")
            echo ""
            echo "📦 Installing dependencies: $project_name..."
            
            # Enter the project directory and run bun install
            if (cd "$dir" && bun install); then
                echo "✅ $project_name dependencies installed successfully"
                success_count=$((success_count + 1))
            else
                echo "❌ $project_name dependency install failed"
                fail_count=$((fail_count + 1))
                if [ -z "$failed_projects" ]; then
                    failed_projects="$project_name"
                else
                    failed_projects="$failed_projects $project_name"
                fi
            fi
        fi
    done
    
    # Summarize results
    echo ""
    echo "=================================================="
    if [ $success_count -gt 0 ] || [ $fail_count -gt 0 ]; then
        echo "🎉 Install complete!"
        echo "✅ Succeeded: $success_count"
        if [ $fail_count -gt 0 ]; then
            echo "❌ Failed: $fail_count"
            echo ""
            echo "Failed projects:"
            for project in $failed_projects; do
                echo "  - $project"
            done
        fi
    else
        echo "ℹ️  No projects with a package.json were found"
    fi
    echo "=================================================="
}

main

