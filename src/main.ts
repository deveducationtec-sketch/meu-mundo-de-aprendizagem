import './styles.css'
import { gameDefinitions, mountGame, type GameId } from './games'

type Preferences = {
  reduceMotion: boolean
  highContrast: boolean
  largeText: boolean
  calmVisuals: boolean
}

const preferenceKey = 'mma-accessibility-v1'
const defaultPreferences: Preferences = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  calmVisuals: false,
}

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Elemento principal da aplicação não encontrado.')

const catalogueCards = gameDefinitions.map((game, index) => `
  <article class="game-card theme-${game.theme}">
    <div class="game-art" aria-hidden="true">
      <span class="game-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="game-icon">${game.icon}</span>
    </div>
    <div class="game-copy">
      <p class="game-status">Jogo completo</p>
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <ul aria-label="Habilidades exploradas">
        ${game.skills.map((skill) => `<li>${skill}</li>`).join('')}
      </ul>
      <button class="primary-button play-button" type="button" data-game-id="${game.id}">
        Jogar agora
      </button>
    </div>
  </article>
`).join('')

app.innerHTML = `
  <header class="topbar">
    <button class="brand" type="button" aria-label="Meu Mundo de Aprendizagem — voltar ao início">
      <span class="brand-mark" aria-hidden="true">M</span>
      <span>Meu Mundo de Aprendizagem</span>
    </button>
    <span class="free-access">Grátis · sem cadastro</span>
  </header>

  <main id="conteudo">
    <section id="portal" aria-labelledby="welcome-title">
      <div class="welcome">
        <div>
          <p class="eyebrow">Aprender no seu ritmo</p>
          <h1 id="welcome-title" tabindex="-1">Escolha, jogue e descubra</h1>
          <p class="intro">Cinco jogos gratuitos, sem anúncios e sem cadastro. Aqui, cada criança pode observar, experimentar e tentar novamente com tranquilidade.</p>
        </div>
        <button class="accessibility-button" type="button" aria-expanded="false" aria-controls="preferences">
          Ajustar experiência
        </button>
      </div>

      <section id="preferences" class="preferences" hidden aria-labelledby="preferences-title">
        <div>
          <p class="section-kicker">Do seu jeito</p>
          <h2 id="preferences-title">Preferências de acessibilidade</h2>
          <p>Estas escolhas ficam somente neste navegador e podem ser alteradas a qualquer momento.</p>
        </div>
        <div class="preference-grid">
          <label><input id="reduce-motion" type="checkbox" /> Reduzir movimentos</label>
          <label><input id="high-contrast" type="checkbox" /> Aumentar contraste</label>
          <label><input id="large-text" type="checkbox" /> Aumentar textos</label>
          <label><input id="calm-visuals" type="checkbox" /> Visual mais calmo</label>
        </div>
        <button id="reset-preferences" class="text-button" type="button">Restaurar preferências</button>
      </section>

      <section class="principles" aria-label="Como são os jogos">
        <div><span aria-hidden="true">∞</span><strong>Sem pressa</strong><p>Nenhum jogo tem cronômetro.</p></div>
        <div><span aria-hidden="true">↻</span><strong>Tente novamente</strong><p>O erro faz parte da descoberta.</p></div>
        <div><span aria-hidden="true">◎</span><strong>Foco no essencial</strong><p>Instruções curtas e telas organizadas.</p></div>
      </section>

      <section class="catalogue" aria-labelledby="catalogue-title">
        <div class="section-heading">
          <div><p class="section-kicker">Biblioteca inicial</p><h2 id="catalogue-title">Escolha um jogo</h2></div>
          <p>Todos funcionam com mouse, toque ou teclado.</p>
        </div>
        <div class="catalogue-grid">${catalogueCards}</div>
      </section>

      <aside class="adult-note" aria-labelledby="adult-note-title">
        <span aria-hidden="true">💬</span>
        <div>
          <h2 id="adult-note-title">Para quem acompanha</h2>
          <p>Convide a criança a explicar escolhas e estratégias. Evite transformar a atividade em prova. Pausas são bem-vindas.</p>
        </div>
      </aside>

      <section id="privacidade" class="privacy-note" aria-labelledby="privacy-title">
        <h2 id="privacy-title">Privacidade nesta fase</h2>
        <p>Não pedimos nome, e-mail, idade, diagnóstico ou qualquer dado da criança. Não há conta, anúncios ou rastreamento de desempenho.</p>
      </section>
    </section>

    <section id="game-host" hidden></section>
  </main>

  <footer>
    <p><strong>Meu Mundo de Aprendizagem</strong> · Jogos educacionais gratuitos e inclusivos.</p>
    <p>Recurso complementar: não realiza diagnóstico e não substitui acompanhamento profissional.</p>
  </footer>
`

const get = <T extends Element>(selector: string): T | null => document.querySelector<T>(selector)
const portal = get<HTMLElement>('#portal')
const gameHost = get<HTMLElement>('#game-host')

function loadPreferences(): Preferences {
  try {
    const stored = window.localStorage.getItem(preferenceKey)
    if (!stored) return { ...defaultPreferences }
    const parsed = JSON.parse(stored) as Partial<Preferences>
    return { ...defaultPreferences, ...parsed }
  } catch {
    return { ...defaultPreferences }
  }
}

function applyPreferences(preferences: Preferences): void {
  const classes: Array<[keyof Preferences, string]> = [
    ['reduceMotion', 'reduce-motion'],
    ['highContrast', 'high-contrast'],
    ['largeText', 'large-text'],
    ['calmVisuals', 'calm-visuals'],
  ]

  classes.forEach(([key, className]) => {
    document.documentElement.classList.toggle(className, preferences[key])
  })

  const inputs: Array<[keyof Preferences, string]> = [
    ['reduceMotion', '#reduce-motion'],
    ['highContrast', '#high-contrast'],
    ['largeText', '#large-text'],
    ['calmVisuals', '#calm-visuals'],
  ]

  inputs.forEach(([key, selector]) => {
    const input = get<HTMLInputElement>(selector)
    if (input) input.checked = preferences[key]
  })
}

function savePreferences(preferences: Preferences): void {
  try {
    window.localStorage.setItem(preferenceKey, JSON.stringify(preferences))
  } catch {
    // A experiência continua funcionando mesmo se o navegador bloquear o armazenamento local.
  }
}

let preferences = loadPreferences()
applyPreferences(preferences)

function showPortal(focusGameId?: GameId): void {
  if (!portal || !gameHost) return
  portal.hidden = false
  gameHost.hidden = true
  gameHost.replaceChildren()

  if (focusGameId) {
    get<HTMLButtonElement>(`[data-game-id="${focusGameId}"]`)?.focus()
  } else {
    get<HTMLElement>('#welcome-title')?.focus()
  }
}

function openGame(gameId: GameId): void {
  if (!portal || !gameHost) return
  portal.hidden = true
  gameHost.hidden = false
  mountGame(gameId, gameHost, () => showPortal(gameId))
  gameHost.querySelector<HTMLElement>('h1')?.focus()
  window.scrollTo({ top: 0, behavior: preferences.reduceMotion ? 'auto' : 'smooth' })
}

get<HTMLButtonElement>('.brand')?.addEventListener('click', () => showPortal())

get<HTMLButtonElement>('.accessibility-button')?.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement
  const panel = get<HTMLElement>('#preferences')
  const opening = button.getAttribute('aria-expanded') !== 'true'
  button.setAttribute('aria-expanded', String(opening))
  if (panel) panel.hidden = !opening
  if (opening) get<HTMLInputElement>('#reduce-motion')?.focus()
})

const preferenceInputs: Array<[keyof Preferences, string]> = [
  ['reduceMotion', '#reduce-motion'],
  ['highContrast', '#high-contrast'],
  ['largeText', '#large-text'],
  ['calmVisuals', '#calm-visuals'],
]

preferenceInputs.forEach(([key, selector]) => {
  get<HTMLInputElement>(selector)?.addEventListener('change', (event) => {
    preferences = { ...preferences, [key]: (event.currentTarget as HTMLInputElement).checked }
    applyPreferences(preferences)
    savePreferences(preferences)
  })
})

get<HTMLButtonElement>('#reset-preferences')?.addEventListener('click', () => {
  preferences = { ...defaultPreferences }
  applyPreferences(preferences)
  savePreferences(preferences)
  get<HTMLInputElement>('#reduce-motion')?.focus()
})

document.querySelectorAll<HTMLButtonElement>('.play-button').forEach((button) => {
  button.addEventListener('click', () => openGame(button.dataset.gameId as GameId))
})
