// Aqui estou importando a biblioteca 'faker' para gerar dados aleatórios
import faker from 'faker';

describe('Seu Barriga - Testes de Usuário', () => {
  // Criei uma variável para armazenar os dados do usuário na pasta user.json
  let userData;

  before(() => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const password = 'Test@12345';

    // Armazena os dados gerados em 'userData' na pasta user.json
    userData = { firstName, lastName, email, password };

    // Salva os dados do usuário no arquivo 'user.json' para uso posterior nos testes
    cy.task('writeFile', { path: 'cypress/fixtures/user.json', data: JSON.stringify(userData) });
  });

  it('Cenário 1: Cadastrar novo usuário', () => {
    cy.visit("https://seubarriga.wcaquino.me/cadastro");

    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      cy.get('#nome').type(`${user.firstName} ${user.lastName}`);
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Cadastrar").click();
      cy.contains('Usuário inserido com sucesso').should('be.visible');
    });
  });

  it('Cenário 2: Login com senha inválida', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      cy.get('#email').type(user.email);
      cy.get('#senha').type('WrongPassword123');
      cy.contains("Entrar").click();
      cy.contains('Problemas com o login do usuário').should('be.visible');
    });
  });

  it('Cenário 3: Login com senha válida', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains(`Bem vindo, ${user.firstName} ${user.lastName}!`).should('be.visible');
    });
  });

  it('Cenário 4: Adicionar nova conta', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();

      // Gera novos dados para a conta
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();

      // Atualiza 'userData' com os novos dados da conta
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;

      cy.get('#nome').type(`${newFirstName} ${newLastName}`);
      cy.contains('Salvar').click();
      cy.contains('Conta adicionada com sucesso!').should('be.visible');
      cy.task('writeFile', { path: 'cypress/fixtures/user.json', data: JSON.stringify(user) });
      cy.get('tbody > tr > :nth-child(1)').should('contain', `${newFirstName} ${newLastName}`);
    });
  });

  it('Cenário 5: Editar conta recém-cadastrada', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains('Contas').click();
      cy.contains('Listar').click();
      cy.get('.glyphicon-edit').first().click(); 
  
      const editedFirstName = faker.name.firstName();
      const editedLastName = faker.name.lastName();
  
      cy.get('#nome').clear().type(`${editedFirstName} ${editedLastName}`);
      cy.contains('Salvar').click();
      cy.contains('Conta alterada com sucesso!').should('be.visible');
      cy.get('tbody > tr > :nth-child(1)').should('contain', `${editedFirstName} ${editedLastName}`);
    });
  });
  
  it('Cenário 6: Excluir conta', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains('Contas').click();
      cy.contains('Listar').click();
      cy.get('span.glyphicon-remove-circle').click();
      cy.contains('Conta removida com sucesso!').should('be.visible');
    });
  });

  it('Cenário 7: Criar uma nova movimentação', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();
      const accountName = `${newFirstName} ${newLastName}`;
  
      // Atualiza o arquivo user.json com os novos nomes
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;
      cy.writeFile('cypress/fixtures/user.json', user);
  
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();
      cy.get('#nome').type(accountName);
      cy.contains('Salvar').click();
      cy.contains('Criar Movimentação').click();
  
      // Obtém a data atual e formata no padrão brasileiro
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      cy.get('#tipo').should('be.visible').select('DESP'); 
      cy.get('#data_transacao').type(formattedCurrentDate); 
      cy.get('#data_pagamento').type(formattedCurrentDate); 
      cy.get('#descricao').type('Compra de materiais'); 
      cy.get('#interessado').type(accountName);
      cy.get('#valor').type('150.00');
      cy.get('#conta').select(accountName);
      cy.get('#status_pago').click(); 
      cy.contains('Salvar').click();
      cy.contains('Movimentação adicionada com sucesso!').should('be.visible');
    });
  });

  it('Cenário 8: Criar movimentação sem descrição', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();
      const accountName = `${newFirstName} ${newLastName}`;
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;
      cy.writeFile('cypress/fixtures/user.json', user);
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();
      cy.get('#nome').type(accountName);
      cy.contains('Salvar').click();
      cy.contains('Criar Movimentação').click();
  
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      cy.get('#tipo').should('be.visible').select('DESP');
      cy.get('#data_transacao').type(formattedCurrentDate); 
      cy.get('#data_pagamento').type(formattedCurrentDate); 
      cy.get('#interessado').type(accountName); 
      cy.get('#valor').type('150.00');
      cy.get('#conta').select(accountName); 
      cy.get('#status_pago').click(); 
      cy.contains('Salvar').click();
      cy.contains('Descrição é obrigatório').should('be.visible');
    });
  });
  
  it('Cenário 9: Criar movimentação sem valor', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();
      const accountName = `${newFirstName} ${newLastName}`;
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;
      cy.writeFile('cypress/fixtures/user.json', user);
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();
      cy.get('#nome').type(accountName);
      cy.contains('Salvar').click();
      cy.contains('Criar Movimentação').click();
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      cy.get('#tipo').should('be.visible').select('DESP');
      cy.get('#data_transacao').type(formattedCurrentDate); 
      cy.get('#data_pagamento').type(formattedCurrentDate); 
      cy.get('#descricao').type('Compra de materiais'); 
      cy.get('#interessado').type(accountName);
      cy.get('#conta').select(accountName); 
      cy.get('#status_pago').click(); 
  
      cy.contains('Salvar').click();
  
      cy.contains('Valor é obrigatório').should('be.visible');
      cy.contains('Valor deve ser um número').should('be.visible');
    });
  });
  
  it('Cenário 10: Logout da conta', () => {
    cy.visit("https://seubarriga.wcaquino.me/login");
    cy.fixture('user.json').then((user) => {
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      cy.contains("Entrar").click();
      cy.contains(`Bem vindo, ${user.firstName} ${user.lastName}!`).should('be.visible');
      cy.contains('Sair').click();
      cy.url('https://seubarriga.wcaquino.me/logout').should('include', '/logout');
      cy.get('#email').should('be.visible');
      cy.get('#senha').should('be.visible');
    });
  });
});

