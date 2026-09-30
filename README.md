# Ultra Energy

Landing page estática da Ultra Energy, de Feira de Santana, com atendimento em todo o estado da Bahia. A página apresenta os serviços, explica as etapas do atendimento, responde dúvidas frequentes e leva o visitante ao WhatsApp.

## Executar localmente

Abra `dist/index.html` no navegador. O site usa HTML, CSS e JavaScript sem dependências ou etapa de build.

```text
dist/
├── index.html
├── assets/
│   ├── hero-solar.png
│   ├── site.js
│   └── styles.css
└── image/
    ├── favicon.png
    └── logo-ultraenergy-horizontal.png
```

O número e a mensagem inicial do WhatsApp ficam em `dist/assets/site.js`.

## Conteúdo e integrações

- A área de projetos leva à aba de Reels de [@ultraenergyfsa](https://www.instagram.com/ultraenergyfsa/reels/). Os vídeos não são copiados para o site; a atualização automática pode ser implementada depois.
- A seção de localização incorpora um mapa do Google Maps de **Feira de Santana**. O mapa representa a cidade, não a sede da empresa; ainda não há endereço confirmado.
- A plataforma **Solarz** é citada como ferramenta de monitoramento e relatórios. A moldura de celular mostra um estado provisório, sem simular a interface ou métricas. Quando houver uma gravação real autorizada, adicione o arquivo em `dist/assets/` e o atributo `src` ao vídeo `.phone-video` em `dist/index.html`; os controles e a reprodução inline já estão preparados.
- A foto dos painéis no hero é uma imagem conceitual. Não apresentar fotos de obras, clientes ou números como reais sem material autorizado.
- A logo horizontal oficial aparece no cabeçalho e no rodapé; o favicon fornecido substitui o ícone provisório. A versão somente texto permanece em `image/` para uso futuro.
O mapa e os links externos precisam de conexão com a internet. A página não inclui formulário, banco de dados ou integração de análise de tráfego.

## Antes de usar como site público

1. Confirmar o número de WhatsApp configurado em `dist/assets/site.js` como canal comercial definitivo.
2. Revisar as respostas às dúvidas frequentes e as etapas de atendimento com a equipe.
3. Usar fotos e dados reais somente depois de autorização.
4. Definir domínio, hospedagem e HTTPS.
