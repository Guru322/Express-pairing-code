import sendsession from 'txt-fyi-api'


export async function upload(data, fileName) {
  try {
    let textData;
    
    if (Buffer.isBuffer(data)) {
      textData = data.toString('utf8');
    } else if (data && typeof data.read === 'function') {
      const chunks = [];
      for await (const chunk of data) {
        chunks.push(chunk);
      }
      textData = Buffer.concat(chunks).toString('utf8');
    } else if (typeof data === 'string') {
      textData = data;
    } else {
      throw new Error('Unsupported data type');
    }
    
    const result = await sendsession(textData);
    
    if (result.success) {
      const sessionUrl = `https://txt.fyi/${result.output}`;
      return sessionUrl;
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading to txt.fyi:', error);
    return 'Error Uploading to txt.fyi';
  }
}
