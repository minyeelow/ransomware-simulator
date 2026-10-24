import os
import base64
from hashlib import sha256
from cryptography.fernet import Fernet

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
# 1. Open your terminal/command prompt and run: pip install cryptography
# 2. Update the folder path and password variables below
# 3. Run this script

if __name__ == "__main__":
    FOLDER_TO_ENCRYPT = r"C:\path\to\your\folder" 
    SECRET_PASSWORD = "YourSecurePasswordHere"
    
    # Warning check before running
    confirm = input(f"Are you sure you want to bulk-encrypt all files in '{FOLDER_TO_ENCRYPT}'? (yes/no): ")
    if confirm.lower() == 'yes':
        bulk_encrypt_folder(FOLDER_TO_ENCRYPT, SECRET_PASSWORD)
        print("\nBulk encryption process complete.")
    else:
        print("Operation cancelled.")
