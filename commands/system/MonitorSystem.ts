import * as os from 'os';
import clear from 'clear';
import * as readline from 'readline';

function createCPUMonitor(): () => (callback: (cpuUsage: number) => void) => void {
  let prevTotal = 0;
  let prevIdle = 0;

  return function () {
    return function getCPUPercentage(callback: (cpuUsage: number) => void): void {
      const cpus = os.cpus();
      let total = 0;
      let idle = 0;
      cpus.forEach((cpu) => {
        Object.values(cpu.times).forEach((time) => {
          total += time;
        });
        idle += cpu.times.idle;
      });
      if (prevTotal === 0 || prevIdle === 0) {
        prevTotal = total;
        prevIdle = idle;
        callback(0);
      } else {
        const totalDelta = total - prevTotal;
        const idleDelta = idle - prevIdle;
        const cpuUsage = 1 - (idleDelta / totalDelta);
        callback(cpuUsage * 100);
        prevTotal = total;
        prevIdle = idle;
      }
    };
  };
}

const getCPUPercentage = createCPUMonitor()();

function monitorSystem() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const intervalId = setInterval(() => {
    clear();
    console.log('System Monitor');
    console.log('----------------');

    getCPUPercentage((cpuUsage) => {
      console.log(`CPU Usage: ${(cpuUsage).toFixed(2)}%`);
    });

    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsage = (usedMem / totalMem) * 100;
    console.log(`Memory Usage: ${(memUsage).toFixed(2)}%`);
    console.log(`Used: ${(usedMem / 1024 / 1024).toFixed(2)} MB / ${(totalMem / 1024 / 1024).toFixed(2)} MB`);

    console.log('\nPress "q" to quit.');
  }, 1000);

  rl.on('line', (input) => {
    if (input.trim() === 'q') {
      clearInterval(intervalId);
      rl.close();
      console.log('Exiting system monitor...');
    }
  });
}

export const monitorSystemCommand = {
  command: 'monitor-system',
  description: 'Monitor CPU and RAM usage in real-time',
  action: monitorSystem
};