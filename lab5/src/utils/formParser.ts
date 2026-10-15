import * as http from 'http';

export type FormFile = {
    fieldName: string;
    filename: string;
    mimeType: string;
    data: Buffer;
};

export type ParsedForm = {
    fields: Record<string, string>;
    files: Record<string, FormFile>;
};

export async function readRawBody(req: http.IncomingMessage): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

export function parseUrlEncoded(body: string): Record<string, string> {
    const params = new URLSearchParams(body);
    const fields: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
        fields[key] = value.trim();
    }
    return fields;
}

export function parseMultipart(body: Buffer, contentType: string): ParsedForm {
    const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!match) {
        throw new Error('Немає boundary у Content-Type');
    }

    const boundary = match[1] || match[2];
    const delim = Buffer.from(`--${boundary}`);
    const parts = splitBuffer(body, delim);
    const result: ParsedForm = { fields: {}, files: {} };

    for (const part of parts) {
        if (part.length === 0 || part.equals(Buffer.from('--')) || part.equals(Buffer.from('--\r\n'))) {
            continue;
        }

        let data = part;
        if (data[0] === 13 && data[1] === 10) {
            data = data.subarray(2);
        }
        if (data.length >= 2 && data[data.length - 2] === 13 && data[data.length - 1] === 10) {
            data = data.subarray(0, data.length - 2);
        }

        const headerEnd = data.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd === -1) continue;

        const headerText = data.subarray(0, headerEnd).toString('utf-8');
        const content = data.subarray(headerEnd + 4);
        const nameMatch = headerText.match(/name="([^"]+)"/i);
        if (!nameMatch) continue;

        const fieldName = nameMatch[1];
        const filenameMatch = headerText.match(/filename="([^"]*)"/i);

        if (filenameMatch) {
            const mimeMatch = headerText.match(/Content-Type:\s*([^\r\n]+)/i);
            result.files[fieldName] = {
                fieldName,
                filename: filenameMatch[1],
                mimeType: (mimeMatch?.[1] || 'application/octet-stream').trim(),
                data: content
            };
        } else {
            result.fields[fieldName] = content.toString('utf-8').trim();
        }
    }

    return result;
}

function splitBuffer(buf: Buffer, delim: Buffer): Buffer[] {
    const parts: Buffer[] = [];
    let start = 0;
    let idx = buf.indexOf(delim, start);

    while (idx !== -1) {
        parts.push(buf.subarray(start, idx));
        start = idx + delim.length;
        idx = buf.indexOf(delim, start);
    }

    parts.push(buf.subarray(start));
    return parts;
}
