# Meu Mundo de Aprendizagem

Portal gratuito de jogos educacionais com recursos inclusivos. Projeto aprovado em 04/09/2026.

## Estado atual

Fase Free com biblioteca jogável: portal aberto, sem cadastro, sem anúncios e com seis jogos. A versão pública está disponível em [games.fabricadeaudiobooks.app.br](https://games.fabricadeaudiobooks.app.br).

## Acesso

Os jogos são acessados diretamente pelo catálogo. Não existe login, criação de conta ou coleta de dados por formulário nesta fase.

## Jogos disponíveis

1. **Organize Meu Dia:** sequência de três rotinas cotidianas.
2. **Encontre os Pares:** jogo de memória visual com quatro pares.
3. **Repita a Sequência:** três etapas com sequências de três a cinco símbolos.
4. **Jardim do Foco:** busca visual por figuras-alvo em três etapas.
5. **Cada Coisa no Seu Lugar:** classificação de objetos em comer, vestir e brincar.
6. **Quem Faz Esse Som?:** associação de sons de animais e instrumentos a quatro alternativas visuais.

Todos os jogos permitem:

- receber feedback acolhedor, sem punição;
- tentar novamente e recomeçar;
- jogar com teclado, mouse ou toque;
- concluir a atividade sem cronômetro;
- usar contraste elevado, redução de movimento, texto ampliado e visual simplificado.

Os resultados existem apenas durante a partida e não são gravados ou enviados.

## Infraestrutura desta fase

- Droplet: clone operacional usado para atualização, validação, build e criação de releases.
- GitHub: código-fonte e histórico de versões.
- Supabase: fora da Fase Free; material técnico preservado somente para um cenário corporativo futuro.
- Lovable: não utilizado nesta fase.
- Nginx: entrega a release imutável apontada pelo link `current`.
- Cloudflare: registro do jogo mantido em modo Somente DNS.
- HTTPS: certificado específico com renovação automática validada pelo Certbot.

## Requisitos

- Node.js 22 ou superior.
- npm 10 ou superior.

## Executar em desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:4173`. O servidor de desenvolvimento aceita conexões somente do próprio computador.

## Validar

```bash
npm run check
npm run build
```

Antes de qualquer publicação, execute também:

```bash
npm run check:release
```

Esse comando valida as regras da Fase Free e deve bloquear a publicação enquanto faltar o canal
de contato do aviso de privacidade ou houver recursos de cadastro no código ativo.

## Regras de segurança

- Nunca enviar `.env` ou `.env.local` ao GitHub.
- Nunca colocar senhas, chaves privadas ou tokens no código.
- Não adicionar cadastro, anúncios, rastreadores ou coleta de dados sem nova decisão formal.
- Nenhuma implantação, exposição de porta ou alteração de infraestrutura está autorizada nesta fase.

## Documentação

- `docs/DECISOES.md`: decisões oficiais e limites de autorização.
- `docs/FASE_FREE.md`: escopo oficial atualmente ativo.
- `docs/PLANO_JOGOS_FASE_FREE.md`: especificação dos seis jogos da biblioteca.
- `docs/FICHA_PEDAGOGICA_001.md`: especificação inicial do primeiro jogo.
- `docs/FICHA_PEDAGOGICA_006.md`: especificação do jogo de estimulação auditiva.
- `docs/LICENCAS_AUDIO.md`: autoria, origem, licença e tratamento dos sons.
- `docs/ROTEIRO_VALIDACAO_PEDAGOGICA.md`: avaliação estruturada para professor e psicopedagoga.
- `docs/legal/AVISO_DE_PRIVACIDADE_FREE.md`: aviso curto aplicável à fase atual.
- `docs/legal/CONFORMIDADE_INFANTIL.md`: matriz de proteção infantil.
- `docs/legal/`: também preserva as minutas corporativas para eventual fase futura.
- `supabase/`: estrutura corporativa futura, inativa e nunca aplicada a ambiente externo.
