# Registro de decisões

## DEC-001 — Aprovação do projeto

- Data: 04/09/2026
- Decisão: Documento Oficial do Projeto v1.0 aprovado pelo CEO.
- Consequência: autorizadas as Fases 0 e 1 somente em ambiente de desenvolvimento.
- Não autorizado: qualquer alteração em produção, Cloudflare, Registro.br, Nginx, droplet, Supabase real ou n8n.

## DEC-002 — Posicionamento inicial

- Produto educacional inclusivo e complementar.
- Não realiza diagnóstico e não substitui profissionais.
- Alegações clínicas ficam proibidas até eventual pesquisa e avaliação regulatória próprias.

## DEC-003 — Arquitetura inicial

- Portal: Vite e TypeScript.
- Jogos iniciais: componentes web em TypeScript, sem dependência de motor em tempo de execução.
- Phaser: opção preservada para jogos futuros que necessitem física, animação avançada ou mapas.
- Autenticação e banco: Supabase preservado somente para eventual cenário corporativo posterior.
- Código oficial: GitHub.
- Desenvolvimento atual: exclusivamente na máquina local de trabalho.
- Lovable: não será utilizado nesta fase; poderá ser reavaliado apenas se trouxer benefício concreto.
- Droplet, Nginx, Cloudflare e portas: fora do ambiente atual e sem qualquer alteração autorizada.

## DEC-004 — Primeiro produto jogável

- Jogo: Organize Meu Dia.
- Público provisório: crianças de 6 a 9 anos.
- Objetivos: sequência lógica, rotina e associação.

## DEC-005 — Repositório e infraestrutura

- O repositório GitHub deverá permanecer privado durante o desenvolvimento.
- A operação atual depende apenas da máquina local e do GitHub privado; Supabase está fora da Fase Free.
- O droplet será avaliado somente na fase de homologação ou implantação.
- Nenhuma porta do droplet ou da máquina local será exposta publicamente nesta fase.

## DEC-006 — Cadastro mínimo e proteção infantil

**Status:** preservada para eventual cenário corporativo; sem efeito na Fase Free.

- O cadastro inicial será exclusivo para responsáveis e demais usuários adultos.
- A criança não terá perfil pessoal identificável no piloto.
- Nome, e-mail, senha e confirmação de maioridade compõem o mínimo necessário.
- Tipo de conta, estado, cidade e data de nascimento não serão coletados no piloto.
- Diagnósticos, laudos e dados de saúde ficam proibidos.
- A estrutura Supabase permanecerá apenas como migração local até aprovação específica para homologação.

## DEC-007 — Protótipo de autenticação desconectado

**Status:** encerrada e preservada no histórico do Git; autenticação removida da Fase Free.

- As telas de entrar, criar conta e recuperar senha podem ser desenvolvidas e testadas localmente.
- Formulários permanecerão sem conexão externa até aprovação da política de privacidade e do ambiente Supabase de homologação.
- Toda simulação deve informar claramente que os dados não foram enviados nem armazenados.

## DEC-008 — Conformidade antes do cadastro real

**Status:** preservada para eventual cenário corporativo; sem efeito na Fase Free.

- Política de Privacidade, Termos, retenção, exclusão e testes de segurança são requisitos de lançamento.
- O Estatuto Digital da Criança e do Adolescente integra o marco obrigatório do produto.
- O aceite das versões dos Termos e da Política será registrado sem criar campos adicionais de perfil.
- Versões aceitas dos documentos jurídicos serão registradas sem coleta adicional de IP pelo banco da aplicação.
- Campos de identificação do controlador, canais, classificação indicativa e revisão jurídica bloqueiam a publicação enquanto estiverem pendentes.

## DEC-009 — Fase Free sem cadastro

- Data: 04/09/2026.
- Decisão: o produto inicial será um portal gratuito e aberto de jogos educacionais com recursos inclusivos.
- O usuário entra no portal, escolhe um jogo e joga sem criar conta.
- Não haverá cadastro, login, Supabase, anúncios, chat, compras, ranking público ou rastreamento comportamental.
- A aplicação não solicitará nome, e-mail, idade, localização, diagnóstico ou dados da criança.
- Preferências estritamente locais não serão enviadas ao servidor nem associadas a uma pessoa.
- A validação será pedagógica e qualitativa, realizada separadamente com adultos, sem identificar crianças.
- As decisões DEC-006, DEC-007 e DEC-008 ficam preservadas como planejamento corporativo futuro,
  mas não integram o produto ativo nesta fase.
- A evolução para contas, banco de dados, modelo comercial ou estrutura empresarial dependerá de
  validação real, nova aprovação do CEO e revisão técnica, jurídica e pedagógica.

## DEC-010 — Biblioteca inicial com cinco jogos

- Data: 08/09/2026.
- Decisão: a primeira versão pública terá cinco jogos próprios e executados no navegador.
- Jogos: Organize Meu Dia, Encontre os Pares, Repita a Sequência, Jardim do Foco e Cada Coisa no Seu Lugar.
- Todos os jogos funcionarão sem cronômetro, anúncios, áudio automático, pontuação competitiva ou punição por erro.
- A interface oferecerá redução de movimento, contraste elevado, ampliação de texto e simplificação visual.
- O posicionamento será educacional e inclusivo para todas as crianças, com atenção especial à previsibilidade,
  clareza e carga sensorial; não haverá promessa de tratamento para TEA, TDAH ou qualquer condição.

## DEC-011 - Sexto jogo de estimulação auditiva

- Data: 09/09/2026.
- Decisão: incluir `Quem Faz Esse Som?` como sexto jogo da Fase Free.
- Posicionamento: atividade educativa de estimulação auditiva e associação som-imagem, sem finalidade
  terapêutica, diagnóstica ou de avaliação clínica.
- Conteúdo inicial: sons ambientais de animais e instrumentos musicais.
- Interação aprovada: quatro alternativas e até três reproduções voluntárias por som.
- Progressão aprovada: sons mais contrastantes primeiro e sons mais próximos depois.
- Sons proibidos: buzinas de carro, caminhão e barco e sons de grito.
- Não haverá música de fundo, áudio automático, vidas, cronômetro, ranking ou armazenamento de desempenho.
- Os arquivos de áudio serão locais e terão origem e licença registradas em `docs/LICENCAS_AUDIO.md`.

## DEC-012 — Biblioteca piloto com dez jogos

- Data: 09/09/2026.
- Decisão: completar a biblioteca do piloto mensal com quatro jogos de foco curricular.
- Público pedagógico de referência: 1º ano e início do 2º ano do Ensino Fundamental, com entrada
  pictórica, instruções curtas e possibilidade de mediação por adulto.
- Jogos incluídos: Palavra em Pedaços, Quantos Ficaram?, Laboratório da Sementinha e Onde e Quando?.
- Áreas incluídas: alfabetização, matemática, ciências, história e geografia.
- O catálogo terá filtros por área, sem recomendar um jogo com base em perfil, condição ou desempenho.
- A progressão ocorrerá por etapas de conteúdo; não haverá pontos, ranking, vidas, cronômetro,
  recompensa acumulativa ou bloqueio de conteúdo.
- O mês será um piloto de usabilidade, acessibilidade e adequação pedagógica. Não constitui pesquisa
  clínica, avaliação diagnóstica nem demonstração de eficácia de aprendizagem.
- O sistema continuará sem cadastro, telemetria ou armazenamento de respostas. Observações serão
  registradas apenas por adultos, sem nome, diagnóstico ou outro dado pessoal da criança.
- Alegações sobre benefícios educacionais futuros dependerão de avaliação metodologicamente adequada,
  nova decisão formal e revisão pedagógica, ética, jurídica e técnica.
