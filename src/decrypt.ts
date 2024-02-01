import fs from 'fs';
import mPath from 'path';
import readline from 'readline';
import config from './config';
import { decryptedBuffer } from './crypto';

function isDirectory(path: string) {
    return fs.statSync(path).isDirectory();
}
function decryptLine(line: string, secret: any): Buffer {
    return Buffer.from(line, 'base64')
}

export function decrypt(source: string, dist: string) {
    const SECRET = config.secret();

    if (source[0] !== '/') source = mPath.join(process.cwd(), source);
    if (dist[0] !== '/') dist = mPath.join(process.cwd(), dist);
    if (isDirectory(source)) source = mPath.join(source, 'encrypted.module');

    console.log("Soruce folder", source);
    console.log("Dist file", dist);


    if (fs.existsSync(dist)) fs.rmSync(dist, {
        force: true, recursive: true
    });
    fs.mkdirSync(dist);

    const stream = fs.createReadStream(source);
    const rl = readline.createInterface({
        input: stream, crlfDelay: Infinity
    });
    let file = '';
    rl.on('line', (line) => {
        try {
            if (!line) return;
            line = decryptedBuffer(Buffer.from(line, 'base64'), SECRET).toString();
            if (!file) {
                let len = line.indexOf(' ');
                if (!len || len < 0) throw "Invalid order: can't get length of file";
                file = line.substring(len+1);
                len = +line.substring(0, len);
                if (!len) throw "Invalid order: can't get length of file";
                if (!file) throw "Invalid order: can't get file path";
                return;
            }
            console.log('decrypting file', file);
            file = mPath.join(dist, file);
            fs.mkdirSync(mPath.dirname(file), { recursive: true });
            fs.writeFileSync(file, line);
            file = '';
            // fs.writeFileSync()
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    });
    rl.on('close', () => {
        console.log('\nDecrypted\n');
    });
}
