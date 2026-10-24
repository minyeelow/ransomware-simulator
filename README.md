# 🛡️ Ransomware Attack Lifecycle Simulator (Kill Chain Explorer)

An interactive, educational cybersecurity operations console demonstrating the **5 critical stages of enterprise ransomware** mapped to the **MITRE ATT&CK®** framework.

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

The left sidebar gives full navigation and real-time state tracking across all five phases:

```
[01] Initial Access           ──► Weaponized lure delivery & C2 beacon ingress
[02] Privilege Escalation      ──► UAC bypass & SYSTEM integrity token elevation
[03] Encryption Engine         ──► Volume Shadow Copy purge & Hybrid AES-256 + RSA-4096
[04] Ransom & Extortion        ──► Desktop lock screen defacement & Tor negotiation portal
[05] Decryption & Recovery     ──► Master RSA private key injection & SHA-256 integrity validation
```

---

### Step 1: Initial Access (`MITRE T1566.001 / T1190 / T1133`)
- **Vectors Simulated**:
  - **Spearphishing Email**: Interactive Outlook Web App lure with weaponized `Invoice_Audit_Remittance_Q4.xlsm` macro attachment.
  - **Edge Vulnerability**: Unauthenticated session token leak via memory corruption (Citrix Bleed / Fortinet SSL-VPN).
  - **Compromised RDP**: Initial Access Broker credential spray.
- **Ingress Telemetry**: Real-time C2 beacon established with reverse shell callback to attacker IP `185.220.101.44:443`.

---

### Step 2: Privilege Escalation (`MITRE T1068 / T1548 / T1003`)
- **Integrity Ladder**:
  - Level 1: `MEGACORP\jsmith` (Medium Integrity, standard user token)
  - Level 2: Local Administrator (High Integrity, UAC bypass via registry auto-elevation)
  - Level 3: `NT AUTHORITY\SYSTEM` (Ring 0 System Integrity via `SeImpersonatePrivilege`)
- **Exploit Console**:
  - Live LSASS credential dumping emulation displaying cached NTLM hashes.

---

### Step 3: Encryption Engine (`MITRE T1486 / T1490`)
- **Pre-Encryption Sabotage**: Destroys local backups and Volume Shadow Copies (`vssadmin delete shadows /all /quiet`, `wbadmin delete catalog`).
- **Hybrid Cryptography**: Fast symmetric **AES-256** encrypts file blocks, and asymmetric **RSA-4096** seals each session key into the file footer.
- **Interactive File System**:
  - 6 realistic corporate files (`.xlsx`, `.sql`, `.pdf`, `.zip`, `.dit`, `.vhdx`).
  - Real-time ASCII/Hex dump viewer showing transformation into high-entropy ciphertext.
  - Shannon Entropy meter rising from ~4.1 to 7.99 bits/byte.

---

### Step 4: Ransom & Extortion (`MITRE T1486.001 / T1491 / T1567`)
- **Double Extortion Model**:
  - **Desktop Lock Screen**: Threat notification with active 48-hour countdown clock and victim ID (`VICTIM-#8849-AF91-US`).
  - **Tor Onion Portal**: Emulated `.onion` payment interface with Bitcoin ransom calculator ($250,000 / 3.85 BTC).
  - **Proof of Decryption**: Interactive feature allowing the victim to test decrypt 1 non-critical file for free.
  - **Live Operator Chat**: Interactive negotiation console with automated threat actor responses.
  - **`HOW_TO_RECOVER_FILES.txt`**: Complete formatted ransom note inspection.

---

### Step 5: Decryption & Remediation (`MITRE T1490 Recovery`)
- **Recovery Console**:
  - Attacker Master RSA-4096 Private Key injection.
  - Unwrapping AES session keys and reversing cipher blocks back into original binaries.
  - **Cryptographic Hash Verification**: Before vs. After SHA-256 hash comparison proving 100% data fidelity with zero byte corruption.
- **Enterprise Defense Matrix**: Complete 5-phase blue-team defense playbook outlining controls to neutralize each attack stage.

---

## ⚡ Additional Capabilities
- **Auto-Run Kill Chain**: One-click sequential execution of all 5 stages with cinematic pacing.
- **Collapsible Live Telemetry Feed**: Real-time Sysmon, EDR, Network, and Crypto event stream with category filters.
- **Tactical Cyber Audio Engine**: Synthesized audio feedback for clicks, elevation, encryption ticks, alerts, and decryption chimes powered by the HTML5 Web Audio API (toggleable mute).
- **Responsive Cyberpunk UI**: Sleek dark mode design with glassmorphism, glowing telemetry indicators, and typography powered by JetBrains Mono and Plus Jakarta Sans.