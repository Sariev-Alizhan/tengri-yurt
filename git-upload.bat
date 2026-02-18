@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo === Git: add all ===
git add .
echo === Git: status ===
git status
echo.
echo === Git: commit ===
git commit -m "Update: gallery, footer, contacts, CTA, responsive"
if errorlevel 1 (
    echo No changes to commit or commit failed.
) else (
    echo Commit OK. Now run: git push -u origin main
)
pause
