#!/bin/bash

# Script de desinstalación

INSTALL_DIR="/opt/web-services-manager"
LOG_FILE="/var/log/web-services-manager-uninstall.log"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a $LOG_FILE
}

remove_installation() {
    log "Eliminando directorio de instalación..."
    rm -rf $INSTALL_DIR
}

remove_symlinks() {
    log "Eliminando enlaces simbólicos..."
    rm -f /usr/local/bin/wsm
}

cleanup_logs() {
    log "Limpiando archivos de registro..."
    rm -f /var/log/web-services-manager*
}

main() {
    log "Iniciando desinstalación de Web Services Manager"
    
    remove_installation
    remove_symlinks
    cleanup_logs

    log "Desinstalación completada"
}

main
