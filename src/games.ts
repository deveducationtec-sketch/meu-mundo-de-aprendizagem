export type GameId = 'routine' | 'pairs' | 'sequence' | 'focus' | 'classify'
export type GameTheme = 'mint' | 'violet' | 'coral' | 'blue' | 'yellow'

export type GameDefinition = {
  id: GameId
  title: string
  shortTitle: string
  icon: string
  description: string
  instruction: string
  skills: string[]
  theme: GameTheme
}

export const gameDefinitions: GameDefinition[] = [
  {
    id: 'routine',
    title: 'Organize Meu Dia',
    shortTitle: 'Organize Meu Dia',
    icon: '🧩',
    description: 'Coloque atividades cotidianas na ordem e complete três rotinas tranquilamente.',
    instruction: 'Escolha o cartão que acontece primeiro e continue até completar a rotina.',
    skills: ['Sequência', 'Rotina', 'Associação'],
    theme: 'mint',
  },
  {
    id: 'pairs',
    title: 'Encontre os Pares',
    shortTitle: 'Encontre os Pares',
    icon: '🎴',
    description: 'Vire os cartões, observe as figuras e encontre quatro pares iguais.',
    instruction: 'Abra dois cartões por vez. Se forem diferentes, observe e escolha continuar.',
    skills: ['Memória visual', 'Atenção', 'Observação'],
    theme: 'violet',
  },
  {
    id: 'sequence',
    title: 'Repita a Sequência',
    shortTitle: 'Repita a Sequência',
    icon: '🔷',
    description: 'Observe uma pequena sequência de símbolos e monte-a na mesma ordem.',
    instruction: 'Observe os símbolos, esconda o modelo quando estiver pronto e repita a ordem.',
    skills: ['Memória', 'Ordem', 'Percepção'],
    theme: 'coral',
  },
  {
    id: 'focus',
    title: 'Jardim do Foco',
    shortTitle: 'Jardim do Foco',
    icon: '🌼',
    description: 'Procure no jardim somente as figuras indicadas, sem pressa e sem distrações sonoras.',
    instruction: 'Observe a figura-alvo e encontre todas as iguais no jardim.',
    skills: ['Atenção visual', 'Seleção', 'Persistência'],
    theme: 'blue',
  },
  {
    id: 'classify',
    title: 'Cada Coisa no Seu Lugar',
    shortTitle: 'Cada Coisa no Lugar',
    icon: '🧺',
    description: 'Ajude a organizar objetos nas categorias comer, vestir e brincar.',
    instruction: 'Observe o objeto e escolha a categoria que combina com ele.',
    skills: ['Classificação', 'Vocabulário', 'Associação'],
    theme: 'yellow',
  },
]

type ShellElements = {
  content: HTMLElement
  feedback: HTMLElement
  progress: HTMLElement
  completion: HTMLElement
}

function query<T extends Element>(host: ParentNode, selector: string): T {
  const element = host.querySelector<T>(selector)
  if (!element) throw new Error(`Elemento do jogo não encontrado: ${selector}`)
  return element
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    const current = result[index]
    result[index] = result[target]
    result[target] = current
  }
  return result
}

function gameShell(host: HTMLElement, game: GameDefinition): ShellElements {
  host.innerHTML = `
    <section class="game-screen theme-${game.theme}" aria-labelledby="game-title">
      <button class="text-button back-button" type="button">← Voltar aos jogos</button>
      <div class="game-heading">
        <div>
          <p class="eyebrow">${game.shortTitle}</p>
          <h1 id="game-title" tabindex="-1">${game.title}</h1>
          <p class="intro">${game.instruction}</p>
        </div>
        <p class="progress" aria-live="polite">Preparando…</p>
      </div>
      <div class="feedback" role="status" aria-live="polite">Pode começar. Não há cronômetro.</div>
      <div class="game-content"></div>
      <section class="completion" hidden tabindex="-1" aria-labelledby="completion-title">
        <span class="completion-icon" aria-hidden="true">★</span>
        <div><h2 id="completion-title">Muito bem!</h2><p class="completion-copy">Você concluiu o jogo.</p></div>
        <div class="completion-actions"></div>
      </section>
    </section>
  `

  return {
    content: query(host, '.game-content'),
    feedback: query(host, '.feedback'),
    progress: query(host, '.progress'),
    completion: query(host, '.completion'),
  }
}

function setFeedback(element: HTMLElement, message: string, kind: 'neutral' | 'success' | 'try' = 'neutral'): void {
  element.textContent = message
  element.dataset.kind = kind
}

function showCompletion(
  completion: HTMLElement,
  title: string,
  copy: string,
  actions: Array<{ label: string; className: string; onClick: () => void }>,
): void {
  query<HTMLElement>(completion, '#completion-title').textContent = title
  query<HTMLElement>(completion, '.completion-copy').textContent = copy
  const actionArea = query<HTMLElement>(completion, '.completion-actions')
  actionArea.replaceChildren()
  actions.forEach((action) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = action.className
    button.textContent = action.label
    button.addEventListener('click', action.onClick)
    actionArea.append(button)
  })
  completion.hidden = false
  completion.focus()
}

function hideCompletion(completion: HTMLElement): void {
  completion.hidden = true
}

function mountRoutine(shell: ShellElements): void {
  type RoutineCard = { id: string; emoji: string; title: string; description: string }
  type Scenario = { title: string; instruction: string; cards: RoutineCard[] }

  const scenarios: Scenario[] = [
    {
      title: 'Rotina da manhã',
      instruction: 'Organize o começo do dia.',
      cards: [
        { id: 'acordar', emoji: '☀️', title: 'Acordar', description: 'O dia começa.' },
        { id: 'escovar', emoji: '🪥', title: 'Escovar os dentes', description: 'Cuidar do sorriso.' },
        { id: 'cafe', emoji: '🥣', title: 'Tomar o café', description: 'Preparar-se para o dia.' },
      ],
    },
    {
      title: 'Preparar a mochila',
      instruction: 'Organize os passos antes de sair.',
      cards: [
        { id: 'horario', emoji: '📅', title: 'Ver o horário', description: 'Descobrir as atividades do dia.' },
        { id: 'material', emoji: '📚', title: 'Separar o material', description: 'Escolher livros e cadernos.' },
        { id: 'guardar', emoji: '🎒', title: 'Guardar na mochila', description: 'Colocar tudo com cuidado.' },
        { id: 'conferir', emoji: '✅', title: 'Conferir', description: 'Ver se está tudo pronto.' },
      ],
    },
    {
      title: 'Hora de dormir',
      instruction: 'Organize o encerramento do dia.',
      cards: [
        { id: 'guardar-brinquedos', emoji: '🧸', title: 'Guardar os brinquedos', description: 'Organizar o espaço.' },
        { id: 'pijama', emoji: '👕', title: 'Colocar o pijama', description: 'Vestir uma roupa confortável.' },
        { id: 'escovar-noite', emoji: '🪥', title: 'Escovar os dentes', description: 'Cuidar do sorriso.' },
        { id: 'deitar', emoji: '🌙', title: 'Deitar para dormir', description: 'Descansar para um novo dia.' },
      ],
    },
  ]

  shell.content.innerHTML = `
    <div class="activity-heading"><p class="stage-label"></p><h2 class="stage-title" tabindex="-1"></h2><p class="stage-instruction"></p></div>
    <section aria-labelledby="available-title">
      <h3 id="available-title">Atividades disponíveis</h3>
      <div class="routine-grid"></div>
    </section>
    <section class="answer-area" aria-labelledby="answer-title">
      <h3 id="answer-title">Sua ordem</h3>
      <ol class="answer-list"></ol>
    </section>
    <div class="game-actions">
      <button class="secondary-button hint-button" type="button">Quero uma dica</button>
      <button class="secondary-button restart-button" type="button">Recomeçar esta rotina</button>
    </div>
  `

  const available = query<HTMLElement>(shell.content, '.routine-grid')
  const answer = query<HTMLOListElement>(shell.content, '.answer-list')
  let scenarioIndex = 0
  let remaining: RoutineCard[] = []
  let selected: RoutineCard[] = []

  const render = (): void => {
    const scenario = scenarios[scenarioIndex]
    shell.progress.textContent = `${selected.length} de ${scenario.cards.length}`
    available.innerHTML = remaining.map((card) => `
      <button class="routine-card" type="button" data-card-id="${card.id}" aria-label="Escolher ${card.title}">
        <span class="routine-emoji" aria-hidden="true">${card.emoji}</span>
        <strong>${card.title}</strong><span>${card.description}</span>
      </button>
    `).join('')
    answer.innerHTML = selected.length > 0
      ? selected.map((card) => `<li><span aria-hidden="true">${card.emoji}</span><strong>${card.title}</strong></li>`).join('')
      : '<li class="empty-answer">As atividades escolhidas aparecerão aqui.</li>'
    available.querySelectorAll<HTMLButtonElement>('[data-card-id]').forEach((button) => {
      button.addEventListener('click', () => choose(button.dataset.cardId ?? ''))
    })
  }

  const startScenario = (message = 'Pode começar. Escolha uma atividade de cada vez.'): void => {
    const scenario = scenarios[scenarioIndex]
    query<HTMLElement>(shell.content, '.stage-label').textContent = `Rotina ${scenarioIndex + 1} de ${scenarios.length}`
    query<HTMLElement>(shell.content, '.stage-title').textContent = scenario.title
    query<HTMLElement>(shell.content, '.stage-instruction').textContent = scenario.instruction
    remaining = shuffle(scenario.cards)
    selected = []
    hideCompletion(shell.completion)
    setFeedback(shell.feedback, message)
    render()
  }

  const choose = (cardId: string): void => {
    const scenario = scenarios[scenarioIndex]
    const expected = scenario.cards[selected.length]
    const card = remaining.find((item) => item.id === cardId)
    if (!card || !expected) return
    if (card.id !== expected.id) {
      setFeedback(shell.feedback, 'Quase! Pense no que acontece antes. Você pode tentar novamente.', 'try')
      available.querySelector<HTMLButtonElement>(`[data-card-id="${card.id}"]`)?.focus()
      return
    }

    selected.push(card)
    remaining = remaining.filter((item) => item.id !== card.id)
    render()

    if (selected.length < scenario.cards.length) {
      setFeedback(shell.feedback, 'Boa escolha! Agora selecione a próxima atividade.', 'success')
      available.querySelector<HTMLButtonElement>('button')?.focus()
      return
    }

    setFeedback(shell.feedback, 'Rotina completa. Muito bem!', 'success')
    const lastScenario = scenarioIndex === scenarios.length - 1
    showCompletion(
      shell.completion,
      lastScenario ? 'Você organizou o dia!' : 'Rotina completa!',
      lastScenario ? 'As três rotinas foram concluídas.' : 'Quando quiser, você pode conhecer a próxima rotina.',
      [{
        label: lastScenario ? 'Jogar desde o começo' : 'Próxima rotina',
        className: 'primary-button',
        onClick: () => {
          scenarioIndex = lastScenario ? 0 : scenarioIndex + 1
          startScenario(lastScenario ? 'Vamos organizar novamente.' : 'Nova rotina. Comece quando quiser.')
          query<HTMLElement>(shell.content, '.stage-title').focus()
        },
      }],
    )
  }

  query<HTMLButtonElement>(shell.content, '.hint-button').addEventListener('click', () => {
    const expected = scenarios[scenarioIndex].cards[selected.length]
    if (!expected) return
    setFeedback(shell.feedback, `Dica: procure a atividade “${expected.title}”.`)
    available.querySelector<HTMLButtonElement>(`[data-card-id="${expected.id}"]`)?.focus()
  })
  query<HTMLButtonElement>(shell.content, '.restart-button').addEventListener('click', () => startScenario('Tudo pronto para uma nova tentativa.'))
  startScenario()
}

function mountPairs(shell: ShellElements): void {
  type PairCard = { instanceId: string; pairId: string; emoji: string; label: string }
  const figures = [
    { pairId: 'sun', emoji: '☀️', label: 'Sol' },
    { pairId: 'flower', emoji: '🌼', label: 'Flor' },
    { pairId: 'fish', emoji: '🐟', label: 'Peixe' },
    { pairId: 'kite', emoji: '🪁', label: 'Pipa' },
  ]

  shell.content.innerHTML = `
    <div class="activity-heading"><p class="stage-label">Quatro pares</p><h2>Abra dois cartões</h2><p>Os cartões diferentes permanecem abertos até você escolher continuar.</p></div>
    <div class="memory-grid" aria-label="Cartões do jogo da memória"></div>
    <div class="game-actions">
      <button class="secondary-button continue-button" type="button" hidden>Continuar</button>
      <button class="secondary-button restart-button" type="button">Misturar de novo</button>
    </div>
  `

  const grid = query<HTMLElement>(shell.content, '.memory-grid')
  const continueButton = query<HTMLButtonElement>(shell.content, '.continue-button')
  let cards: PairCard[] = []
  let opened: string[] = []
  let matched = new Set<string>()

  const render = (): void => {
    shell.progress.textContent = `${matched.size} de ${figures.length} pares`
    grid.innerHTML = cards.map((card) => {
      const isOpen = opened.includes(card.instanceId) || matched.has(card.pairId)
      const isMatched = matched.has(card.pairId)
      return `
        <button class="memory-card${isOpen ? ' is-open' : ''}${isMatched ? ' is-matched' : ''}" type="button"
          data-card-id="${card.instanceId}" aria-label="${isOpen ? card.label : 'Cartão fechado'}"
          aria-pressed="${isOpen}" ${isOpen ? 'disabled' : ''}>
          <span class="card-back" aria-hidden="true">?</span>
          <span class="card-front" aria-hidden="true">${card.emoji}</span>
          <span class="card-label">${isOpen ? card.label : 'Virar'}</span>
        </button>
      `
    }).join('')
    grid.querySelectorAll<HTMLButtonElement>('[data-card-id]').forEach((button) => {
      button.addEventListener('click', () => reveal(button.dataset.cardId ?? ''))
    })
  }

  const reveal = (instanceId: string): void => {
    if (opened.length >= 2) return
    const card = cards.find((item) => item.instanceId === instanceId)
    if (!card || matched.has(card.pairId)) return
    opened.push(instanceId)
    render()

    if (opened.length === 1) {
      setFeedback(shell.feedback, `${card.label}. Agora abra mais um cartão.`)
      grid.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
      return
    }

    const first = cards.find((item) => item.instanceId === opened[0])
    const second = cards.find((item) => item.instanceId === opened[1])
    if (!first || !second) return
    if (first.pairId === second.pairId) {
      matched.add(first.pairId)
      opened = []
      render()
      setFeedback(shell.feedback, `Par encontrado: ${first.label}!`, 'success')
      if (matched.size === figures.length) {
        showCompletion(shell.completion, 'Todos os pares encontrados!', 'Você observou e encontrou as quatro combinações.', [{
          label: 'Jogar novamente', className: 'primary-button', onClick: start,
        }])
      } else {
        grid.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
      }
      return
    }

    setFeedback(shell.feedback, `${first.label} e ${second.label} são diferentes. Observe e continue quando estiver pronto.`, 'try')
    continueButton.hidden = false
    continueButton.focus()
  }

  const closeMismatch = (): void => {
    opened = []
    continueButton.hidden = true
    setFeedback(shell.feedback, 'Cartões fechados. Você pode tentar outro par.')
    render()
    grid.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
  }

  function start(): void {
    cards = shuffle(figures.flatMap((figure) => [
      { ...figure, instanceId: `${figure.pairId}-a` },
      { ...figure, instanceId: `${figure.pairId}-b` },
    ]))
    opened = []
    matched = new Set<string>()
    continueButton.hidden = true
    hideCompletion(shell.completion)
    setFeedback(shell.feedback, 'Pode começar. Abra um cartão para ver a figura.')
    render()
  }

  continueButton.addEventListener('click', closeMismatch)
  query<HTMLButtonElement>(shell.content, '.restart-button').addEventListener('click', start)
  start()
}

function mountSequence(shell: ShellElements): void {
  type SymbolItem = { id: string; emoji: string; label: string }
  const symbols: SymbolItem[] = [
    { id: 'circle', emoji: '●', label: 'Círculo' },
    { id: 'square', emoji: '■', label: 'Quadrado' },
    { id: 'triangle', emoji: '▲', label: 'Triângulo' },
    { id: 'star', emoji: '★', label: 'Estrela' },
  ]
  const lengths = [3, 4, 5]

  shell.content.innerHTML = `
    <div class="activity-heading"><p class="stage-label"></p><h2>Observe e repita</h2><p>Você decide quando esconder o modelo. Não há contagem regressiva.</p></div>
    <section class="sequence-stage" aria-labelledby="model-title">
      <h3 id="model-title">Sequência para observar</h3>
      <div class="sequence-row sequence-model"></div>
      <button class="primary-button hide-model-button" type="button">Já observei</button>
    </section>
    <section class="sequence-answer" hidden aria-labelledby="your-sequence-title">
      <h3 id="your-sequence-title">Monte a mesma sequência</h3>
      <div class="sequence-row chosen-sequence" aria-live="polite"></div>
      <div class="symbol-palette" aria-label="Símbolos disponíveis"></div>
      <div class="game-actions">
        <button class="secondary-button undo-button" type="button">Apagar último</button>
        <button class="secondary-button review-button" type="button">Ver modelo novamente</button>
      </div>
    </section>
  `

  const model = query<HTMLElement>(shell.content, '.sequence-model')
  const stage = query<HTMLElement>(shell.content, '.sequence-stage')
  const answerSection = query<HTMLElement>(shell.content, '.sequence-answer')
  const chosenView = query<HTMLElement>(shell.content, '.chosen-sequence')
  const palette = query<HTMLElement>(shell.content, '.symbol-palette')
  let roundIndex = 0
  let target: SymbolItem[] = []
  let chosen: SymbolItem[] = []

  const renderChosen = (): void => {
    const total = lengths[roundIndex]
    shell.progress.textContent = `${chosen.length} de ${total} símbolos`
    chosenView.innerHTML = Array.from({ length: total }, (_, index) => {
      const symbol = chosen[index]
      return symbol
        ? `<span class="sequence-token" aria-label="${symbol.label}">${symbol.emoji}</span>`
        : '<span class="sequence-token empty-token" aria-hidden="true">·</span>'
    }).join('')
  }

  const chooseSymbol = (symbolId: string): void => {
    if (chosen.length >= target.length) return
    const symbol = symbols.find((item) => item.id === symbolId)
    if (!symbol) return
    chosen.push(symbol)
    renderChosen()

    const index = chosen.length - 1
    if (symbol.id !== target[index].id) {
      setFeedback(shell.feedback, 'Esse símbolo está em outra posição. Você pode apagar ou rever o modelo.', 'try')
      return
    }
    if (chosen.length < target.length) {
      setFeedback(shell.feedback, 'Boa! Escolha o próximo símbolo.', 'success')
      return
    }

    const allCorrect = chosen.every((candidate, candidateIndex) => candidate.id === target[candidateIndex].id)
    if (!allCorrect) {
      setFeedback(shell.feedback, 'Há um símbolo em outra posição. Você pode apagar ou rever o modelo.', 'try')
      return
    }

    setFeedback(shell.feedback, 'Sequência correta!', 'success')
    const lastRound = roundIndex === lengths.length - 1
    showCompletion(
      shell.completion,
      lastRound ? 'Três sequências completas!' : 'Sequência completa!',
      lastRound ? 'Você observou sequências de três, quatro e cinco símbolos.' : 'Quando quiser, experimente a próxima sequência.',
      [{
        label: lastRound ? 'Jogar desde o começo' : 'Próxima sequência',
        className: 'primary-button',
        onClick: () => {
          roundIndex = lastRound ? 0 : roundIndex + 1
          startRound()
        },
      }],
    )
  }

  const showModel = (message = 'Observe pelo tempo que precisar.'): void => {
    stage.hidden = false
    answerSection.hidden = true
    model.innerHTML = target.map((symbol) => `<span class="sequence-token" aria-label="${symbol.label}">${symbol.emoji}</span>`).join('')
    setFeedback(shell.feedback, message)
    query<HTMLButtonElement>(shell.content, '.hide-model-button').focus()
  }

  const hideModel = (): void => {
    stage.hidden = true
    answerSection.hidden = false
    setFeedback(shell.feedback, 'Agora monte a sequência na mesma ordem.')
    palette.querySelector<HTMLButtonElement>('button')?.focus()
  }

  const startRound = (): void => {
    const length = lengths[roundIndex]
    target = Array.from({ length }, () => symbols[Math.floor(Math.random() * symbols.length)])
    chosen = []
    query<HTMLElement>(shell.content, '.stage-label').textContent = `Etapa ${roundIndex + 1} de ${lengths.length} · ${length} símbolos`
    palette.innerHTML = symbols.map((symbol) => `
      <button class="symbol-button" type="button" data-symbol-id="${symbol.id}" aria-label="Escolher ${symbol.label}">
        <span aria-hidden="true">${symbol.emoji}</span><strong>${symbol.label}</strong>
      </button>
    `).join('')
    palette.querySelectorAll<HTMLButtonElement>('[data-symbol-id]').forEach((button) => {
      button.addEventListener('click', () => chooseSymbol(button.dataset.symbolId ?? ''))
    })
    renderChosen()
    hideCompletion(shell.completion)
    showModel()
  }

  query<HTMLButtonElement>(shell.content, '.hide-model-button').addEventListener('click', hideModel)
  query<HTMLButtonElement>(shell.content, '.undo-button').addEventListener('click', () => {
    if (chosen.length === 0) {
      setFeedback(shell.feedback, 'Ainda não há símbolos para apagar.')
      return
    }
    chosen.pop()
    renderChosen()
    setFeedback(shell.feedback, 'Último símbolo apagado. Continue quando quiser.')
    palette.querySelector<HTMLButtonElement>('button')?.focus()
  })
  query<HTMLButtonElement>(shell.content, '.review-button').addEventListener('click', () => showModel('Modelo visível novamente. Observe pelo tempo que precisar.'))
  startRound()
}

function mountFocus(shell: ShellElements): void {
  type FocusItem = { emoji: string; label: string }
  type FocusRound = { target: FocusItem; items: FocusItem[] }
  const flower = { emoji: '🌼', label: 'flor amarela' }
  const leaf = { emoji: '🍃', label: 'folha' }
  const butterfly = { emoji: '🦋', label: 'borboleta' }
  const ladybug = { emoji: '🐞', label: 'joaninha' }
  const bee = { emoji: '🐝', label: 'abelha' }
  const rounds: FocusRound[] = [
    { target: flower, items: [flower, leaf, butterfly, flower, ladybug, flower, leaf, bee, flower] },
    { target: butterfly, items: [leaf, butterfly, flower, ladybug, butterfly, bee, leaf, butterfly, flower, butterfly, ladybug, leaf] },
    { target: ladybug, items: [ladybug, leaf, bee, flower, ladybug, butterfly, leaf, ladybug, flower, bee, ladybug, leaf] },
  ]

  shell.content.innerHTML = `
    <div class="activity-heading"><p class="stage-label"></p><h2>Encontre as figuras</h2><p>Selecione somente a figura indicada. As outras permanecem no jardim.</p></div>
    <div class="target-banner"></div>
    <div class="focus-grid" aria-label="Jardim de figuras"></div>
    <div class="game-actions"><button class="secondary-button restart-button" type="button">Recomeçar esta etapa</button></div>
  `

  const grid = query<HTMLElement>(shell.content, '.focus-grid')
  const targetBanner = query<HTMLElement>(shell.content, '.target-banner')
  let roundIndex = 0
  let items: FocusItem[] = []
  let found = new Set<number>()

  const render = (): void => {
    const round = rounds[roundIndex]
    const targetCount = round.items.filter((item) => item.label === round.target.label).length
    shell.progress.textContent = `${found.size} de ${targetCount}`
    grid.innerHTML = items.map((item, index) => {
      const isFound = found.has(index)
      return `
        <button class="focus-item${isFound ? ' is-found' : ''}" type="button" data-item-index="${index}"
          aria-label="${item.label}${isFound ? ', encontrada' : ''}" ${isFound ? 'disabled' : ''}>
          <span aria-hidden="true">${item.emoji}</span>
        </button>
      `
    }).join('')
    grid.querySelectorAll<HTMLButtonElement>('[data-item-index]').forEach((button) => {
      button.addEventListener('click', () => chooseItem(Number(button.dataset.itemIndex)))
    })
  }

  const chooseItem = (index: number): void => {
    const round = rounds[roundIndex]
    const item = items[index]
    if (!item || found.has(index)) return
    if (item.label !== round.target.label) {
      setFeedback(shell.feedback, `Essa é ${item.label}. Procure ${round.target.label}.`, 'try')
      grid.querySelector<HTMLButtonElement>(`[data-item-index="${index}"]`)?.focus()
      return
    }

    found.add(index)
    render()
    setFeedback(shell.feedback, `Você encontrou ${round.target.label}!`, 'success')
    const targetCount = round.items.filter((candidate) => candidate.label === round.target.label).length
    if (found.size < targetCount) {
      grid.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
      return
    }

    const lastRound = roundIndex === rounds.length - 1
    showCompletion(
      shell.completion,
      lastRound ? 'Jardim completo!' : 'Etapa completa!',
      lastRound ? 'Você encontrou todas as figuras das três etapas.' : 'Todas as figuras-alvo foram encontradas.',
      [{
        label: lastRound ? 'Jogar desde o começo' : 'Próxima etapa',
        className: 'primary-button',
        onClick: () => {
          roundIndex = lastRound ? 0 : roundIndex + 1
          startRound()
        },
      }],
    )
  }

  const startRound = (): void => {
    const round = rounds[roundIndex]
    items = shuffle(round.items)
    found = new Set<number>()
    hideCompletion(shell.completion)
    query<HTMLElement>(shell.content, '.stage-label').textContent = `Etapa ${roundIndex + 1} de ${rounds.length}`
    targetBanner.innerHTML = `<span aria-hidden="true">${round.target.emoji}</span><strong>Encontre: ${round.target.label}</strong>`
    setFeedback(shell.feedback, `Procure todas as figuras: ${round.target.label}.`)
    render()
  }

  query<HTMLButtonElement>(shell.content, '.restart-button').addEventListener('click', startRound)
  startRound()
}

function mountClassify(shell: ShellElements): void {
  type CategoryId = 'eat' | 'wear' | 'play'
  type SortItem = { id: string; emoji: string; label: string; category: CategoryId }
  const categories: Array<{ id: CategoryId; emoji: string; label: string; description: string }> = [
    { id: 'eat', emoji: '🍽️', label: 'Comer', description: 'Alimentos' },
    { id: 'wear', emoji: '👕', label: 'Vestir', description: 'Roupas' },
    { id: 'play', emoji: '🧸', label: 'Brincar', description: 'Brinquedos' },
  ]
  const sourceItems: SortItem[] = [
    { id: 'banana', emoji: '🍌', label: 'Banana', category: 'eat' },
    { id: 'shirt', emoji: '👕', label: 'Camiseta', category: 'wear' },
    { id: 'ball', emoji: '⚽', label: 'Bola', category: 'play' },
    { id: 'apple', emoji: '🍎', label: 'Maçã', category: 'eat' },
    { id: 'socks', emoji: '🧦', label: 'Meias', category: 'wear' },
    { id: 'blocks', emoji: '🧱', label: 'Blocos', category: 'play' },
  ]

  shell.content.innerHTML = `
    <div class="activity-heading"><p class="stage-label">Seis objetos</p><h2>Onde este objeto combina?</h2><p>Observe um objeto de cada vez e escolha uma das três categorias.</p></div>
    <div class="sorting-stage">
      <div class="current-object" aria-live="polite"></div>
      <div class="category-grid"></div>
    </div>
    <div class="sorted-summary" aria-live="polite"></div>
    <div class="game-actions"><button class="secondary-button restart-button" type="button">Misturar e recomeçar</button></div>
  `

  const objectView = query<HTMLElement>(shell.content, '.current-object')
  const categoryGrid = query<HTMLElement>(shell.content, '.category-grid')
  const summary = query<HTMLElement>(shell.content, '.sorted-summary')
  let items: SortItem[] = []
  let currentIndex = 0
  const totals: Record<CategoryId, number> = { eat: 0, wear: 0, play: 0 }

  const renderSummary = (): void => {
    summary.innerHTML = categories.map((category) => `
      <span><span aria-hidden="true">${category.emoji}</span> ${category.label}: <strong>${totals[category.id]}</strong></span>
    `).join('')
  }

  const render = (): void => {
    const item = items[currentIndex]
    shell.progress.textContent = `${currentIndex} de ${items.length}`
    objectView.innerHTML = `<span aria-hidden="true">${item.emoji}</span><strong>${item.label}</strong>`
    categoryGrid.innerHTML = categories.map((category) => `
      <button class="category-button" type="button" data-category-id="${category.id}">
        <span aria-hidden="true">${category.emoji}</span><strong>${category.label}</strong><small>${category.description}</small>
      </button>
    `).join('')
    categoryGrid.querySelectorAll<HTMLButtonElement>('[data-category-id]').forEach((button) => {
      button.addEventListener('click', () => chooseCategory(button.dataset.categoryId as CategoryId))
    })
    renderSummary()
  }

  const chooseCategory = (categoryId: CategoryId): void => {
    const item = items[currentIndex]
    if (!item) return
    if (item.category !== categoryId) {
      const category = categories.find((candidate) => candidate.id === categoryId)
      setFeedback(shell.feedback, `${item.label} não pertence a ${category?.label ?? 'essa categoria'}. Observe e tente outra.`, 'try')
      categoryGrid.querySelector<HTMLButtonElement>(`[data-category-id="${categoryId}"]`)?.focus()
      return
    }

    totals[categoryId] += 1
    currentIndex += 1
    renderSummary()
    if (currentIndex < items.length) {
      setFeedback(shell.feedback, `${item.label}: escolha correta! Veja o próximo objeto.`, 'success')
      render()
      categoryGrid.querySelector<HTMLButtonElement>('button')?.focus()
      return
    }

    shell.progress.textContent = `${items.length} de ${items.length}`
    objectView.innerHTML = '<span aria-hidden="true">✅</span><strong>Tudo organizado!</strong>'
    categoryGrid.replaceChildren()
    setFeedback(shell.feedback, 'Todos os objetos estão em seus lugares!', 'success')
    showCompletion(shell.completion, 'Organização completa!', 'Você classificou alimentos, roupas e brinquedos.', [{
      label: 'Jogar novamente', className: 'primary-button', onClick: start,
    }])
  }

  function start(): void {
    items = shuffle(sourceItems)
    currentIndex = 0
    totals.eat = 0
    totals.wear = 0
    totals.play = 0
    hideCompletion(shell.completion)
    setFeedback(shell.feedback, 'Pode começar. Observe o primeiro objeto.')
    render()
  }

  query<HTMLButtonElement>(shell.content, '.restart-button').addEventListener('click', start)
  start()
}

export function mountGame(gameId: GameId, host: HTMLElement, onBack: () => void): void {
  const game = gameDefinitions.find((definition) => definition.id === gameId)
  if (!game) throw new Error(`Jogo desconhecido: ${gameId}`)
  const shell = gameShell(host, game)
  query<HTMLButtonElement>(host, '.back-button').addEventListener('click', onBack)

  switch (gameId) {
    case 'routine': mountRoutine(shell); break
    case 'pairs': mountPairs(shell); break
    case 'sequence': mountSequence(shell); break
    case 'focus': mountFocus(shell); break
    case 'classify': mountClassify(shell); break
  }
}
