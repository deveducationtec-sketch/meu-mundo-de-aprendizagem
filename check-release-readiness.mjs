import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const requiredDocuments = [
  'docs/legal/AVISO_DE_PRIVACIDADE_FREE.md',
]

const blockers = []

for (const file of requiredDocuments) {
  const content = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  const pendingLines = content
    .split('\n')
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => line.includes('[PREENCHER') || line.includes('[CRIAR E PREENCHER') || line.includes('[DEFINIR'))

  for (const pending of pendingLines) {
    blockers.push(`${file}:${pending.number} — ${pending.line.trim()}`)
  }
}

const forbiddenInFreePhase = [
  ['type="email"', 'campo de e-mail'],
  ['type="password"', 'campo de senha'],
  ['supabase', 'integração Supabase'],
]

const sourceDirectory = new URL('../src/', import.meta.url)
const sourcePath = fileURLToPath(sourceDirectory)
const activeSourceFiles = readdirSync(sourceDirectory)
  .filter((file) => ['.ts', '.tsx', '.js', '.jsx'].includes(extname(file)))

for (const file of activeSourceFiles) {
  const activeSource = readFileSync(join(sourcePath, file), 'utf8').toLowerCase()
  for (const [pattern, description] of forbiddenInFreePhase) {
    if (activeSource.includes(pattern)) {
      blockers.push(`src/${file} — ${description} não é permitido na Fase Free`)
    }
  }
}

if (blockers.length > 0) {
  console.error('Publicação bloqueada. Resolva os seguintes campos obrigatórios:')
  for (const blocker of blockers) console.error(`- ${blocker}`)
  process.exitCode = 1
} else {
  console.log('Fase Free pronta: aviso preenchido e nenhum cadastro detectado no código ativo.')
}
