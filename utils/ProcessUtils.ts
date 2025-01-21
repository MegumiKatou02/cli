import si from 'systeminformation';
import readline from 'readline';

export async function isProcessRunning(pid: number): Promise<boolean> {
    try {
        const processes = await si.processes();
        return processes.list.some(proc => proc.pid === pid);
    } catch (error) {
        console.error("Error checking process:", error);
        return false;
    }
}

export async function findProcessByName(name: string, exactMatch: boolean = false, limit: number = 0): Promise<{ pid: number; name: string; cpu: number; memory: number; status: string }[]> {
    try {
        const processes = await si.processes();
        let foundProcesses = processes.list
            .filter(proc => {
                const procName = proc.name.toLowerCase();
                const searchName = name.toLowerCase();
                return exactMatch ? procName === searchName : procName.includes(searchName);
            })
            .map(proc => ({
                pid: proc.pid,
                name: proc.name,
                cpu: proc.cpu,
                memory: proc.mem,
                status: proc.state,
            }));

        if (limit > 0) {
            foundProcesses = foundProcesses.slice(0, limit);
        }
        return foundProcesses;
    } catch (error) {
        console.error("Error fetching processes:", error);
        return [];
    }
}

export async function monitorProcess(pid: number, interval: number = 1000) {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('data', (key) => {
        if (key) {
            console.log("\nMonitoring stopped by user.");
            process.exit(0);
        }
    });

    try {
        while (true) {
            const processes = await si.processes();
            const proc = processes.list.find(p => p.pid === pid);
            if (proc) {
                console.log(`CPU: ${proc.cpu.toFixed(2)}%, Memory: ${proc.mem.toFixed(2)}%`);
            } else {
                console.log(`Process ${pid} not found.`);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    } catch (error) {
        console.error("Error monitoring process:", error);
    } finally {
        process.stdin.setRawMode(false); 
    }
}