import fs from 'fs';
import path from 'path';

const possibleFileNames = [
    'module-encryption-secret',
    'module-encryption.secret',
    'module.encryption.secret',
]

function readSecret(filePath: string): string {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        for (let name of possibleFileNames) {
            if (fs.existsSync(path.join(filePath, name))) {
                return fs.readFileSync(filePath).toString();
            }
        }
        if (filePath === '/etc') throw new Error("No secret found");
        if (fs.existsSync(path.join(filePath, 'secrets'))) {
            return readSecret(path.join(filePath, 'secrets'));
        }
        throw new Error("No secret found");
    }
    return fs.readFileSync(filePath).toString();
}

const config = {
    secret(): string {
        const env: any = process.env;
        if (env.MODULE_ENCRYPTION_SECRET) {
            return env.MODULE_ENCRYPTION_SECRET as string;
        }
        const appPath = env.APP_PATH || env.PROJECT_PATH || env.SECRET_PATH
            || env.BSB_PATH || env.BW_PATH || env.ENV_PATH || env.ETC_PATH;
        
        if (!appPath) {
            try { 
                return readSecret('/etc'); 
            } catch (err) {}

            if (!appPath) throw new Error("Can't get secret: no env.MODULE_ENCRYPTION_SECRET "
                + "| nor /etc/module-encryption-secret file | nor env.APP_PATH nor etc");
        }

        if (!fs.existsSync(appPath)) throw new Error("File not found: " + appPath);
        return readSecret(appPath);
    }
}

export default config;