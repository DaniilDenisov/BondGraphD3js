:: Create the venv with Python only.
@echo off
setlocal

:: Set python path (where the installed Python executable is)
set python_path=C:\Users\user\AppData\Local\Programs\Python\Python312\

:: Default venv name is 'venv'
set default_venv_name=venv

:: Ask for the name of the new virtual environment, default to 'venv' if nothing is entered
echo Creating virtual environment in the current folder.
set /p venv_name="Enter the name for the new virtual environment (default: %default_venv_name%): "

:: Use default name if no input is provided
if "%venv_name%"=="" set venv_name=%default_venv_name%

:: Check if the folder already exists
if exist %venv_name%\ (
    echo The virtual environment '%venv_name%' already exists. No need to create a new one.
) else (
    :: Create the virtual environment if the folder does not exist
    %python_path%python.exe -m venv %venv_name%
    
    :: Activate the virtual environment
    call %venv_name%\Scripts\activate

    :: Upgrade pip
    python -m pip install --upgrade pip

    :: Deactivate the virtual environment
    deactivate

    echo Virtual environment '%venv_name%' created successfully.
)

pause
endlocal

:: Keep the command prompt window open
cmd /k
