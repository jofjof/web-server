import axios from "axios";
import * as fs from 'fs';

export async function generateImage(prompt: string) {
    try {
        const options = {
            method: 'POST',
            url: process.env.MONSTER_ENDPOINT,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${process.env.MONSTER_API_TOKEN}`
            },
            data: { prompt: prompt }
        };
        let response = await axios.request(options);
        const statusOptions = {
            method: 'GET',
            url: response.data.status_url,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.MONSTER_API_TOKEN}`,
            }
        };

        // Wait for image to be ready and keep querying the api
        for (let i = 0; i < 15; i++) {
            response = await axios.request(statusOptions);
            if (response.data.status === "COMPLETED") {
                const filePath = 'public/' + Date.now() + ".png";
                await saveFile(response.data.result.output[0], filePath);
                return filePath;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (err) {
        throw err;
    }
}

async function saveFile(url: string, filePath: string) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}