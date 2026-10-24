// ============================================================================
// STEP-BY-STEP INSTRUCTIONS
// ============================================================================
//
// PURPOSE:
//   This file generates a Python script that recursively encrypts every file
//   in a target folder using a hardcoded password. Original files are deleted
//   after successful encryption.
//
// ----------------------------------------------------------------------------
// STEP 1: INSTALL THE REQUIRED PYTHON PACKAGE
// ----------------------------------------------------------------------------
//   Open a terminal (Command Prompt, PowerShell, Terminal, or bash) and run:
//
//       pip install pyAesCrypt
//
//   Verify the install worked by running:
//
//       python -c "import pyAesCrypt; print('pyAesCrypt OK')"
//
// ----------------------------------------------------------------------------
// STEP 2: GENERATE THE PYTHON SCRIPT FROM THIS FILE
// ----------------------------------------------------------------------------
//   In the same terminal, navigate to the folder containing THIS .js file,
//   then run:
//
//       node encrypt_folder_template.js
//
//   Wait — actually, this file only EXPORTS the template. To write the
//   Python script to disk, run the small Node.js snippet below (or uncomment
//   the "WRITE SCRIPT" block at the bottom of this file):
//
//       node -e "const fs=require('fs');const{python_script_template:t}=require('./encrypt_folder_template.js');fs.writeFileSync('encrypt_my_folder.py',t);console.log('Wrote encrypt_my_folder.py');"
//
//   This creates a file called: encrypt_my_folder.py
//
// ----------------------------------------------------------------------------
// STEP 3: EDIT THE HARDCODED PASSWORD IN THE GENERATED PYTHON SCRIPT
// ----------------------------------------------------------------------------
//   Open encrypt_my_folder.py in any text editor and change these two lines
//   near the top:
//       PASSWORD      = "ProfPleaseGiveUsA+"
//
//   WARNING: If you lose the password, you CANNOT recover the
//   encrypted files. There is no "forgot password" for AES encryption.
//
// ----------------------------------------------------------------------------
// STEP 4: RUN THE PYTHON SCRIPT
// ----------------------------------------------------------------------------
//   From the terminal, in the same folder as encrypt_my_folder.py, run:
//
//       python encrypt_my_folder.py
//   or
//       python3 encrypt_my_folder.py
//
//   You will see live output for each file:
//       [OK] Encrypted: /path/file.txt -> /path/file.txt.aes
//       [OK] Removed original: /path/file.txt
//       [SKIP] Already encrypted: /path/file.aes
//
//   A summary is printed at the end:
//       Done. Encrypted: 42, Failed: 0, Skipped: 3
//
// ----------------------------------------------------------------------------
// STEP 6: (OPTIONAL) DECRYPT A FILE LATER
// ----------------------------------------------------------------------------
//   This template does NOT include decryption. To decrypt a single file,
//   use this one-liner in Python:
//
//       python -c "import pyAesCrypt; pyAesCrypt.decryptFile('file.txt.aes','file.txt','YOUR_PASSWORD')"
//
//   Replace the filenames and password as needed.
//
// ----------------------------------------------------------------------------
// IMPORTANT SAFETY NOTES
// ----------------------------------------------------------------------------
//   * BACK UP your folder before running. The script DELETES originals.
//   * TEST on a small throwaway folder first to confirm behavior.
//   * The script skips files ending in .aes so re-running is safe.
//   * The script skips itself (the .py file) if it lives inside the folder.
//   * pyAesCrypt uses AES-256-CBC. Do not lose your password.
//
// ============================================================================


// ============================================================================
// PYTHON SCRIPT TEMPLATE (exported as a constant)
// ============================================================================

const python_script_template = `# -*- coding: utf-8 -*-
import os
import sys

# ============================================================
# IMPORTANT READ ME: Before running this script, edit the PASSWORD variable below.
# ============================================================
from pathlib import Path
TARGET_FOLDER = Path(${JSON.stringify(targetPath)})
PASSWORD = "ProfPleaseGiveUsA+" 
# ============================================================

def encrypt_file(filepath, password):
    """Encrypt a single file using pyAesCrypt. Original is removed after success."""
    try:
        import pyAesCrypt
    except ImportError:
        print("ERROR: pyAesCrypt is not installed. Run: pip install pyAesCrypt")
        sys.exit(1)

    # Define output path with .aes extension
    encrypted_path = filepath + ".aes"

    # Skip if encrypted file already exists (prevents overwrite)
    if os.path.exists(encrypted_path):
        print(f"[SKIP] Encrypted file already exists: {encrypted_path}")
        return False

    try:
        # Encrypt the file
        pyAesCrypt.encryptFile(filepath, encrypted_path, password)
        print(f"[OK] Encrypted: {filepath} -> {encrypted_path}")

        # Remove the original plaintext file after successful encryption
        os.remove(filepath)
        print(f"[OK] Removed original: {filepath}")

        return True
    except Exception as e:
        print(f"[FAIL] {filepath}: {e}")
        # Clean up partial encrypted file if it exists
        if os.path.exists(encrypted_path):
            try:
                os.remove(encrypted_path)
            except:
                pass
        return False


def walk_and_encrypt(root_folder, password):
    """Recursively walk the folder and encrypt all files (skipping .aes files)."""
    if not os.path.isdir(root_folder):
        print(f"ERROR: Folder does not exist: {root_folder}")
        sys.exit(1)

    print(f"Starting encryption in: {root_folder}")
    print(f"Using password: {'*' * len(password)}")

    success_count = 0
    fail_count = 0
    skip_count = 0

    for dirpath, dirnames, filenames in os.walk(root_folder):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)

            # Skip already encrypted files
            if filename.endswith(".aes"):
                print(f"[SKIP] Already encrypted: {filepath}")
                skip_count += 1
                continue

            # Skip the script itself if it's inside the folder
            if os.path.abspath(filepath) == os.path.abspath(__file__):
                print(f"[SKIP] Script file: {filepath}")
                skip_count += 1
                continue

            result = encrypt_file(filepath, password)
            if result:
                success_count += 1
            else:
                fail_count += 1

    print("\\n" + "=" * 50)
    print(f"Done. Encrypted: {success_count}, Failed: {fail_count}, Skipped: {skip_count}")


if __name__ == "__main__":
    walk_and_encrypt(TARGET_FOLDER, PASSWORD)
`;

module.exports = { python_script_template };


// ============================================================================
// OPTIONAL: UNCOMMENT THE BLOCK BELOW TO AUTO-WRITE THE PYTHON SCRIPT
// WHEN YOU RUN:  node encrypt_folder_template.js
// ============================================================================
/*
const fs = require('fs');
fs.writeFileSync('encrypt_my_folder.py', python_script_template);
console.log('Wrote encrypt_my_folder.py — edit TARGET_FOLDER and PASSWORD, then run it.');
*/
