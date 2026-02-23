@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo === Git status ===
git status

echo.
echo === Adding all (respecting .gitignore) ===
git add .

echo.
echo === Status after add ===
git status

echo.
echo === Commit ===
git commit -m "Supplier panel i18n, dashboard for all, catalog by approved suppliers, register logo center"

echo.
echo === Push (if remote exists) ===
git push

pause
