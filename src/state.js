/**
 * Central State Machine for Ransomware Lifecycle Simulator
 */
import { encryptFolderCopies } from './safeEncryption.js';

export const STAGES = [
  {
    id: 'initial-access',
    num: 1,
    title: 'Initial Access',
    shortName: 'Access',
    subtitle: 'Vector Delivery & C2 Beacon',
    mitreId: 'T1566.001',
    mitreName: 'Phishing: Spearphishing Attachment',
    color: '#3B82F6', // Blue
    description: 'Threat actors gain initial footprint via weaponized lure attachments, public exploits, or compromised credentials.'
  },
  {
    id: 'privilege-escalation',
    num: 2,
    title: 'Privilege Escalation',
    shortName: 'PrivEsc',
    subtitle: 'UAC Bypass & SYSTEM Elevation',
    mitreId: 'T1068 / T1548',
    mitreName: 'Exploitation for Privilege Escalation',
    color: '#F59E0B', // Amber
    description: 'Elevating privileges from an unprivileged domain user to local Administrator and NT AUTHORITY\\SYSTEM.'
  },
  {
    id: 'encryption',
    num: 3,
    title: 'Encryption Engine',
    shortName: 'Encryption',
    subtitle: 'VSS Purge & Hybrid Cryptography',
    mitreId: 'T1486',
    mitreName: 'Data Encrypted for Impact',
    color: '#EF4444', // Red
    description: 'Deleting Volume Shadow Copies, enumerating target file extensions, and locking files with AES-256 + RSA-4096.'
  },
  {
    id: 'ransom',
    num: 4,
    title: 'Ransom & Extortion',
    shortName: 'Ransom',
    subtitle: 'Desktop Lock & Tor Payment Portal',
    mitreId: 'T1486.001',
    mitreName: 'Double Extortion & Ransom Note',
    color: '#DC2626', // Crimson
    description: 'Displaying extortion notes, locking the desktop, and directing the victim to a Tor onion negotiation portal with timer.'
  },
  {
    id: 'decryption',
    num: 5,
    title: 'Decryption & Recovery',
    shortName: 'Decryption',
    subtitle: 'Key Injection & Forensic Restoration',
    mitreId: 'T1490-REC',
    mitreName: 'Incident Recovery & Remediation',
    color: '#10B981', // Emerald
    description: 'Injecting the private master RSA key, unwrapping AES keys, restoring files, and validating cryptographic hash integrity.'
  }
];

export const INITIAL_FILES = [
  {
    id: 'f1',
    name: 'Q4_Financial_Audit_2026.xlsx',
    path: 'D:\\CorpShares\\Finance\\Q4_Financial_Audit_2026.xlsx',
    size: '4.8 MB',
    type: 'Spreadsheet',
    status: 'clean', // clean | encrypting | encrypted | restoring | restored
    progress: 0,
    entropy: 3.42,
    originalHash: 'SHA256: 4e9a8f...39b1',
    currentHash: 'SHA256: 4e9a8f...39b1',
    plainPreview: '50 4B 03 04 14 00 06 00 | PK...... [Excel XLSX]',
    cipherPreview: 'A4 F9 21 D8 03 E7 BC 44 | AES-256 High Entropy'
  },
  {
    id: 'f2',
    name: 'Customer_ERP_Database.sql',
    path: 'D:\\Databases\\MSSQL\\Customer_ERP_Database.sql',
    size: '128.4 MB',
    type: 'Database Export',
    status: 'clean',
    progress: 0,
    entropy: 4.15,
    originalHash: 'SHA256: 7d12a4...88ef',
    currentHash: 'SHA256: 7d12a4...88ef',
    plainPreview: '43 52 45 41 54 45 20 54 | CREATE TABLE dbo.Users',
    cipherPreview: '81 DE 4B 90 FA 32 17 CC | AES-256 High Entropy'
  },
  {
    id: 'f3',
    name: 'Executive_Merger_Agreement.pdf',
    path: 'D:\\Legal\\Contracts\\Executive_Merger_Agreement.pdf',
    size: '14.2 MB',
    type: 'Legal Document',
    status: 'clean',
    progress: 0,
    entropy: 4.88,
    originalHash: 'SHA256: 9b55f1...1003',
    currentHash: 'SHA256: 9b55f1...1003',
    plainPreview: '25 50 44 46 2D 31 2E 37 | %PDF-1.7 [Adobe PDF]',
    cipherPreview: '5B 19 FF E2 40 8E 71 A3 | AES-256 High Entropy'
  },
  {
    id: 'f4',
    name: 'Proprietary_Core_Engine.zip',
    path: 'D:\\DevOps\\Repositories\\Proprietary_Core_Engine.zip',
    size: '86.0 MB',
    type: 'Source Code Archive',
    status: 'clean',
    progress: 0,
    entropy: 5.12,
    originalHash: 'SHA256: 1a8c3d...762a',
    currentHash: 'SHA256: 1a8c3d...762a',
    plainPreview: '50 4B 03 04 0A 00 00 00 | PK...... [Zip Archive]',
    cipherPreview: '3F 74 AC B1 9E 28 D5 04 | AES-256 High Entropy'
  },
  {
    id: 'f5',
    name: 'ActiveDirectory_NTDS.dit',
    path: 'C:\\Windows\\NTDS\\ntds.dit',
    size: '420.5 MB',
    type: 'Identity Database',
    status: 'clean',
    progress: 0,
    entropy: 4.90,
    originalHash: 'SHA256: 62e49c...4fa8',
    currentHash: 'SHA256: 62e49c...4fa8',
    plainPreview: 'B5 2A 00 00 00 00 00 00 | Microsoft ESE Database',
    cipherPreview: 'EE 62 1B 89 CD 05 91 37 | AES-256 High Entropy'
  },
  {
    id: 'f6',
    name: 'Offsite_Backup_Mirror.vhdx',
    path: 'E:\\Backups\\Veeam\\Offsite_Backup_Mirror.vhdx',
    size: '950.0 MB',
    type: 'Virtual Disk Backup',
    status: 'clean',
    progress: 0,
    entropy: 4.30,
    originalHash: 'SHA256: 3c90e1...a117',
    currentHash: 'SHA256: 3c90e1...a117',
    plainPreview: '76 68 64 78 66 69 6C 65 | vhdxfile [VHDX Spec]',
    cipherPreview: '14 B3 99 7C 82 4E AD E0 | AES-256 High Entropy'
  }
];

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.reset();
  }

  reset() {
    this.state = {
      currentStageId: 'initial-access',
      isAutoPlaying: false,
      autoPlaySpeed: 1, // 1x, 2x
      targetHost: {
        hostname: 'CORP-FIN-SRV01.internal',
        ip: '192.168.4.120',
        os: 'Windows Server 2022 x64',
        domain: 'MEGACORP.LOCAL',
        health: 'SECURE', // SECURE | INFILTRATED | PRIV_ELEVATED | ENCRYPTING | COMPROMISED | RESTORED
        currentUser: 'MEGACORP\\jsmith (Std User)',
        integrityLevel: 'Medium'
      },
      targetFolder: {
        path: '',
        name: 'Not Linked',
        isLinked: false,
        handle: null
      },
      stagesCompleted: {
        'initial-access': false,
        'privilege-escalation': false,
        'encryption': false,
        'ransom': false,
        'decryption': false
      },
      initialAccess: {
        selectedVector: 'phishing', // phishing | vulnerability | rdp
        phishingOpened: false,
        macroTriggered: false,
        c2Connected: false,
        c2Server: '185.220.101.44:443 (HTTPS/Tor Exit Node)',
        beaconId: 'BEACON-x86-9921',
        heartbeatMs: 2500
      },
      privEsc: {
        selectedMethod: 'token_impersonation', // token_impersonation | uac_bypass | print_spoofer
        currentPrivilege: 'SeChangeNotifyPrivilege',
        targetPrivilege: 'SeDebugPrivilege + SeImpersonatePrivilege',
        elevationStep: 0, // 0: unprivileged, 1: UAC bypassed (High Integrity), 2: SYSTEM
        exploited: false,
        stolenHash: 'aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0 (Administrator)'
      },
      encryption: {
        status: 'idle', // idle | in-progress | complete
        shadowCopiesDeleted: false,
        cipherMode: 'AES-256-CBC + RSA-4096 Hybrid',
        files: JSON.parse(JSON.stringify(INITIAL_FILES)),
        activeFileIndex: -1,
        totalEncryptedBytes: 0,
        encryptionEntropy: 4.1,
        publicKeyFingerprint: 'RSA-4096 [SHA256: 9b2d...f08a]'
      },
      ransom: {
        ransomNoteDeployed: false,
        wallpaperHijacked: false,
        victimId: 'VICTIM-#8849-AF91-US',
        onionUrl: 'http://lockbit37x...ransomportal.onion/victim/8849',
        ransomAmountUsd: '$250,000 USD',
        ransomBtc: '3.85 BTC',
        paymentConfirmed: false,
        countdownSeconds: 172800, // 48:00:00
        freeDecryptUsed: false,
        freeDecryptedFileId: null,
        activeTab: 'wallpaper', // wallpaper | tor | note
        chatMessages: [
          { sender: 'operator', time: '14:20:02', text: 'Attention CORP-FIN-SRV01 management. Your corporate data has been encrypted and 42GB of sensitive files exfiltrated.' },
          { sender: 'operator', time: '14:20:30', text: 'You have 48 hours to pay 3.85 BTC before the private RSA key is purged and stolen files are dumped to our leak blog.' }
        ]
      },
      decryption: {
        status: 'idle', // idle | decrypting | verified
        keyInput: '0x4F9B2A8C...[VALID_RSA_PRIVATE_KEY_PAYLOAD]',
        keyValid: false,
        progress: 0,
        filesRestoredCount: 0,
        integrityStatus: 'pending' // pending | verifying | 100% Verified
      },
      telemetryLogs: [
        { id: 1, time: '14:45:00', source: 'Sysmon', level: 'INFO', msg: 'System booted. EDR agent active. Threat baseline nominal.' },
        { id: 2, time: '14:45:12', source: 'Network', level: 'INFO', msg: 'Interface eth0 listening on 192.168.4.120/24.' }
      ]
    };
  }

  get() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setCurrentStage(stageId) {
    if (this.state.currentStageId === stageId) return;
    this.state.currentStageId = stageId;
    this.addTelemetry('Navigation', 'INFO', `Switched view to step: ${stageId.toUpperCase()}`);
    this.notify();
  }

  linkTargetFolder(rawPath, { transitionToInitialAccess = true, handle = null } = {}) {
    const cleaned = (rawPath || '').trim();
    if (!cleaned) return false;

    // Normalize slashes and extract folder name
    const normalized = cleaned.replace(/\\/g, '/');
    const segments = normalized.split('/').filter(Boolean);
    const folderName = segments.length > 0 ? segments[segments.length - 1] : 'TargetFolder';

    this.state.targetFolder = {
      path: cleaned,
      name: folderName,
      isLinked: true,
      handle
    };

    // Update target paths of simulated files to reside inside the pointed folder
    const sep = cleaned.includes('/') ? '/' : '\\';
    this.state.encryption.files.forEach(f => {
      f.path = `${cleaned}${sep}${f.name}`;
    });

    this.addTelemetry('FileSystem', 'SUCCESS', `Target directory pointer linked: ${cleaned}`);
    
    // Initial setup starts the workflow; later relinking keeps the current stage.
    if (transitionToInitialAccess) {
      this.state.currentStageId = 'initial-access';
    }
    this.notify();
    return true;
  }

  unlinkTargetFolder() {
    this.state.targetFolder = {
      path: '',
      name: 'Not Linked',
      isLinked: false,
      handle: null
    };
    this.state.currentStageId = 'initial-access';
    this.addTelemetry('FileSystem', 'WARN', 'Target directory pointer cleared.');
    this.notify();
  }

  addTelemetry(source, level, msg) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    this.state.telemetryLogs.unshift({
      id: Date.now() + Math.random(),
      time: timeStr,
      source,
      level, // INFO, WARN, ALERT, CRITICAL, SUCCESS
      msg
    });
    if (this.state.telemetryLogs.length > 100) {
      this.state.telemetryLogs.pop();
    }
    this.notify();
  }

  // Initial Access Actions
  triggerInitialAccess(softwareName = 'Adobe Photoshop 2026') {
    this.state.initialAccess.downloadedSoftware = softwareName;
    this.state.initialAccess.macroTriggered = true;
    this.state.initialAccess.c2Connected = true;
    this.state.targetHost.health = 'INFILTRATED';
    this.state.stagesCompleted['initial-access'] = true;
    const sanitizedName = softwareName.replace(/[^a-zA-Z0-9]/g, '_');
    this.addTelemetry('Browser', 'WARN', `Downloaded trial lure: ${sanitizedName}_Setup.exe (Trojanized Ingress)`);
    this.addTelemetry('Sysmon', 'WARN', `Event ID 1: Process Creation: ${sanitizedName}_Setup.exe spawned powershell.exe -w hidden -enc JABjA...`);
    this.addTelemetry('Network', 'ALERT', `Outbound reverse TLS beacon established to C2: ${this.state.initialAccess.c2Server}`);
    this.notify();
  }

  // Privilege Escalation Actions
  triggerPrivEsc() {
    this.state.privEsc.elevationStep = 2;
    this.state.privEsc.exploited = true;
    this.state.targetHost.health = 'PRIV_ELEVATED';
    this.state.targetHost.currentUser = 'NT AUTHORITY\\SYSTEM';
    this.state.targetHost.integrityLevel = 'System (Ring 0 Access)';
    this.state.stagesCompleted['privilege-escalation'] = true;
    this.addTelemetry('Security', 'CRITICAL', 'Event ID 4672: Special privileges assigned to new logon (SeDebugPrivilege, SeTcbPrivilege)');
    this.addTelemetry('EDR', 'CRITICAL', 'LSASS memory read detected. Mimikatz token extraction confirmed. Local Administrator credentials cached.');
    this.notify();
  }

  // Step 3: Delete Volume Shadows
  deleteShadowCopies() {
    this.state.encryption.shadowCopiesDeleted = true;
    this.addTelemetry('Sysmon', 'CRITICAL', 'cmd.exe /c "vssadmin.exe Delete Shadows /All /Quiet" executed.');
    this.addTelemetry('Sysmon', 'CRITICAL', 'wbadmin DELETE SYSTEMSTATEBACKUP -keepVersions:0 executed.');
    this.notify();
  }

  // Step 3: Run Live File Encryption
  async startFileEncryption(onStepCallback) {
    if (this.state.encryption.status === 'in-progress') return;
    this.state.encryption.status = 'in-progress';
    this.state.targetHost.health = 'ENCRYPTING';
    this.deleteShadowCopies();
    this.notify();

    if (this.state.targetFolder.handle) {
      try {
        const result = await encryptFolderCopies(this.state.targetFolder.handle);
        this.state.encryption.totalEncryptedBytes = result.totalBytes;
        this.addTelemetry(
          'FileSystem',
          'SUCCESS',
          `Safe encrypted copies written to ${this.state.targetFolder.name}/encrypted-output (${result.fileCount} files). Originals preserved.`
        );
      } catch (error) {
        this.state.encryption.status = 'idle';
        this.state.targetHost.health = 'PRIV_ELEVATED';
        this.addTelemetry('FileSystem', 'ERROR', `Safe copy encryption failed: ${error.message}`);
        throw error;
      }
    }

    const files = this.state.encryption.files;
    for (let i = 0; i < files.length; i++) {
      this.state.encryption.activeFileIndex = i;
      files[i].status = 'encrypting';
      this.notify();
      if (onStepCallback) onStepCallback(i, 'encrypting');

      await new Promise(r => setTimeout(r, 450));

      files[i].status = 'encrypted';
      files[i].currentHash = files[i].cipherPreview.slice(0, 23);
      files[i].entropy = (7.98 + Math.random() * 0.015).toFixed(3);
      this.state.encryption.encryptionEntropy = 7.99;
      this.addTelemetry('Crypto', 'ALERT', `Target locked: ${files[i].name}. Ext appended: .ransom_locked [AES-256-CBC]`);
      this.notify();
      if (onStepCallback) onStepCallback(i, 'encrypted');
    }

    this.state.encryption.status = 'complete';
    this.state.stagesCompleted['encryption'] = true;
    this.state.targetHost.health = 'COMPROMISED';
    this.notify();
  }

  // Step 4: Deploy Ransom Note & Wallpaper
  deployRansom() {
    this.state.ransom.ransomNoteDeployed = true;
    this.state.ransom.wallpaperHijacked = true;
    this.state.stagesCompleted['ransom'] = true;
    this.addTelemetry('Desktop', 'CRITICAL', 'Registry user wallpaper replaced: C:\\ProgramData\\lockscreen_threat.bmp');
    this.addTelemetry('FileSystem', 'ALERT', 'Ransom note written to 6 directories: HOW_TO_RECOVER_FILES.txt');
    this.notify();
  }

  confirmSimulatedPayment() {
    this.state.ransom.paymentConfirmed = true;
    this.addTelemetry('Simulation', 'INFO', 'Simulated ransom payment marked complete; recovery instructions revealed.');
    this.notify();
  }

  testFreeDecryption(fileId) {
    const file = this.state.encryption.files.find(f => f.id === fileId);
    if (!file) return;
    file.status = 'restored';
    file.currentHash = file.originalHash;
    this.state.ransom.freeDecryptUsed = true;
    this.state.ransom.freeDecryptedFileId = fileId;
    this.addTelemetry('ThreatActorPortal', 'SUCCESS', `Proof of Decryption: File ${file.name} successfully unlocked via one-time session token.`);
    this.notify();
  }

  sendNegotiationChat(msgText) {
    if (!msgText.trim()) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    this.state.ransom.chatMessages.push({
      sender: 'victim',
      time: timeStr,
      text: msgText
    });
    this.notify();

    // Auto responder from threat actor bot
    setTimeout(() => {
      const responses = [
        "Payment address is on your screen. Do not waste time, countdown is running.",
        "We are ready to provide the full decryptor tool immediately upon 1 confirmation on blockchain.",
        "Attempting third-party recovery will corrupt your files permanently. Only our master RSA key works."
      ];
      const botReply = responses[Math.floor(Math.random() * responses.length)];
      this.state.ransom.chatMessages.push({
        sender: 'operator',
        time: new Date().toTimeString().split(' ')[0],
        text: botReply
      });
      this.notify();
    }, 1200);
  }

  // Step 5: Execute Decryption & Recovery
  async startDecryption(onStepCallback) {
    if (this.state.decryption.status === 'decrypting') return;
    this.state.decryption.status = 'decrypting';
    this.state.decryption.keyValid = true;
    this.addTelemetry('RecoveryEngine', 'INFO', 'Master RSA-4096 Private Key validated against victim header fingerprint.');
    this.notify();

    const files = this.state.encryption.files;
    let restored = 0;
    for (let i = 0; i < files.length; i++) {
      files[i].status = 'restoring';
      this.notify();
      if (onStepCallback) onStepCallback(i, 'restoring');

      await new Promise(r => setTimeout(r, 400));

      files[i].status = 'restored';
      files[i].currentHash = files[i].originalHash;
      files[i].entropy = (3.4 + Math.random() * 1.5).toFixed(2);
      restored++;
      this.state.decryption.filesRestoredCount = restored;
      this.state.decryption.progress = Math.round((restored / files.length) * 100);
      this.addTelemetry('RecoveryEngine', 'SUCCESS', `File decrypted & SHA-256 verified: ${files[i].name}`);
      this.notify();
      if (onStepCallback) onStepCallback(i, 'restored');
    }

    this.state.decryption.status = 'verified';
    this.state.decryption.integrityStatus = '100% Cryptographically Verified';
    this.state.targetHost.health = 'RESTORED';
    this.state.stagesCompleted['decryption'] = true;
    this.addTelemetry('IncidentResponse', 'SUCCESS', 'All target files recovered. Remediation baseline completed.');
    this.notify();
  }

  resetAll() {
    this.reset();
    this.notify();
  }
}

export const store = new StateStore();
