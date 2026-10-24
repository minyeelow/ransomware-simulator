const OUTPUT_DIRECTORY = 'encrypted-output';

async function ensureWritePermission(directoryHandle) {
  const options = { mode: 'readwrite' };
  if ((await directoryHandle.queryPermission(options)) !== 'granted'
    && (await directoryHandle.requestPermission(options)) !== 'granted') {
    throw new Error('Write permission was not granted for the selected folder.');
  }
}

async function encryptFile(fileHandle, outputDirectory, key) {
  const file = await fileHandle.getFile();
  const plaintext = await file.arrayBuffer();
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    plaintext
  );
  const outputHandle = await outputDirectory.getFileHandle(`${file.name}.enc`, { create: true });
  const writable = await outputHandle.createWritable();
  await writable.write(new Blob([nonce, ciphertext], { type: 'application/octet-stream' }));
  await writable.close();
  return plaintext.byteLength;
}

async function encryptDirectory(directoryHandle, outputDirectory, key) {
  let fileCount = 0;
  let totalBytes = 0;

  for await (const entry of directoryHandle.values()) {
    if (entry.name === OUTPUT_DIRECTORY) continue;
    if (entry.kind === 'file') {
      totalBytes += await encryptFile(entry, outputDirectory, key);
      fileCount += 1;
    } else if (entry.kind === 'directory') {
      const childOutput = await outputDirectory.getDirectoryHandle(entry.name, { create: true });
      const result = await encryptDirectory(entry, childOutput, key);
      fileCount += result.fileCount;
      totalBytes += result.totalBytes;
    }
  }

  return { fileCount, totalBytes };
}

export async function encryptFolderCopies(directoryHandle) {
  if (!directoryHandle || typeof directoryHandle.getFileHandle !== 'function') {
    throw new Error('A folder selected with the browser folder picker is required.');
  }

  await ensureWritePermission(directoryHandle);
  const outputDirectory = await directoryHandle.getDirectoryHandle(OUTPUT_DIRECTORY, { create: true });
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  return encryptDirectory(directoryHandle, outputDirectory, key);
}
