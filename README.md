# Ultra Energy

Landing page estática da Ultra Energy, de Feira de Santana, com atendimento em todo o estado da Bahia. A página apresenta os serviços, explica as etapas do atendimento, responde dúvidas frequentes e leva o visitante ao WhatsApp.

## Executar localmente

Edite os arquivos em `src/` e execute `npm run build` para gerar `dist/` quando for testar ou publicar. Depois, abra `dist/index.html` no navegador. O site usa HTML, CSS e JavaScript sem dependências externas.

```text
src/
├── index.html
├── assets/
│   ├── hero-solar.webp
│   ├── hero-solar-mobile.webp
│   ├── site.js
│   ├── solarz-motion.mp4
│   ├── solarz-poster.webp
│   └── styles.css
└── image/
    ├── favicon.png
    └── logo-ultraenergy-horizontal.webp

dist/  ← gerado por npm run build e incluído no repositório
```

O número e a mensagem inicial do WhatsApp ficam em `src/assets/site.js`.

## Carregamento

A imagem principal usa WebP, com uma versão menor para celular e prioridade alta no HTML. Logo, favicon e capa do vídeo foram reduzidos para os tamanhos de exibição; os arquivos originais maiores continuam disponíveis no histórico/na pasta de assets.

Uma tela de abertura com a marca aguarda as imagens, fontes, os dois players do Instagram, o mapa, a capa e o primeiro quadro do vídeo SolarZ. Essas integrações começam a carregar ao abrir a página. A barra avança por etapas realmente concluídas; falhas também encerram a respectiva etapa. O vídeo de 1,2 MB é pré-carregado, mas só reproduz com uma ação do visitante e mantém a música.

Após 8 segundos, o visitante pode usar “Entrar no site”; após 18 segundos, a página abre automaticamente mesmo se um serviço externo não responder. O mesmo limite protege contra falha no script principal. A animação respeita movimento reduzido. Sem JavaScript, a tela de abertura não aparece e o mapa, os links para os Reels e o MP4 permanecem disponíveis.

## Conteúdo e integrações

- A seção de projetos incorpora dois Reels escolhidos manualmente de [@ultraenergyfsa](https://www.instagram.com/ultraenergyfsa/). Para adicionar outro, duplique um elemento `figure.reel-card` em `src/index.html` e troque a URL no bloco `instagram-media` e nos dois links do card. O site não atualiza esses vídeos automaticamente.
- A seção de localização consulta no Google Maps o endereço informado, Rua Miguel Calmon, 19, Jardim Cruzeiro, Feira de Santana. O botão “Abrir rota” usa o mesmo destino. A precisão do pino para o nº 19 não foi confirmada independentemente.
- A plataforma **Solarz** é citada como ferramenta de monitoramento e relatórios. A seção exibe o vídeo fornecido em uma janela desktop 16:9. O vídeo e sua capa ficam em `src/assets/`; o build os copia para `dist/assets/`.
- A foto dos painéis no hero é uma imagem conceitual. Não apresentar fotos de obras, clientes ou números como reais sem material autorizado.
- A logo horizontal oficial aparece no cabeçalho e no rodapé; o favicon fornecido substitui o ícone provisório. A versão somente texto permanece em `image/` para uso futuro.
O mapa e os links externos precisam de conexão com a internet. A página não inclui formulário, banco de dados ou integração de análise de tráfego.

## Antes de usar como site público

1. Confirmar o número de WhatsApp configurado em `src/assets/site.js` como canal comercial definitivo.
2. Revisar as respostas às dúvidas frequentes e as etapas de atendimento com a equipe.
3. Usar fotos e dados reais somente depois de autorização.
4. Definir domínio, hospedagem e HTTPS.
