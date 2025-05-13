@echo on
setlocal EnableDelayedExpansion

set "fileName="

for /f %%F in ('dir /b /a:-d "wweb-bot-sheet-*"') do (
    set "fileName=%%F"
    goto :break
)

:break

:: Configuration
set "ENV_FILE=.env"
set "KEY=MY_VAR"
set "GKFP=%fileName%"

:: Temp file
set "TEMP_FILE=%ENV_FILE%.tmp"

:: Flag to check if key was updated
set "found=0"

:: Loop through .env and update or copy lines
(for /f "usebackq delims=" %%A in ("%ENV_FILE%") do (
    set "line=%%A"
    echo !line! | findstr /b /c:"%KEY%=" >nul
    if !errorlevel! equ 0 (
        echo %KEY%=%VALUE%
        set "found=1"
    ) else (
        echo !line!
    )
)) > "%TEMP_FILE%"

:: If key not found, append it
if "%found%"=="0" (
    echo %KEY%=%VALUE%>>"%TEMP_FILE%"
)

:: Replace original file
move /Y "%TEMP_FILE%" "%ENV_FILE%" >nul

echo Updated %KEY% in %ENV_FILE%

cd /d "C:\wwebjs-bot-sheet"
call npm start
echo Exit code: %ERRORLEVEL%
pause