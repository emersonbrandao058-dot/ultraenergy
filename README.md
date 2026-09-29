# Ultra Energy

Landing page estática da Ultra Energy, empresa de energia solar que atende todo o estado da Bahia. A página apresenta os serviços, explica o atendimento, responde dúvidas frequentes e direciona visitantes ao WhatsApp.

## Serviços e atendimento

A Ultra Energy trabalha com projeto, instalação, monitoramento e limpeza de sistemas fotovoltaicos. O foco é residencial e comercial, com atendimento também a clientes industriais e rurais.

O comercial faz o primeiro contato. A engenharia avalia a necessidade e o equipamento. Após o contrato, seguem projeto, homologação junto à concessionária, compra dos equipamentos, instalação e vistoria. Depois da aprovação, pós-vendas e engenharia monitoram o sistema sem custo adicional. A plataforma **Solarz** fornece relatórios de desempenho.

## Executar localmente

Abra `dist/index.html` em um navegador. O projeto usa apenas HTML, CSS e JavaScript; não há instalação de dependências nem etapa de build.

```text
dist/
├── index.html
└── assets/
    ├── hero-solar.png
    ├── site.js
    └── styles.css
```

- `dist/index.html`: conteúdo e estrutura da página.
- `dist/assets/styles.css`: identidade visual e adaptação para celular.
- `dist/assets/site.js`: menu, ano no rodapé e links de WhatsApp.

Para alterar o destino dos botões de contato, edite `WHATSAPP_NUMBER` e `WHATSAPP_MESSAGE` em `dist/assets/site.js`.

## Conteúdo ilustrativo

A imagem do hero foi criada para o conceito visual. A área de projetos é um espaço reservado, e o painel Solarz é uma ilustração sem dados reais. **Fotos de projetos, números e imagens do painel não devem ser apresentados como resultados reais** até que a equipe forneça e autorize o material correspondente.

## Antes de usar como site público

1. Confirmar o número de WhatsApp configurado em `dist/assets/site.js` como canal comercial definitivo.
2. Revisar com a equipe as respostas às dúvidas frequentes e a descrição das etapas de atendimento.
3. Substituir os espaços ilustrativos por fotos e dados reais autorizados, se forem publicados.
4. Definir domínio, hospedagem e HTTPS.

O repositório versiona o site em `dist/` e este README. Arquivos locais de contexto e ferramentas de design ficam fora do Git.
