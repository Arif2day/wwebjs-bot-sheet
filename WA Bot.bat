@echo on
cd /d "C:\wwebjs-bot-sheet"
call npm start
echo Exit code: %ERRORLEVEL%
pause