# Meu Mundo de Aprendizagem

Plataforma web de jogos educacionais inclusivos. Projeto aprovado em 04/09/2026.

## Estado atual

Fase 0 iniciada: fundação técnica e primeira superfície visual do portal. O login e o primeiro jogo jogável ainda não estão ativados.

## Requisitos

- Node.js 22 ou superior.
- npm 10 ou superior.

## Executar no Fedora

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abra `http://127.0.0.1:4173`. O servidor de desenvolvimento aceita conexões somente do próprio computador.

## Validar

```bash
npm run check
npm run build
```

## Regras de segurança

- Nunca enviar `.env` ou `.env.local` ao GitHub.
- Nunca colocar senhas, chaves privadas ou tokens no código.
- A chave anônima do Supabase não substitui políticas Row Level Security.
- Nenhuma implantação ou alteração de infraestrutura está autorizada nesta fase.

## Documentação

- `docs/DECISOES.md`: decisões oficiais e limites de autorização.
- `docs/FICHA_PEDAGOGICA_001.md`: especificação inicial do primeiro jogo.

