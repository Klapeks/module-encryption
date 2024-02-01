import fs from 'fs';
import mPath from 'path';
import config from './config';

function isDirectory(path: string) {
    return fs.statSync(path).isDirectory();
}
function encrytBuffer(buffer: Buffer, secret: any): string {
    return buffer.toString('base64');
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

        const fileData = encrytBuffer(fs.readFileSync(path), SECRET);
        fs.appendFileSync(dist, fileData.length + " " + relPath + '\r\n' + fileData + '\r\n');
    }

    fs.writeFileSync(dist, '');
    _encrypt(source, dist);
    console.log('\nEnctrypred\n');
}
