# Script de instalación para Web Services Manager

# Verificar permisos de administrador
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "Por favor, ejecute este script como Administrador"
    exit 1
}

# Variables de instalación
$INSTALL_DIR = "C:\Program Files\WebServicesManager"
$LOG_FILE = "C:\ProgramData\WebServicesManager\install.log"

# Función de registro
function Log-Message {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LOG_FILE -Value "[$timestamp] $Message"
    Write-Host $Message
}

# Verificar e instalar Chocolatey
function Install-Chocolatey {
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Log-Message "Instalando Chocolatey..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    }
}

# Instalar dependencias
function Install-Dependencies {
    Log-Message "Instalando dependencias..."
    choco install nodejs git -y
    refreshenv
}

# Clonar repositorio
function Clone-Repository {
    Log-Message "Clonando repositorio..."
    git clone https://github.com/tu-organizacion/web-services-manager.git $INSTALL_DIR
}

# Instalar dependencias del proyecto
function Install-ProjectDependencies {
    Log-Message "Instalando dependencias del proyecto..."
    Set-Location $INSTALL_DIR
    npm install
}

# Crear acceso directo
function Create-Shortcut {
    Log-Message "Creando acceso directo..."
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Web Services Manager.lnk")
    $Shortcut.TargetPath = "$INSTALL_DIR\web-services-manager.exe"
    $Shortcut.Save()
}

# Menú principal de instalación
function Main {
    Log-Message "Iniciando instalación de Web Services Manager"
    
    Install-Chocolatey
    Install-Dependencies
    Clone-Repository
    Install-ProjectDependencies
    Create-Shortcut

    Log-Message "Instalación completada exitosamente"
}

# Ejecutar instalación
Main
