@echo off
setlocal EnableDelayedExpansion

:: Define the search prefix and target env file
set "prefix=wweb-bot-sheet"
set "envFile=.env"
set "key=GKFP"

:: Step 1: Find the first matching file
set "foundFile="
for /f %%F in ('dir /b /a:-d "%prefix%*"') do (
    set "foundFile=%%F"
    goto :found
)

:found
if not defined foundFile (
    echo No file starting with "%prefix%" found.
    exit /b 1
)

:: Step 2: Append GKFP=filename to the .env file
>>"%envFile%" echo.
>>"%envFile%" echo %key%="%foundFile%"
echo Appended with blank line: %key%="%foundFile%" to %envFile%

@echo on
cd /d "C:\wwebjs-bot-sheet"
call npm start
echo Exit code: %ERRORLEVEL%
pause