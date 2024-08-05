// Importa a função defineConfig do módulo Cypress
const { defineConfig } = require('cypress');

// Importa o módulo fs, que é usado para operações de sistema de arquivos
const fs = require('fs');

// Exporta a configuração para o Cypress
module.exports = defineConfig({
  // Define a configuração para os testes end-to-end (e2e)
  e2e: {
    // Função para configurar eventos e tarefas do Node.js
    setupNodeEvents(on, config) {
      // Define uma tarefa personalizada chamada 'writeFile'
      on('task', {
        // Função que escreve dados em um arquivo
        writeFile({ path, data }) {
          // Retorna uma nova Promise para lidar com operações assíncronas
          return new Promise((resolve, reject) => {
            // Usa o módulo fs para escrever dados no arquivo
            fs.writeFile(path, data, 'utf8', (err) => {
              // Se houver um erro ao escrever no arquivo, rejeita a Promise
              if (err) {
                return reject(err);
              }
              // Se não houver erro, resolve a Promise com sucesso
              resolve(null);
            });
          });
        },
      });
    },
    // Define o padrão para os arquivos de especificação dos testes
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // Define o arquivo de suporte para os testes
    supportFile: 'cypress/support/e2e.js',
  },
});
