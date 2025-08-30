@echo off
echo 🚀 Gender Reveal Website Deployment Script
echo ==========================================
echo.

REM Check if git is configured
git config --get user.name >nul 2>&1
if errorlevel 1 (
    echo ❌ Git user not configured. Please run:
    echo    git config --global user.name "Your Name"
    echo    git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)

echo ✅ Git is configured
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "js\rsvp.js" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Project files found
echo.

REM Check if we have uncommitted changes
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    echo 📝 You have uncommitted changes. Committing them now...
    git add .
    git commit -m "Update before deployment"
    echo ✅ Changes committed
) else (
    echo ✅ No uncommitted changes
)

echo.

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    pause
    exit /b 1
) else (
    echo ✅ Successfully pushed to GitHub
    echo.
    echo 🌐 Next steps:
    echo 1. Go to https://netlify.com
    echo 2. Click "New site from Git"
    echo 3. Choose GitHub and select your repository
    echo 4. Deploy with these settings:
    echo    - Build command: ^(leave empty^)
    echo    - Publish directory: .
    echo 5. Set environment variables in Netlify dashboard:
    echo    - SUPABASE_URL
    echo    - SUPABASE_ANON_KEY
    echo.
    echo 📚 See SETUP.md for detailed instructions
)

pause
