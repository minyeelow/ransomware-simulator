# 🛡️ SMU Cybersecurity Ransomware Simulator

An interactive, educational simulator demonstrating five ransomware lifecycle stages mapped to the **MITRE ATT&CK®** framework. All payment, encryption, and recovery interactions are training simulations; the application does not process cryptocurrency or automatically modify local files.

---

## 🚀 Live Demo & Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Modern web browser (Chrome, Safari, Edge, Firefox)

### Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

To generate a standalone production build:
```bash
npm run build
npm run preview
```

---

## 🎯 The 5 Steps of Ransomware

The left sidebar provides navigation and progress tracking across all five phases:

```
[01] Initial Access            ──► Adobe-style software trial lure
[02] Privilege Escalation      ──► Windows UAC elevation simulation
[03] File Protection            ──► Single-file AES-256 OpenSSL practice workflow
[04] Negotiation Portal         ──► Fictional wallet and simulated payment
[05] Decryption & Recovery      ──► Recovery and incident-remediation simulation
```

---

### Step 1: Initial Access (`MITRE T1566.001 / T1204.002`)
- Presents a light Adobe Creative Cloud-style software catalogue.
- Selecting a trial application advances to the Windows privilege-escalation simulation.
- The catalogue and installer are simulated UI elements; no software is downloaded or executed.

---

### Step 2: Privilege Escalation (`MITRE T1068 / T1548`)
- Displays a Windows User Account Control-style elevation prompt.
- Provides simulated approval and UAC-bypass paths.
- Allows the learner to continue to the file-protection stage.

---

### Step 3: File Protection (`AES-256-CBC / PBKDF2`)
- Offers a download of the practice file `IS613CourseOutline.pdf`.
- Generates copyable OpenSSL commands for a local terminal:
  1. Check that OpenSSL is installed.
  2. Encrypt the practice PDF to a temporary file.
  3. Verify that the encrypted output is non-empty.
  4. Remove the original practice file and retain the encrypted copy.
- The browser does not read, upload, encrypt, or delete local files. The generated commands are only instructions for the learner to run.

---

### Step 4: Negotiation Portal (`MITRE T1486.001`)
- Shows a compact, training-only recovery negotiation portal.
- Displays a fictional wallet and simulated ransom amount.
- The **Mark Simulated Payment Complete** button changes application state only; it does not send funds or contact a blockchain.
- After the simulated payment, **Decrypt Practice File** reveals a copyable OpenSSL recovery command.
- The portal includes a clear warning not to send cryptocurrency.

---

### Step 5: Decryption & Remediation (`MITRE T1490`)
- Simulates recovery of the protected practice file.
- Presents incident-remediation guidance and blue-team controls.
- The decryption command is intended for the practice artifact only.

---

## ⚡ Additional Capabilities
- **Stage-by-stage navigation** with reset and progress tracking.
- **Copyable terminal instructions** with independent copy buttons.
- **Static training artifacts** including `IS613CourseOutline.pdf` and `ransomnote.txt`.
- **Tactical cyber audio engine** powered by the HTML5 Web Audio API, with a mute toggle.
- **Distinct visual stages**: a light Adobe-style entry page and darker cybersecurity simulation views.