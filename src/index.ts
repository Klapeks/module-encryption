import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});
import { encrypt } from "./encrypt";
import { decrypt } from "./decrypt";
import config from "./config";

export { encrypt, decrypt, config };