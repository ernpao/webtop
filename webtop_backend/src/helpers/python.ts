const PythonConfig = require('../python/config')
const { spawn } = require('child_process');

async function getScriptPath(filename: string) {

    const file = (new PythonConfig()).path + filename;
    const fs = require('fs')

    if (fs.existsSync(file)) {
        console.log(`${file} script exists.`);
        return file;
    } else {
        console.log(`${file} script does not exist.`);
        return null;
    }

}

class Python {

    async runScript(filename: string, onSuccess?: (data: any) => any, onError?: (error: any) => any) {
        const scriptPath = await getScriptPath(filename);

        if (scriptPath == null) return;

        const pythonProcess = spawn('python', [scriptPath]);

        pythonProcess.stdout.on('data', function (data: any) {
            if (onSuccess) onSuccess(data);
        });

        pythonProcess.stderr.on('data', (data: any) => {
            if (onError) onError(data);
        });
    }

}

export = Python