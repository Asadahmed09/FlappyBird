@echo off
cd /d "c:\Users\asad ahmed\Desktop\flapyBird"

echo Attempting to create directories with Python...
python -c "import os; dirs = ['src/components/Game', 'src/components/UI', 'src/components/Layout', 'src/hooks', 'src/contexts', 'src/utils', 'src/types']; [os.makedirs(d, exist_ok=True) for d in dirs]; print('Directories created')"

if errorlevel 1 (
    echo Python not available, using Node.js instead...
    node create-dirs.js
)

echo.
echo Showing directory structure:
tree src /F

pause
