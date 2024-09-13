import * as mega from "megajs";
import { Readable } from 'stream';

const auth = {
    email: process.env.MAIL,
    password: process.env.PASS,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
};

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            let stream;
            if (data instanceof Readable) {
                stream = data;
            } else {
                const jsonString = JSON.stringify(data, null, 2);
                stream = Readable.from(jsonString);
            }

            const storage = new mega.Storage(auth, () => {
                stream.pipe(storage.upload({ name: name, allowUploadBuffering: true }));
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) {
                            storage.close();
                            reject(err);
                        } else {
                            storage.close();
                            resolve(url);
                        }
                    });
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

export default upload;