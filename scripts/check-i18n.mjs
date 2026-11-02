import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC_DIR = join(process.cwd(), 'src')
const EN_PATH = join(SRC_DIR, 'i18n', 'en.json')
const HI_PATH = join(SRC_DIR, 'i18n', 'hi.json')

const en = JSON.parse(readFileSync(EN_PATH, 'utf8'))
const hi = JSON.parse(readFileSync(HI_PATH, 'utf8'))

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj)
}

function collectKeys(obj, prefix = '') {
  const keys = new Set()
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const sub of collectKeys(v, full)) keys.add(sub)
    } else {
      keys.add(full)
    }
  }
  return keys
}

const enKeys = collectKeys(en)
const hiKeys = collectKeys(hi)

// Find all t('...') and t("...") usages in src/
const tsFiles = []
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) tsFiles.push(full)
  }
}
walk(SRC_DIR)

const tKeyRegex = /t\(['"]([^'"]+)['"]\)/g
const usedKeys = new Set()
for (const file of tsFiles) {
  const content = readFileSync(file, 'utf8')
  let m
  while ((m = tKeyRegex.exec(content)) !== null) {
    usedKeys.add(m[1])
  }
}

const missing = []
for (const key of usedKeys) {
  const enVal = getNested(en, key)
  const hiVal = getNested(hi, key)
  if (enVal === undefined) missing.push({ key, lang: 'en' })
  if (hiVal === undefined) missing.push({ key, lang: 'hi' })
}

if (missing.length > 0) {
  console.error('Missing i18n keys:')
  for (const { key, lang } of missing) {
    console.error(`  ${key}  (missing in ${lang})`)
  }
  process.exit(1)
} else {
  console.log(`All ${usedKeys.size} i18n keys present in both en.json and hi.json.`)
}
