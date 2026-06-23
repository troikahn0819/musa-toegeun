@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  오늘도 무사퇴근 개발 서버를 시작합니다.
echo  이 창을 닫으면 게임 서버도 종료됩니다.
echo.
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:5173'"
call npm run dev -- --host 127.0.0.1 --port 5173
echo.
echo 서버가 종료되었습니다.
pause
