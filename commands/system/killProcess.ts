import { exec } from 'child_process';
import { isProcessRunning } from '../../utils/ProcessUtils.js';

export async function killProcess(pid: number) {
    const isRunning = await isProcessRunning(pid);
    if (!isRunning) {
        console.error(`Process ${pid} does not exist.`);
        return;
    }

    const command = process.platform === 'win32' ? `taskkill /PID ${pid} /F` : `kill ${pid}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Process ${pid} killed.`);
    });
}