// import { Storage } from '@google-cloud/storage';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const _dirname = path.dirname(_filename);

// const projectId = 'xenon-axe-450704-n3';
// const keyFilename = path.join(__dirname, './xenon-axe-450704-n3-b08c27baaa39.json'); 
// const bucketName = 'simpan_buku_tukar'; 
// const storage = new Storage({
//   projectId,
//   keyFilename,
// });

// const bucket = storage.bucket(bucketName);

// export { storage, bucket };


import { Storage } from '@google-cloud/storage';

const bucketName = 'simpan_buku_tukar'; 
const storage = new Storage({
  projectId: 'xenon-axe-450704-n3', 
});

const bucket = storage.bucket(bucketName);

export { storage, bucket };