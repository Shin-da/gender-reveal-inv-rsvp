#!/bin/bash

echo "🚀 Gender Reveal Website Deployment Script"
echo "=========================================="
echo ""

# Check if git is configured
if ! git config --get user.name > /dev/null 2>&1; then
    echo "❌ Git user not configured. Please run:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
    exit 1
fi

echo "✅ Git is configured"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "js/rsvp.js" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project files found"
echo ""

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Update before deployment"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Go to https://netlify.com"
    echo "2. Click 'New site from Git'"
    echo "3. Choose GitHub and select your repository"
    echo "4. Deploy with these settings:"
    echo "   - Build command: (leave empty)"
    echo "   - Publish directory: ."
    echo "5. Set environment variables in Netlify dashboard:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_ANON_KEY"
    echo ""
    echo "📚 See SETUP.md for detailed instructions"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi
