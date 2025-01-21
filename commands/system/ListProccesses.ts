import si from 'systeminformation';

export async function listProcesses() {
    try {
        const processes = await si.processes();
        console.log(`${"PID".padEnd(8)} ${"Name".padEnd(20)} ${"CPU%".padEnd(10)} ${"Memory%".padEnd(10)} ${"Status".padEnd(10)}`);
        processes.list.forEach(proc => {
            console.log(
                `${proc.pid.toString().padEnd(8)} ` +
                `${proc.name.padEnd(20)} ` +
                `${proc.cpu.toFixed(2).padEnd(10)} ` +
                `${proc.mem.toFixed(2).padEnd(10)} ` +
                `${proc.state.padEnd(10)}`
            );
        });
    } catch (error) {
        console.error("Error fetching processes:", error);
    }
}