import fs from 'fs';
import mPath from 'path';
import config from './config';
import { encryptBuffer } from './crypto';

function isDirectory(path: string) {
    return fs.statSync(path).isDirectory();
}

export function encrypt(source: string, dist: string) {
    const SECRET = config.secret();

    if (source[0] !== '/') source = mPath.join(process.cwd(), source);
    if (dist[0] !== '/') dist = mPath.join(process.cwd(), dist);
    if (isDirectory(dist)) dist = mPath.join(dist, 'encrypted.module');

    console.log("Soruce folder", source);
    console.log("Dist file", dist);

    function _encrypt(path: string, dist: string) {
        if (isDirectory(path)) {
            const list = fs.readdirSync(path);
            for (let file of list) {
                _encrypt(mPath.join(path, file), dist);
            }
            return;
        }
        const relPath = mPath.relative(source, path);
        console.log("Encrypting path: ", relPath, ' <- ', path);

        const fileData = encryptBuffer(fs.readFileSync(path), SECRET).toString('base64');
        const fileInfo = encryptBuffer(fileData.length + " " + relPath, SECRET).toString('base64');
        fs.appendFileSync(dist, fileInfo + '\r\n' + fileData + '\r\n');
    }

    fs.writeFileSync(dist, '');
    _encrypt(source, dist);
    console.log('\nEnctrypred\n');
}
