const { exec, spawn } = require('child_process');
const os = require('os');

class CommandExecutor {
    constructor() {
        this.platform = os.platform();
    }

    executeCommand(command, options = {}) {
        return new Promise((resolve, reject) => {
            exec(command, options, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ stdout, stderr });
            });
        });
    }

    spawnProcess(command, args = [], options = {}) {
        const process = spawn(command, args, options);

        return new Promise((resolve, reject) => {
            let outputData = '';
            let errorData = '';

            process.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            process.stderr.on('data', (data) => {
                errorData += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ 
                        code, 
                        output: outputData, 
                        error: errorData 
                    });
                } else {
                    reject({ 
                        code, 
                        output: outputData, 
                        error: errorData 
                    });
                }
            });
        });
    }

    sudo(command) {
        const sudoCommands = {
            win32: `powershell Start-Process "${command}" -Verb RunAs`,
            darwin: `sudo ${command}`,
            linux: `sudo ${command}`
        };

        return this.executeCommand(sudoCommands[this.platform]);
    }

    runWithPrivileges(command) {
        return this.sudo(command);
    }
}

module.exports = new CommandExecutor();
