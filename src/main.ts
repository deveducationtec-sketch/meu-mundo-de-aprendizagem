import './styles.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) throw new Error('Elemento principal da aplicação não encontrado.')

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Meu Mundo de Aprendizagem — início">
      <span class="brand-mark" aria-hidden="true">M</span>
      <span>Meu Mundo de Aprendizagem</span>
    </a>
    <button class="secondary-button" type="button" disabled aria-describedby="login-status">
      Entrar
    </button>
    <span id="login-status" class="sr-only">O login será ativado na próxima etapa.</span>
  </header>

  <main id="conteudo">
    <section class="welcome" aria-labelledby="welcome-title">
      <div>
        <p class="eyebrow">Aprender no seu ritmo</p>
        <h1 id="welcome-title">Escolha uma aventura</h1>
        <p class="intro">Atividades curtas, instruções claras e controles que respeitam suas preferências.</p>
      </div>
      <button class="accessibility-button" type="button" aria-expanded="false" aria-controls="preferences">
        Preferências
      </button>
    </section>

    <section id="preferences" class="preferences" hidden aria-labelledby="preferences-title">
      <h2 id="preferences-title">Preferências de acessibilidade</h2>
      <label><input id="reduce-motion" type="checkbox" /> Reduzir movimentos</label>
      <label><input id="high-contrast" type="checkbox" /> Aumentar contraste</label>
    </section>

    <section class="catalogue" aria-labelledby="catalogue-title">
      <h2 id="catalogue-title">Jogos</h2>
      <article class="game-card">
        <div class="game-art" aria-hidden="true">
          <span>1</span><span>2</span><span>3</span>
        </div>
        <div class="game-copy">
          <p class="game-status">Primeiro jogo</p>
          <h3>Organize Meu Dia</h3>
          <p>Coloque as atividades na ordem e descubra como cada rotina se completa.</p>
          <ul aria-label="Habilidades trabalhadas">
            <li>Sequência lógica</li>
            <li>Rotina</li>
            <li>Associação</li>
          </ul>
          <button id="play-button" class="primary-button" type="button">Conhecer o jogo</button>
        </div>
      </article>
    </section>

    <section id="prototype-message" class="prototype-message" hidden tabindex="-1">
      <h2>Fundação pronta</h2>
      <p>A tela inicial já representa o produto. Na próxima etapa, este botão abrirá a primeira atividade jogável.</p>
    </section>
  </main>

  <footer>
    <p>Produto educacional complementar. Não realiza diagnóstico e não substitui acompanhamento profissional.</p>
  </footer>
`

const preferencesButton = document.querySelector<HTMLButtonElement>('.accessibility-button')
const preferences = document.querySelector<HTMLElement>('#preferences')
const reduceMotion = document.querySelector<HTMLInputElement>('#reduce-motion')
const highContrast = document.querySelector<HTMLInputElement>('#high-contrast')
const playButton = document.querySelector<HTMLButtonElement>('#play-button')
const prototypeMessage = document.querySelector<HTMLElement>('#prototype-message')

preferencesButton?.addEventListener('click', () => {
  const isOpen = preferencesButton.getAttribute('aria-expanded') === 'true'
  preferencesButton.setAttribute('aria-expanded', String(!isOpen))
  if (preferences) preferences.hidden = isOpen
})

reduceMotion?.addEventListener('change', () => {
  document.documentElement.classList.toggle('reduce-motion', reduceMotion.checked)
})

highContrast?.addEventListener('change', () => {
  document.documentElement.classList.toggle('high-contrast', highContrast.checked)
})

playButton?.addEventListener('click', () => {
  if (!prototypeMessage) return
  prototypeMessage.hidden = false
  prototypeMessage.focus()
})

