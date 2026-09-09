import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const requiredDocuments = [
  'docs/legal/AVISO_DE_PRIVACIDADE_FREE.md',
  'docs/FICHA_PEDAGOGICA_006.md',
  'docs/FICHA_PEDAGOGICA_007.md',
  'docs/FICHA_PEDAGOGICA_008.md',
  'docs/FICHA_PEDAGOGICA_009.md',
  'docs/FICHA_PEDAGOGICA_010.md',
  'docs/LICENCAS_AUDIO.md',
  'docs/PLANO_PILOTO_10_JOGOS.md',
  'docs/REFERENCIAS_PEDAGOGICAS.md',
]

const requiredAudioAssets = [
  'cat.mp3',
  'cow.mp3',
  'dog.mp3',
  'drums.mp3',
  'flute.mp3',
  'guitar-acoustic.mp3',
  'horse.mp3',
  'piano.mp3',
  'rooster.mp3',
  'sheep.mp3',
  'trumpet.mp3',
  'violin.mp3',
]

const requiredGameTitles = [
  'Organize Meu Dia',
  'Encontre os Pares',
  'Repita a Sequência',
  'Jardim do Foco',
  'Cada Coisa no Seu Lugar',
  'Quem Faz Esse Som?',
  'Palavra em Pedaços',
  'Quantos Ficaram?',
  'Laboratório da Sementinha',
  'Onde e Quando?',
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
  ['getusermedia', 'acesso a câmera ou microfone'],
  ['mediarecorder', 'gravação de mídia'],
  ['autoplay', 'reprodução automática de mídia'],
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

for (const file of requiredAudioAssets) {
  const path = fileURLToPath(new URL(`../public/audio/${file}`, import.meta.url))
  if (!existsSync(path)) {
    blockers.push(`public/audio/${file} — áudio obrigatório ausente`)
    continue
  }
  if (statSync(path).size < 1_000) {
    blockers.push(`public/audio/${file} — arquivo de áudio vazio ou inválido`)
  }
}

const gamesSource = readFileSync(new URL('../src/games.ts', import.meta.url), 'utf8')
for (const title of requiredGameTitles) {
  if (!gamesSource.includes(`title: '${title}'`)) {
    blockers.push(`src/games.ts — jogo obrigatório ausente: ${title}`)
  }
}

if (blockers.length > 0) {
  console.error('Publicação bloqueada. Resolva os seguintes campos obrigatórios:')
  for (const blocker of blockers) console.error(`- ${blocker}`)
  process.exitCode = 1
} else {
  console.log('Fase Free pronta: dez jogos, documentos e áudios presentes e nenhum cadastro detectado no código ativo.')
}
