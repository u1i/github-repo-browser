#!/bin/bash

# Ensure we're in the project root
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found. Make sure you're in the project root and have built the project."
    exit 1
fi

# Save the current branch name
current_branch=$(git branch --show-current)

# Check if gh-pages branch exists
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "Creating gh-pages branch..."
    git checkout --orphan gh-pages
    git rm -rf .
else
    echo "Switching to gh-pages branch..."
    git checkout gh-pages
    # Clean the working directory
    git rm -rf .
fi

# Copy dist contents to root
cp -r dist/* .

# Add all changes
git add .

# Commit
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to gh-pages
git push origin gh-pages --force

# Switch back to original branch
echo "Switching back to $current_branch branch..."
git checkout $current_branch

echo "Deployment complete!"
