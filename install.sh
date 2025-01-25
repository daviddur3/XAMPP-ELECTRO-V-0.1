#!/bin/bash

# Script de instalación para Web Services Manager

# Verificar permisos de administrador
if [[ $EUID -ne 0 ]]; then
   echo "Este script debe ejecutarse como root" 
   exit 1
fi

# Definir variables
INSTALL_DIR="/opt/web-services-manager"
LOG_FILE="/var/log/web-services-manager-install.log"

# Función de registro
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a $LOG_FILE
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    dependencies=("node" "npm" "git")
    for dep in "${dependencies[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log "Instalando $dep..."
            case "$dep" in
                "node")
                    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
                    apt-get install -y nodejs
                    ;;
                "npm")
                    apt-get install -y npm
                    ;;
                "git")
                    apt-get install -y git
                    ;;
            esac
        fi
    done
}

# Clonar repositorio
clone_repository() {
    log "Clonando repositorio..."
    git clone https://github.com/tu-organizacion/web-services-manager.git $INSTALL_DIR
}

# Instalar dependencias del proyecto
install_dependencies() {
    log "Instalando dependencias del proyecto..."
    cd $INSTALL_DIR
    npm install
}

# Configurar permisos
set_permissions() {
    log "Configurando permisos..."
    chown -R root:root $INSTALL_DIR
    chmod -R 755 $INSTALL_DIR
}

# Crear enlaces simbólicos
create_symlinks() {
    log "Creando enlaces simbólicos..."
    ln -sf $INSTALL_DIR/bin/web-services-manager /usr/local/bin/wsm
}

# Menú principal de instalación
main() {
    log "Iniciando instalación de Web Services Manager"
    
    check_dependencies
    clone_repository
    install_dependencies
    set_permissions
    create_symlinks

    log "Instalación completada exitosamente"
}

# Ejecutar instalación
main
