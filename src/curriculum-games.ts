export type CurriculumGameId = 'words' | 'math' | 'science' | 'place-time'

type FeedbackKind = 'neutral' | 'success' | 'try'

type CompletionAction = {
  label: string
  className: string
  onClick: () => void
}

export type CurriculumServices = {
  content: HTMLElement
  feedback: HTMLElement
  progress: HTMLElement
  completion: HTMLElement
  setFeedback: (message: string, kind?: FeedbackKind) => void
  showCompletion: (title: string, copy: string, actions: CompletionAction[]) => void
  hideCompletion: () => void
}

type ChoiceOption = {
  id: string
  visual: string
  label: string
}

type ChoiceRound = {
  prompt: string
  scene: string
  options: ChoiceOption[]
  answer: string
  explanation: string
}

type ChoiceStage = {
  title: string
  description: string
  rounds: ChoiceRound[]
}

function query<T extends Element>(host: ParentNode, selector: string): T {
  const element = host.querySelector<T>(selector)
  if (!element) throw new Error(`Elemento curricular não encontrado: ${selector}`)
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

function fourOptions(target: number): number[] {
  const candidates = [target - 1, target + 1, target - 2, target + 2, target - 3, target + 3, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const unique = candidates.filter((value, index) => value >= 0 && value <= 10 && value !== target && candidates.indexOf(value) === index)
  return shuffle([target, ...unique.slice(0, 3)])
}

function repeatVisual(visual: string, amount: number): string {
  return Array.from({ length: amount }, () => `<span aria-hidden="true">${visual}</span>`).join('')
}

function mountWords(services: CurriculumServices): void {
  type WordRound = { word: string; visual: string; answer: string; missingAt: 'start' | 'end' }
  type WordStage = { title: string; description: string; rounds: WordRound[] }

  const stages: WordStage[] = [
    {
      title: 'Vogais no começo',
      description: 'Observe a figura e escolha a vogal que inicia a palavra.',
      rounds: [
        { word: 'ABELHA', visual: '🐝', answer: 'A', missingAt: 'start' },
        { word: 'ELEFANTE', visual: '🐘', answer: 'E', missingAt: 'start' },
        { word: 'ILHA', visual: '🏝️', answer: 'I', missingAt: 'start' },
        { word: 'OVELHA', visual: '🐑', answer: 'O', missingAt: 'start' },
        { word: 'UVA', visual: '🍇', answer: 'U', missingAt: 'start' },
      ],
    },
    {
      title: 'Sílabas no começo',
      description: 'Complete o início de palavras formadas por sílabas simples.',
      rounds: [
        { word: 'CASA', visual: '🏠', answer: 'CA', missingAt: 'start' },
        { word: 'BOLA', visual: '⚽', answer: 'BO', missingAt: 'start' },
        { word: 'MELÃO', visual: '🍈', answer: 'ME', missingAt: 'start' },
        { word: 'PATO', visual: '🦆', answer: 'PA', missingAt: 'start' },
        { word: 'SAPO', visual: '🐸', answer: 'SA', missingAt: 'start' },
      ],
    },
    {
      title: 'Sílabas no final',
      description: 'Agora escolha a parte que completa o final da palavra.',
      rounds: [
        { word: 'GATO', visual: '🐱', answer: 'TO', missingAt: 'end' },
        { word: 'BOLO', visual: '🍰', answer: 'LO', missingAt: 'end' },
        { word: 'CASA', visual: '🏠', answer: 'SA', missingAt: 'end' },
        { word: 'DADO', visual: '🎲', answer: 'DO', missingAt: 'end' },
        { word: 'LUVA', visual: '🧤', answer: 'VA', missingAt: 'end' },
      ],
    },
  ]

  services.content.innerHTML = `
    <div class="activity-heading">
      <p class="stage-label word-stage-label"></p>
      <h2 class="word-stage-title" tabindex="-1"></h2>
      <p class="word-stage-description"></p>
    </div>
    <section class="word-board" aria-labelledby="word-question">
      <span class="word-picture" role="img"></span>
      <p id="word-question">Qual peça completa esta palavra?</p>
      <p class="word-mask" aria-live="polite"></p>
    </section>
    <div class="curriculum-options word-options" aria-label="Quatro alternativas"></div>
    <div class="game-actions">
      <button class="primary-button word-next" type="button" hidden>Próxima palavra</button>
      <button class="secondary-button word-restart" type="button">Recomeçar etapa</button>
    </div>
  `

  const stageLabel = query<HTMLElement>(services.content, '.word-stage-label')
  const stageTitle = query<HTMLElement>(services.content, '.word-stage-title')
  const stageDescription = query<HTMLElement>(services.content, '.word-stage-description')
  const picture = query<HTMLElement>(services.content, '.word-picture')
  const mask = query<HTMLElement>(services.content, '.word-mask')
  const optionsHost = query<HTMLElement>(services.content, '.word-options')
  const nextButton = query<HTMLButtonElement>(services.content, '.word-next')
  let stageIndex = 0
  let roundIndex = 0
  let rounds: WordRound[] = []
  let answered = false

  const maskedWord = (round: WordRound): string => {
    const blank = '_'.repeat(round.answer.length)
    return round.missingAt === 'start'
      ? `${blank}${round.word.slice(round.answer.length)}`
      : `${round.word.slice(0, -round.answer.length)}${blank}`
  }

  const optionsFor = (round: WordRound): string[] => {
    const stageAnswers = stages[stageIndex].rounds.map((item) => item.answer)
    return shuffle([round.answer, ...shuffle(stageAnswers.filter((answer) => answer !== round.answer)).slice(0, 3)])
  }

  const renderRound = (): void => {
    const round = rounds[roundIndex]
    answered = false
    nextButton.hidden = true
    services.progress.textContent = `Etapa ${stageIndex + 1} · ${roundIndex + 1} de ${rounds.length}`
    picture.textContent = round.visual
    picture.setAttribute('aria-label', `Figura: ${round.word.toLocaleLowerCase('pt-BR')}`)
    mask.textContent = maskedWord(round)
    mask.classList.remove('is-revealed')
    services.setFeedback('Observe a figura e escolha uma das quatro peças.')
    optionsHost.innerHTML = optionsFor(round).map((option) => `
      <button class="curriculum-option word-piece" type="button" data-word-option="${option}" aria-label="Escolher ${option}">
        <strong>${option}</strong>
      </button>
    `).join('')
    optionsHost.querySelectorAll<HTMLButtonElement>('[data-word-option]').forEach((button) => {
      button.addEventListener('click', () => choose(button.dataset.wordOption ?? ''))
    })
    optionsHost.querySelector<HTMLButtonElement>('button')?.focus()
  }

  const finishStage = (): void => {
    const lastStage = stageIndex === stages.length - 1
    services.showCompletion(
      lastStage ? 'Trilha de palavras completa!' : 'Etapa completa!',
      lastStage ? 'Você completou palavras com vogais e sílabas.' : 'Você observou e completou cinco palavras.',
      [{
        label: lastStage ? 'Jogar desde o começo' : 'Próxima etapa',
        className: 'primary-button',
        onClick: () => {
          stageIndex = lastStage ? 0 : stageIndex + 1
          startStage()
        },
      }],
    )
  }

  const choose = (option: string): void => {
    if (answered) return
    const round = rounds[roundIndex]
    if (option !== round.answer) {
      services.setFeedback('Essa peça não completa a palavra. Observe a figura e tente outra.', 'try')
      optionsHost.querySelector<HTMLButtonElement>(`[data-word-option="${option}"]`)?.focus()
      return
    }
    answered = true
    mask.textContent = round.word
    mask.classList.add('is-revealed')
    optionsHost.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = true
      button.classList.toggle('is-correct', button.dataset.wordOption === round.answer)
    })
    services.setFeedback(`${round.word}. A peça ${round.answer} completa a palavra.`, 'success')
    if (roundIndex === rounds.length - 1) {
      finishStage()
      return
    }
    nextButton.hidden = false
    nextButton.focus()
  }

  function startStage(): void {
    const stage = stages[stageIndex]
    rounds = shuffle(stage.rounds)
    roundIndex = 0
    stageLabel.textContent = `Alfabetização · etapa ${stageIndex + 1} de ${stages.length}`
    stageTitle.textContent = stage.title
    stageDescription.textContent = stage.description
    services.hideCompletion()
    renderRound()
  }

  nextButton.addEventListener('click', () => {
    roundIndex += 1
    renderRound()
  })
  query<HTMLButtonElement>(services.content, '.word-restart').addEventListener('click', startStage)
  startStage()
}

function mountMath(services: CurriculumServices): void {
  type CountRound = { mode: 'count' | 'add' | 'subtract'; visual: string; label: string; first: number; second?: number }
  type CompareRound = {
    mode: 'compare'
    firstVisual: string
    firstLabel: string
    first: number
    secondVisual: string
    secondLabel: string
    second: number
    answer: 'first' | 'second' | 'same'
  }
  type MathRound = CountRound | CompareRound
  type MathStage = { title: string; description: string; rounds: MathRound[] }

  const stages: MathStage[] = [
    {
      title: 'Conte os objetos',
      description: 'Conte com calma e escolha o número correspondente.',
      rounds: [
        { mode: 'count', visual: '🍎', label: 'maçãs', first: 2 },
        { mode: 'count', visual: '⭐', label: 'estrelas', first: 3 },
        { mode: 'count', visual: '🐟', label: 'peixes', first: 4 },
        { mode: 'count', visual: '🌼', label: 'flores', first: 5 },
      ],
    },
    {
      title: 'Compare as quantidades',
      description: 'Descubra qual grupo tem mais ou se as quantidades são iguais.',
      rounds: [
        { mode: 'compare', firstVisual: '🍎', firstLabel: 'Maçãs', first: 4, secondVisual: '🍌', secondLabel: 'Bananas', second: 2, answer: 'first' },
        { mode: 'compare', firstVisual: '⚽', firstLabel: 'Bolas', first: 3, secondVisual: '🧸', secondLabel: 'Ursos', second: 5, answer: 'second' },
        { mode: 'compare', firstVisual: '🐠', firstLabel: 'Peixes', first: 4, secondVisual: '🐞', secondLabel: 'Joaninhas', second: 4, answer: 'same' },
        { mode: 'compare', firstVisual: '✏️', firstLabel: 'Lápis', first: 6, secondVisual: '📘', secondLabel: 'Livros', second: 3, answer: 'first' },
      ],
    },
    {
      title: 'Junte as quantidades',
      description: 'Conte os dois grupos e descubra o total.',
      rounds: [
        { mode: 'add', visual: '🍓', label: 'morangos', first: 2, second: 1 },
        { mode: 'add', visual: '🐥', label: 'pintinhos', first: 2, second: 3 },
        { mode: 'add', visual: '🧱', label: 'blocos', first: 4, second: 2 },
        { mode: 'add', visual: '🎈', label: 'balões', first: 5, second: 3 },
      ],
    },
    {
      title: 'Descubra quantos ficaram',
      description: 'Alguns objetos saíram. Conte os que permaneceram.',
      rounds: [
        { mode: 'subtract', visual: '🍪', label: 'biscoitos', first: 4, second: 1 },
        { mode: 'subtract', visual: '🚲', label: 'bicicletas', first: 5, second: 2 },
        { mode: 'subtract', visual: '🐸', label: 'sapos', first: 7, second: 3 },
        { mode: 'subtract', visual: '🟠', label: 'bolinhas', first: 9, second: 4 },
      ],
    },
  ]

  services.content.innerHTML = `
    <div class="activity-heading">
      <p class="stage-label math-stage-label"></p>
      <h2 class="math-stage-title" tabindex="-1"></h2>
      <p class="math-stage-description"></p>
    </div>
    <section class="math-board" aria-labelledby="math-question">
      <div class="math-scene"></div>
      <h3 id="math-question" class="math-question"></h3>
      <p class="math-result" hidden></p>
    </section>
    <div class="curriculum-options math-options" aria-label="Quatro alternativas"></div>
    <div class="game-actions">
      <button class="primary-button math-next" type="button" hidden>Próximo desafio</button>
      <button class="secondary-button math-restart" type="button">Recomeçar etapa</button>
    </div>
  `

  const stageLabel = query<HTMLElement>(services.content, '.math-stage-label')
  const stageTitle = query<HTMLElement>(services.content, '.math-stage-title')
  const stageDescription = query<HTMLElement>(services.content, '.math-stage-description')
  const scene = query<HTMLElement>(services.content, '.math-scene')
  const question = query<HTMLElement>(services.content, '.math-question')
  const result = query<HTMLElement>(services.content, '.math-result')
  const optionsHost = query<HTMLElement>(services.content, '.math-options')
  const nextButton = query<HTMLButtonElement>(services.content, '.math-next')
  let stageIndex = 0
  let roundIndex = 0
  let rounds: MathRound[] = []
  let answered = false

  const numericAnswer = (round: CountRound): number => round.mode === 'subtract'
    ? round.first - (round.second ?? 0)
    : round.first + (round.second ?? 0)

  const renderRound = (): void => {
    const round = rounds[roundIndex]
    answered = false
    nextButton.hidden = true
    result.hidden = true
    services.progress.textContent = `Etapa ${stageIndex + 1} · ${roundIndex + 1} de ${rounds.length}`
    services.setFeedback('Observe as quantidades e escolha uma resposta.')

    if (round.mode === 'compare') {
      scene.innerHTML = `
        <div class="math-set" aria-label="${round.first} ${round.firstLabel.toLowerCase()}">${repeatVisual(round.firstVisual, round.first)}<small>${round.firstLabel}</small></div>
        <span class="math-symbol math-versus" aria-hidden="true">e</span>
        <div class="math-set" aria-label="${round.second} ${round.secondLabel.toLowerCase()}">${repeatVisual(round.secondVisual, round.second)}<small>${round.secondLabel}</small></div>
      `
      question.textContent = 'Qual grupo tem mais?'
      const compareOptions = shuffle([
        { id: 'first', label: round.firstLabel, visual: round.firstVisual },
        { id: 'second', label: round.secondLabel, visual: round.secondVisual },
        { id: 'same', label: 'Mesma quantidade', visual: '=' },
        { id: 'empty', label: 'Os dois estão vazios', visual: '0' },
      ])
      optionsHost.innerHTML = compareOptions.map((option) => `
        <button class="curriculum-option math-choice" type="button" data-math-option="${option.id}">
          <span aria-hidden="true">${option.visual}</span><strong>${option.label}</strong>
        </button>
      `).join('')
    } else {
      const answer = numericAnswer(round)
      const second = round.second ?? 0
      if (round.mode === 'count') {
        scene.innerHTML = `<div class="math-set is-single" aria-label="Conjunto de ${round.label}">${repeatVisual(round.visual, round.first)}<small>${round.label}</small></div>`
        question.textContent = `Quantos ${round.label} há?`
      } else {
        const operator = round.mode === 'add' ? '+' : '−'
        scene.innerHTML = `
          <div class="math-set" aria-label="Primeiro grupo com ${round.first} ${round.label}">${repeatVisual(round.visual, round.first)}</div>
          <span class="math-symbol" aria-hidden="true">${operator}</span>
          <div class="math-set${round.mode === 'subtract' ? ' is-leaving' : ''}" aria-label="${second} ${round.label} ${round.mode === 'add' ? 'chegaram' : 'saíram'}">${repeatVisual(round.visual, second)}</div>
        `
        question.textContent = round.mode === 'add' ? 'Quantos há ao todo?' : 'Quantos ficaram?'
      }
      optionsHost.innerHTML = fourOptions(answer).map((option) => `
        <button class="curriculum-option number-choice" type="button" data-math-option="${option}">
          <strong>${option}</strong>
        </button>
      `).join('')
    }

    optionsHost.querySelectorAll<HTMLButtonElement>('[data-math-option]').forEach((button) => {
      button.addEventListener('click', () => choose(button.dataset.mathOption ?? ''))
    })
    optionsHost.querySelector<HTMLButtonElement>('button')?.focus()
  }

  const finishStage = (): void => {
    const lastStage = stageIndex === stages.length - 1
    services.showCompletion(
      lastStage ? 'Trilha dos números completa!' : 'Etapa completa!',
      lastStage ? 'Você contou, comparou, juntou e retirou quantidades.' : 'Você resolveu quatro desafios desta etapa.',
      [{
        label: lastStage ? 'Jogar desde o começo' : 'Próxima etapa',
        className: 'primary-button',
        onClick: () => {
          stageIndex = lastStage ? 0 : stageIndex + 1
          startStage()
        },
      }],
    )
  }

  const choose = (option: string): void => {
    if (answered) return
    const round = rounds[roundIndex]
    const expected = round.mode === 'compare' ? round.answer : String(numericAnswer(round))
    if (option !== expected) {
      services.setFeedback('Vamos contar ou comparar novamente. Você pode tentar outra resposta.', 'try')
      optionsHost.querySelector<HTMLButtonElement>(`[data-math-option="${option}"]`)?.focus()
      return
    }

    answered = true
    optionsHost.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = true
      button.classList.toggle('is-correct', button.dataset.mathOption === expected)
    })
    if (round.mode === 'compare') {
      const message = expected === 'same'
        ? `Os dois grupos têm ${round.first} elementos.`
        : `${expected === 'first' ? round.firstLabel : round.secondLabel} formam o grupo com mais elementos.`
      result.textContent = message
    } else {
      const answer = numericAnswer(round)
      const operator = round.mode === 'count' ? '=' : round.mode === 'add' ? '+' : '−'
      result.textContent = round.mode === 'count'
        ? `${round.first} ${round.label}`
        : `${round.first} ${operator} ${round.second ?? 0} = ${answer}`
    }
    result.hidden = false
    services.setFeedback(result.textContent ?? 'Resposta correta.', 'success')
    if (roundIndex === rounds.length - 1) {
      finishStage()
      return
    }
    nextButton.hidden = false
    nextButton.focus()
  }

  function startStage(): void {
    const stage = stages[stageIndex]
    rounds = shuffle(stage.rounds)
    roundIndex = 0
    stageLabel.textContent = `Matemática · etapa ${stageIndex + 1} de ${stages.length}`
    stageTitle.textContent = stage.title
    stageDescription.textContent = stage.description
    services.hideCompletion()
    renderRound()
  }

  nextButton.addEventListener('click', () => {
    roundIndex += 1
    renderRound()
  })
  query<HTMLButtonElement>(services.content, '.math-restart').addEventListener('click', startStage)
  startStage()
}

function mountChoiceJourney(
  services: CurriculumServices,
  areaLabel: string,
  finalTitle: string,
  finalCopy: string,
  stages: ChoiceStage[],
): void {
  services.content.innerHTML = `
    <div class="activity-heading">
      <p class="stage-label choice-stage-label"></p>
      <h2 class="choice-stage-title" tabindex="-1"></h2>
      <p class="choice-stage-description"></p>
    </div>
    <section class="choice-board" aria-labelledby="choice-question">
      <div class="choice-scene"></div>
      <h3 id="choice-question" class="choice-question"></h3>
      <p class="choice-explanation" hidden></p>
    </section>
    <div class="curriculum-options choice-options" aria-label="Quatro alternativas"></div>
    <div class="game-actions">
      <button class="primary-button choice-next" type="button" hidden>Próxima descoberta</button>
      <button class="secondary-button choice-restart" type="button">Recomeçar etapa</button>
    </div>
  `

  const stageLabel = query<HTMLElement>(services.content, '.choice-stage-label')
  const stageTitle = query<HTMLElement>(services.content, '.choice-stage-title')
  const stageDescription = query<HTMLElement>(services.content, '.choice-stage-description')
  const scene = query<HTMLElement>(services.content, '.choice-scene')
  const question = query<HTMLElement>(services.content, '.choice-question')
  const explanation = query<HTMLElement>(services.content, '.choice-explanation')
  const optionsHost = query<HTMLElement>(services.content, '.choice-options')
  const nextButton = query<HTMLButtonElement>(services.content, '.choice-next')
  let stageIndex = 0
  let roundIndex = 0
  let rounds: ChoiceRound[] = []
  let answered = false

  const renderRound = (): void => {
    const round = rounds[roundIndex]
    answered = false
    nextButton.hidden = true
    explanation.hidden = true
    scene.innerHTML = round.scene
    question.textContent = round.prompt
    services.progress.textContent = `Etapa ${stageIndex + 1} · ${roundIndex + 1} de ${rounds.length}`
    services.setFeedback('Observe a situação e escolha uma possibilidade.')
    optionsHost.innerHTML = shuffle(round.options).map((option) => `
      <button class="curriculum-option discovery-choice" type="button" data-choice-option="${option.id}">
        <span aria-hidden="true">${option.visual}</span><strong>${option.label}</strong>
      </button>
    `).join('')
    optionsHost.querySelectorAll<HTMLButtonElement>('[data-choice-option]').forEach((button) => {
      button.addEventListener('click', () => choose(button.dataset.choiceOption ?? ''))
    })
    optionsHost.querySelector<HTMLButtonElement>('button')?.focus()
  }

  const finishStage = (): void => {
    const lastStage = stageIndex === stages.length - 1
    services.showCompletion(
      lastStage ? finalTitle : 'Etapa completa!',
      lastStage ? finalCopy : `Você concluiu: ${stages[stageIndex].title.toLowerCase()}.`,
      [{
        label: lastStage ? 'Explorar desde o começo' : 'Próxima etapa',
        className: 'primary-button',
        onClick: () => {
          stageIndex = lastStage ? 0 : stageIndex + 1
          startStage()
        },
      }],
    )
  }

  const choose = (option: string): void => {
    if (answered) return
    const round = rounds[roundIndex]
    if (option !== round.answer) {
      services.setFeedback('Essa possibilidade não combina com a observação. Observe as pistas e tente outra.', 'try')
      optionsHost.querySelector<HTMLButtonElement>(`[data-choice-option="${option}"]`)?.focus()
      return
    }
    answered = true
    optionsHost.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = true
      button.classList.toggle('is-correct', button.dataset.choiceOption === round.answer)
    })
    explanation.textContent = round.explanation
    explanation.hidden = false
    services.setFeedback(round.explanation, 'success')
    if (roundIndex === rounds.length - 1) {
      finishStage()
      return
    }
    nextButton.hidden = false
    nextButton.focus()
  }

  function startStage(): void {
    const stage = stages[stageIndex]
    rounds = shuffle(stage.rounds)
    roundIndex = 0
    stageLabel.textContent = `${areaLabel} · etapa ${stageIndex + 1} de ${stages.length}`
    stageTitle.textContent = stage.title
    stageDescription.textContent = stage.description
    services.hideCompletion()
    renderRound()
  }

  nextButton.addEventListener('click', () => {
    roundIndex += 1
    renderRound()
  })
  query<HTMLButtonElement>(services.content, '.choice-restart').addEventListener('click', startStage)
  startStage()
}

function mountScience(services: CurriculumServices): void {
  const plantParts: ChoiceOption[] = [
    { id: 'root', visual: '🌱', label: 'Raiz' },
    { id: 'stem', visual: '🪴', label: 'Caule' },
    { id: 'leaf', visual: '🍃', label: 'Folha' },
    { id: 'flower', visual: '🌼', label: 'Flor' },
  ]
  const growthOptions: ChoiceOption[] = [
    { id: 'seed', visual: '🫘', label: 'Semente' },
    { id: 'sprout', visual: '🌱', label: 'Broto' },
    { id: 'plant', visual: '🪴', label: 'Planta jovem' },
    { id: 'flower', visual: '🌻', label: 'Planta com flor' },
  ]

  const stages: ChoiceStage[] = [
    {
      title: 'Partes de uma planta',
      description: 'Associe cada parte a uma função comum nas plantas.',
      rounds: [
        { prompt: 'Qual parte geralmente absorve água do solo?', scene: '<div class="science-scene"><span>🌱</span><p>Observe da parte que fica no solo até as folhas.</p></div>', options: plantParts, answer: 'root', explanation: 'A raiz geralmente fixa a planta e absorve água e sais minerais do solo.' },
        { prompt: 'Qual parte sustenta folhas e flores?', scene: '<div class="science-scene"><span>🪴</span><p>Ela liga a raiz às partes mais altas.</p></div>', options: plantParts, answer: 'stem', explanation: 'O caule ajuda a sustentar a planta e participa do transporte de substâncias.' },
        { prompt: 'Qual parte recebe luz e ajuda a planta a produzir alimento?', scene: '<div class="science-scene"><span>☀️🍃</span><p>A luz alcança principalmente esta parte.</p></div>', options: plantParts, answer: 'leaf', explanation: 'As folhas recebem luz e participam da produção do alimento da planta.' },
        { prompt: 'Qual parte pode participar da formação de frutos e sementes?', scene: '<div class="science-scene"><span>🌼</span><p>Nem todas as plantas apresentam flores visíveis.</p></div>', options: plantParts, answer: 'flower', explanation: 'Nas plantas com flores, a flor participa da reprodução e pode dar origem a frutos e sementes.' },
      ],
    },
    {
      title: 'Cuidados e condições',
      description: 'Observe situações simples e escolha o cuidado mais adequado.',
      rounds: [
        {
          prompt: 'Qual vaso reúne duas condições importantes para muitas plantas?',
          scene: '<div class="science-scene"><span>🪴🔍</span><p>Compare água e luz em quantidades adequadas.</p></div>',
          options: [
            { id: 'balanced', visual: '💧☀️', label: 'Água e luz adequadas' },
            { id: 'dry', visual: '🏜️☀️', label: 'Sem água' },
            { id: 'dark', visual: '💧🌑', label: 'Sem luz' },
            { id: 'flooded', visual: '🌊🪴', label: 'Solo sempre encharcado' },
          ],
          answer: 'balanced',
          explanation: 'Em geral, plantas precisam de água e luz em quantidades adequadas. As necessidades variam entre espécies.',
        },
        {
          prompt: 'O solo está seco. Qual ação pode ajudar?',
          scene: '<div class="science-scene"><span>🪴🏜️</span><p>A planta precisa de cuidado, sem exagero.</p></div>',
          options: [
            { id: 'water', visual: '💧', label: 'Regar com cuidado' },
            { id: 'paint', visual: '🎨', label: 'Pintar as folhas' },
            { id: 'box', visual: '📦', label: 'Fechar em uma caixa' },
            { id: 'pull', visual: '✂️', label: 'Retirar as folhas' },
          ],
          answer: 'water',
          explanation: 'Quando o solo está seco, regar na quantidade adequada pode repor a água de que a planta necessita.',
        },
        {
          prompt: 'A planta ficou em um local sem luz. Qual mudança pode ajudar?',
          scene: '<div class="science-scene"><span>🌑🪴</span><p>Procure uma condição mais apropriada.</p></div>',
          options: [
            { id: 'light', visual: '☀️', label: 'Levar para luz adequada' },
            { id: 'freezer', visual: '🧊', label: 'Colocar no congelador' },
            { id: 'cover', visual: '🧥', label: 'Cobrir todas as folhas' },
            { id: 'toy', visual: '🧸', label: 'Dar um brinquedo' },
          ],
          answer: 'light',
          explanation: 'A luz adequada participa da produção de alimento da planta. A intensidade necessária varia entre espécies.',
        },
        {
          prompt: 'Como podemos descobrir se o solo ainda está úmido?',
          scene: '<div class="science-scene"><span>🪴🤔</span><p>Primeiro observe; depois decida se é preciso regar.</p></div>',
          options: [
            { id: 'observe', visual: '👀', label: 'Observar e tocar o solo com cuidado' },
            { id: 'always', visual: '🌊', label: 'Colocar muita água sempre' },
            { id: 'guess', visual: '🙈', label: 'Não observar' },
            { id: 'paint-soil', visual: '🖌️', label: 'Pintar o solo' },
          ],
          answer: 'observe',
          explanation: 'Observar o solo ajuda a tomar uma decisão. Um adulto pode orientar o cuidado adequado para cada planta.',
        },
      ],
    },
    {
      title: 'Uma sequência de crescimento',
      description: 'Acompanhe uma possibilidade de desenvolvimento de uma planta com flor.',
      rounds: [
        { prompt: 'Nesta sequência, o que aparece depois da semente germinar?', scene: '<div class="growth-scene"><span>🫘</span><strong>→</strong><span>?</span></div>', options: growthOptions, answer: 'sprout', explanation: 'Com condições adequadas, a semente pode germinar e formar um broto.' },
        { prompt: 'O broto cresceu. Qual etapa aparece em seguida nesta sequência?', scene: '<div class="growth-scene"><span>🌱</span><strong>→</strong><span>?</span></div>', options: growthOptions, answer: 'plant', explanation: 'O broto pode crescer e formar uma planta jovem com mais folhas.' },
        { prompt: 'Nesta planta, o que aparece depois de seu crescimento?', scene: '<div class="growth-scene"><span>🪴</span><strong>→</strong><span>?</span></div>', options: growthOptions, answer: 'flower', explanation: 'Nesta sequência, a planta adulta forma flores. Cada espécie possui seu próprio ciclo.' },
        { prompt: 'Qual é o começo desta sequência?', scene: '<div class="growth-scene"><span>?</span><strong>→</strong><span>🌱</span><strong>→</strong><span>🪴</span></div>', options: growthOptions, answer: 'seed', explanation: 'A sequência representada começa com a semente e continua com germinação e crescimento.' },
      ],
    },
  ]

  mountChoiceJourney(services, 'Ciências', 'Exploração científica completa!', 'Você observou partes, condições e uma sequência de crescimento das plantas.', stages)
}

function mountPlaceTime(services: CurriculumServices): void {
  const places: ChoiceOption[] = [
    { id: 'school', visual: '🏫', label: 'Escola' },
    { id: 'square', visual: '🌳', label: 'Praça' },
    { id: 'market', visual: '🛒', label: 'Mercado' },
    { id: 'health', visual: '🏥', label: 'Unidade de saúde' },
  ]
  const mapPlaces: ChoiceOption[] = [
    { id: 'home', visual: '🏠', label: 'Casa' },
    { id: 'school', visual: '🏫', label: 'Escola' },
    { id: 'square', visual: '🌳', label: 'Praça' },
    { id: 'market', visual: '🛒', label: 'Mercado' },
  ]

  const stages: ChoiceStage[] = [
    {
      title: 'Lugares da comunidade',
      description: 'Relacione atividades a lugares possíveis da comunidade.',
      rounds: [
        { prompt: 'Em qual lugar geralmente encontramos salas de aula?', scene: '<div class="community-scene"><span>📚✏️</span><p>Um lugar para aprender com outras pessoas.</p></div>', options: places, answer: 'school', explanation: 'A escola é um dos lugares da comunidade destinados à aprendizagem e à convivência.' },
        { prompt: 'Qual lugar pode ser usado para brincar e conviver ao ar livre?', scene: '<div class="community-scene"><span>🛝⚽</span><p>Um espaço público de lazer.</p></div>', options: places, answer: 'square', explanation: 'Praças e parques podem ser usados para lazer, encontros e manifestações da comunidade.' },
        { prompt: 'Em qual lugar podemos comprar alimentos e outros produtos?', scene: '<div class="community-scene"><span>🍎🥖</span><p>Um exemplo de atividade comercial.</p></div>', options: places, answer: 'market', explanation: 'O mercado é um lugar de trabalho e comércio onde encontramos diferentes produtos.' },
        { prompt: 'Qual lugar oferece cuidados básicos de saúde à comunidade?', scene: '<div class="community-scene"><span>🩺</span><p>Um serviço que pode existir no bairro ou na cidade.</p></div>', options: places, answer: 'health', explanation: 'Uma unidade de saúde é um dos espaços que podem oferecer cuidados à comunidade.' },
      ],
    },
    {
      title: 'Leia o mapa simples',
      description: 'Use esquerda, direita, acima e entre para localizar pontos de referência.',
      rounds: [
        { prompt: 'Qual lugar está entre a casa e a escola?', scene: '<div class="map-row" aria-label="Casa, praça e escola"><span>🏠<small>Casa</small></span><span>🌳<small>Praça</small></span><span>🏫<small>Escola</small></span></div>', options: mapPlaces, answer: 'square', explanation: 'A praça está entre a casa e a escola neste mapa.' },
        { prompt: 'Qual lugar está à direita da escola?', scene: '<div class="map-row" aria-label="Mercado, escola e casa"><span>🛒<small>Mercado</small></span><span>🏫<small>Escola</small></span><span>🏠<small>Casa</small></span></div>', options: mapPlaces, answer: 'home', explanation: 'A casa está à direita da escola neste mapa.' },
        { prompt: 'Qual lugar está à esquerda da casa?', scene: '<div class="map-row" aria-label="Praça, casa e mercado"><span>🌳<small>Praça</small></span><span>🏠<small>Casa</small></span><span>🛒<small>Mercado</small></span></div>', options: mapPlaces, answer: 'square', explanation: 'A praça está à esquerda da casa neste mapa.' },
        { prompt: 'Qual lugar está acima da casa?', scene: '<div class="map-mini-grid" aria-label="Escola e praça acima; casa e mercado abaixo"><span>🏫<small>Escola</small></span><span>🌳<small>Praça</small></span><span>🏠<small>Casa</small></span><span>🛒<small>Mercado</small></span></div>', options: mapPlaces, answer: 'school', explanation: 'A escola está acima da casa neste mapa. A posição depende do ponto de referência indicado.' },
      ],
    },
    {
      title: 'Mudanças e permanências',
      description: 'Compare exemplos de outros tempos e do presente. Formas antigas e atuais podem coexistir.',
      rounds: [
        {
          prompt: 'O que mudou principalmente nas formas de enviar uma mensagem?',
          scene: '<div class="time-compare"><div><small>Há mais tempo</small><span>✉️</span><strong>Carta em papel</strong></div><div><small>Hoje também encontramos</small><span>📱</span><strong>Mensagem digital</strong></div></div>',
          options: [
            { id: 'resource', visual: '✉️📱', label: 'O recurso usado' },
            { id: 'people', visual: '👥', label: 'A existência de pessoas' },
            { id: 'day', visual: '☀️', label: 'A duração do dia' },
            { id: 'water', visual: '💧', label: 'A água' },
          ],
          answer: 'resource',
          explanation: 'As pessoas continuam se comunicando, mas os recursos usados para enviar mensagens podem mudar.',
        },
        {
          prompt: 'O que permaneceu nestas formas de guardar uma lembrança?',
          scene: '<div class="time-compare"><div><small>Há mais tempo</small><span>🖼️</span><strong>Foto impressa</strong></div><div><small>Hoje também encontramos</small><span>📱</span><strong>Foto digital</strong></div></div>',
          options: [
            { id: 'memory', visual: '💭', label: 'A possibilidade de registrar lembranças' },
            { id: 'paper-only', visual: '📄', label: 'Somente o papel' },
            { id: 'same-device', visual: '📷', label: 'O mesmo aparelho' },
            { id: 'no-image', visual: '🚫', label: 'A ausência de imagem' },
          ],
          answer: 'memory',
          explanation: 'Fotos impressas e digitais podem registrar lembranças, embora seus suportes sejam diferentes.',
        },
        {
          prompt: 'O que pode permanecer mesmo quando o material do brinquedo muda?',
          scene: '<div class="time-compare"><div><small>Um exemplo antigo</small><span>🌀</span><strong>Pião de madeira</strong></div><div><small>Outro exemplo</small><span>🌀</span><strong>Pião de outro material</strong></div></div>',
          options: [
            { id: 'play', visual: '🌀', label: 'A brincadeira de girar o pião' },
            { id: 'material', visual: '🪵', label: 'O mesmo material' },
            { id: 'size', visual: '📏', label: 'O mesmo tamanho' },
            { id: 'owner', visual: '👤', label: 'A mesma pessoa' },
          ],
          answer: 'play',
          explanation: 'Materiais e formatos podem mudar, enquanto uma brincadeira continua sendo praticada.',
        },
        {
          prompt: 'O que pode permanecer quando os recursos da escola mudam?',
          scene: '<div class="time-compare"><div><small>Um recurso</small><span>🟩</span><strong>Quadro e giz</strong></div><div><small>Outro recurso</small><span>🖥️</span><strong>Tela digital</strong></div></div>',
          options: [
            { id: 'learning', visual: '📚', label: 'Aprender e compartilhar conhecimentos' },
            { id: 'tool', visual: '🖥️', label: 'Usar sempre a mesma ferramenta' },
            { id: 'building', visual: '🏢', label: 'Ter prédios iguais' },
            { id: 'uniform', visual: '👕', label: 'Vestir a mesma roupa' },
          ],
          answer: 'learning',
          explanation: 'Os recursos podem variar entre escolas e épocas, mas aprender e conviver continuam sendo finalidades importantes.',
        },
      ],
    },
  ]

  mountChoiceJourney(services, 'História e Geografia', 'Viagem por lugares e tempos completa!', 'Você explorou a comunidade, leu mapas simples e comparou mudanças e permanências.', stages)
}

export function mountCurriculumGame(gameId: CurriculumGameId, services: CurriculumServices): void {
  switch (gameId) {
    case 'words': mountWords(services); break
    case 'math': mountMath(services); break
    case 'science': mountScience(services); break
    case 'place-time': mountPlaceTime(services); break
  }
}
