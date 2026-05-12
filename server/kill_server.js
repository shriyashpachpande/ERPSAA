const { execSync } = require('child_process');

try {
    const output = execSync('netstat -ano | findstr :5000').toString();
    const lines = output.split('\n');
    for (const line of lines) {
        if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
                console.log(`Killing process on port 5000: PID ${pid}`);
                try {
                    execSync(`taskkill /F /PID ${pid}`);
                } catch (e) {
                    console.log(`Failed to kill ${pid}: ${e.message}`);
                }
            }
        }
    }
} catch (err) {
    console.log('No process found on port 5000 or error:', err.message);
}
