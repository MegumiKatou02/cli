import { findProcessByName } from '../../utils/ProcessUtils.js';

export async function handleFindProcess(name: string, exactMatch: boolean = false, limit: number = 0) {
    const foundProcesses = await findProcessByName(name, exactMatch, limit);
    if (foundProcesses.length === 0) {
        console.log("No processes found.");
        return;
    }
    foundProcesses.forEach(proc => {
        console.log(`PID: ${proc.pid}, Name: ${proc.name}, CPU: ${proc.cpu.toFixed(2)}%, Memory: ${proc.memory.toFixed(2)}%, Status: ${proc.status}`);
    });
}