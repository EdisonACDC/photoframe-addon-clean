/**
 * PhotoFrame PRO License Validation
 * 
 * Formato codice NORMALE: PRO-2025-XXXX-YYYY
 * XXXX = Codice univoco (4 caratteri alfanumerici)
 * YYYY = Checksum calcolato da XXXX
 * 
 * Formato codice ADMIN: ADMIN-2025-PERM-XXXX
 * PERM = Permanente (blocca scadenza)
 * XXXX = Checksum speciale admin
 * 
 * Validazione offline (nessun server necessario)
 * 
 * TRIAL: 10 giorni gratuiti dall'installazione
 * FREE: Nessun effetto, nessun cestino
 * PRO: Tutti gli effetti + cestino
 * ADMIN: PRO permanente, nessuna scadenza
 */

const SECRET_SALT = "PhotoFrame-PRO-v1-2025-Marius";
const ADMIN_SALT = "PhotoFrame-ADMIN-Permanent-NoExpiry-2025";
export const TRIAL_DAYS = 10;

/**
 * Calcola checksum da un codice usando algoritmo segreto
 */
function calculateChecksum(code: string): string {
  const combined = code + SECRET_SALT;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert hash to base36 and take last 4 chars
  const checksum = Math.abs(hash).toString(36).toUpperCase().padStart(4, '0').slice(-4);
  return checksum;
}

/**
 * Calcola checksum ADMIN
 */
function calculateAdminChecksum(code: string): string {
  const combined = code + ADMIN_SALT;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const checksum = Math.abs(hash).toString(36).toUpperCase().padStart(4, '0').slice(-4);
  return checksum;
}

/**
 * Valida un codice licenza PRO o ADMIN
 */
export function validateLicenseKey(key: string): boolean {
  try {
    // Formato: PRO-2025-XXXX-YYYY o ADMIN-2025-PERM-XXXX
    const parts = key.trim().toUpperCase().split('-');
    
    if (parts.length !== 4) return false;
    
    // Valida codice ADMIN
    if (parts[0] === 'ADMIN') {
      if (parts[1] !== '2025') return false;
      if (parts[2] !== 'PERM') return false;
      if (parts[3].length !== 4) return false;
      
      const code = parts[2]; // "PERM"
      const providedChecksum = parts[3];
      const calculatedChecksum = calculateAdminChecksum(code);
      
      return providedChecksum === calculatedChecksum;
    }
    
    // Valida codice PRO normale
    if (parts[0] !== 'PRO') return false;
    if (parts[1] !== '2025') return false;
    if (parts[2].length !== 4) return false;
    if (parts[3].length !== 4) return false;
    
    const code = parts[2];
    const providedChecksum = parts[3];
    const calculatedChecksum = calculateChecksum(code);
    
    return providedChecksum === calculatedChecksum;
  } catch {
    return false;
  }
}

/**
 * Verifica se un codice è ADMIN (permanente)
 */
export function isAdminLicense(key: string): boolean {
  const parts = key.trim().toUpperCase().split('-');
  return parts.length === 4 && parts[0] === 'ADMIN' && parts[2] === 'PERM';
}

/**
 * Genera un codice licenza valido (per il generatore)
 */
export function generateLicenseKey(code: string): string {
  const cleanCode = code.toUpperCase().slice(0, 4).padEnd(4, '0');
  const checksum = calculateChecksum(cleanCode);
  return `PRO-2025-${cleanCode}-${checksum}`;
}

/**
 * Genera codice ADMIN permanente
 */
export function generateAdminLicenseKey(): string {
  const checksum = calculateAdminChecksum('PERM');
  return `ADMIN-2025-PERM-${checksum}`;
}

/**
 * Formatta un codice licenza per visualizzazione
 */
export function formatLicenseKey(key: string): string {
  return key.toUpperCase().replace(/[^A-Z0-9]/g, '').match(/.{1,4}/g)?.join('-') || key;
}

/**
 * Calcola giorni rimanenti del trial
 */
export function calculateTrialDaysRemaining(firstLaunchDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - firstLaunchDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const remaining = TRIAL_DAYS - diffDays;
  return Math.max(0, remaining);
}

/**
 * Verifica se il trial è scaduto
 */
export function isTrialExpired(firstLaunchDate: Date): boolean {
  return calculateTrialDaysRemaining(firstLaunchDate) === 0;
}
