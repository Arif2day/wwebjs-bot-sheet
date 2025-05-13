@echo off
setlocal EnableDelayedExpansion

:: Config
set "prefix=wweb-bot-sheet-"
set "envFile=.env"
set "key=GKFP"
set "tempFile=%envFile%.tmp"
set "foundFile="

:: Step 1: Find the first file starting with 'wweb-bot-sheet-'
for /f %%F in ('dir /b /a:-d "%prefix%*"') do (
    set "foundFile=%%F"
    goto :found
)

:found
if not defined foundFile (
    echo No file starting with %prefix% found.
    exit /b 1
)

:: Step 2: Update or add to .env
set "foundKey=0"

(for /f "usebackq delims=" %%L in ("%envFile%") do (
    set "line=%%L"
    echo !line! | findstr /b /c:"%key%=" >nul
    if !errorlevel! equ 0 (
        echo %key%=%foundFile%
        set "foundKey=1"
    ) else (
        echo !line!
    )
)) > "%tempFile%"

if "!foundKey!"=="0" (
    echo %key%=%foundFile%>>"%tempFile%"
)

move /Y "%tempFile%" "%envFile%" >nul
echo Updated %key%=%foundFile% in %envFile%


@echo on
cd /d "C:\wwebjs-bot-sheet"
call npm start
echo Exit code: %ERRORLEVEL%
pause