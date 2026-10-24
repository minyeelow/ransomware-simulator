const PYTHON_SCRIPT_TEMPLATE = (targetPath) => `"""Educational target-folder inspection script.

This generated file records the folder selected in the simulator. It does not
modify, encrypt, or delete files.
"""

from pathlib import Path

FOLDER_TO_INSPECT = Path(${JSON.stringify(targetPath)})


def inspect_folder(folder: Path) -> None:
    if not folder.exists():
        print(f"Target folder does not exist: {folder}")
        return

    if not folder.is_dir():
        print(f"Target path is not a directory: {folder}")
        return

    files = [path for path in folder.rglob("*") if path.is_file()]
    print(f"Selected folder: {folder}")
    print(f"Files found: {len(files)}")
    for path in files:
        print(path)


if __name__ == "__main__":
    inspect_folder(FOLDER_TO_INSPECT)
`;

export function downloadEncryptionScript(targetPath) {
  const cleanedPath = String(targetPath || '').trim();
  if (!cleanedPath) {
    return false;
  }

  const script = PYTHON_SCRIPT_TEMPLATE(cleanedPath);
  const blob = new Blob([script], { type: 'text/x-python' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = 'encryption_target_inspection.py';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);

  return true;
}
