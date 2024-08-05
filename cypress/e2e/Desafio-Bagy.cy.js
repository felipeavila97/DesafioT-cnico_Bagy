// Aqui estou importando a biblioteca 'faker' para gerar dados aleatórios
import faker from 'faker';

describe('Seu Barriga - Testes de Usuário', () => {
  // Criei uma variável para armazenar os dados do usuário na pasta user.json
  let userData;

  // Esse comando executa antes de todos os testes
  before(() => {
    // Gera um nome e sobrenome aleatórios
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    // Cria um e-mail aleatório usando o nome e sobrenome gerados
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    // Define uma senha padrão
    const password = 'Test@12345';

    // Armazena os dados gerados em 'userData' na pasta user.json
    userData = { firstName, lastName, email, password };

    // Salva os dados do usuário no arquivo 'user.json' para uso posterior nos testes
    cy.task('writeFile', { path: 'cypress/fixtures/user.json', data: JSON.stringify(userData) });
  });

  it('Cenário 1: Cadastrar novo usuário', () => {
    // Acessa a página de cadastro
    cy.visit("https://seubarriga.wcaquino.me/cadastro");

    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de cadastro com os dados do usuário
      cy.get('#nome').type(`${user.firstName} ${user.lastName}`);
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para cadastrar o usuário
      cy.contains("Cadastrar").click();

      // Verifica se a mensagem de sucesso do cadastro é exibida
      cy.contains('Usuário inserido com sucesso').should('be.visible');
    });
  });

  it('Cenário 2: Login com senha inválida', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");

    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de login com a senha inválida
      cy.get('#email').type(user.email);
      cy.get('#senha').type('WrongPassword123');
      // Clica no botão para tentar fazer login
      cy.contains("Entrar").click();

      // Verifica se a mensagem de erro do login é exibida
      cy.contains('Problemas com o login do usuário').should('be.visible');
    });
  });

  it('Cenário 3: Login com senha válida', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");

    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de login com a senha correta
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();

      // Verifica se a mensagem de boas-vindas é exibida após o login
      cy.contains(`Bem vindo, ${user.firstName} ${user.lastName}!`).should('be.visible');
    });
  });

  it('Cenário 4: Adicionar nova conta', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");

    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();

      // Acessa a seção de contas
      cy.contains('Contas').click();
      // Clica no botão para adicionar uma nova conta
      cy.contains('Adicionar').click();

      // Gera novos dados para a conta
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();

      // Atualiza 'userData' com os novos dados da conta
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;

      // Preenche o formulário de adição de conta
      cy.get('#nome').type(`${newFirstName} ${newLastName}`);
      // Clica no botão para salvar a nova conta
      cy.contains('Salvar').click();

      // Verifica se a mensagem de sucesso da adição da conta é exibida
      cy.contains('Conta adicionada com sucesso!').should('be.visible');

      // Salva os novos dados da conta no arquivo 'user.json'
      cy.task('writeFile', { path: 'cypress/fixtures/user.json', data: JSON.stringify(user) });

      // Verifica se a nova conta foi adicionada na lista
      cy.get('tbody > tr > :nth-child(1)').should('contain', `${newFirstName} ${newLastName}`);
    });
  });

  it('Cenário 5: Editar conta recém-cadastrada', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");
  
    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();
  
      // Acessa a seção de contas e lista as contas existentes
      cy.contains('Contas').click();
      cy.contains('Listar').click();
  
      // Clica no ícone de edição da primeira conta na lista
      cy.get('.glyphicon-edit').first().click(); // Ajuste o href se necessário
  
      // Gera novos dados para a conta
      const editedFirstName = faker.name.firstName();
      const editedLastName = faker.name.lastName();
  
      // Atualiza os dados da conta no formulário
      cy.get('#nome').clear().type(`${editedFirstName} ${editedLastName}`);
      // Clica no botão para salvar as alterações
      cy.contains('Salvar').click();
  
      // Verifica se a mensagem de sucesso da alteração da conta é exibida
      cy.contains('Conta alterada com sucesso!').should('be.visible');
  
      // Verifica se a conta foi atualizada na lista de contas
      cy.get('tbody > tr > :nth-child(1)').should('contain', `${editedFirstName} ${editedLastName}`);
    });
  });
  
  it('Cenário 6: Excluir conta', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");

    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();

      // Acessa a seção de contas e lista as contas existentes
      cy.contains('Contas').click();
      cy.contains('Listar').click();

      // Clica no ícone de exclusão da primeira conta na lista
      cy.get('span.glyphicon-remove-circle').click();

      // Verifica se a mensagem de sucesso da remoção da conta é exibida
      cy.contains('Conta removida com sucesso!').should('be.visible');
    });
  });

  it('Cenário 7: Criar uma nova movimentação', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");
  
    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Gera novos nomes para a conta
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();
      const accountName = `${newFirstName} ${newLastName}`;
  
      // Atualiza o arquivo user.json com os novos nomes
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;
      cy.writeFile('cypress/fixtures/user.json', user);
  
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();
  
      // Acessa a seção de contas e adiciona uma nova conta
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();
      cy.get('#nome').type(accountName);
      // Clica no botão para salvar a nova conta
      cy.contains('Salvar').click();
  
      // Acessa a seção para criar uma nova movimentação
      cy.contains('Criar Movimentação').click();
  
      // Obtém a data atual e formata no padrão brasileiro
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      // Preenche o formulário de movimentação
      cy.get('#tipo').should('be.visible').select('DESP'); // Seleciona o tipo de movimentação
      cy.get('#data_transacao').type(formattedCurrentDate); // Data da movimentação
      cy.get('#data_pagamento').type(formattedCurrentDate); // Data do pagamento
      cy.get('#descricao').type('Compra de materiais'); // Descrição da movimentação
      cy.get('#interessado').type(accountName); // Conta interessada
      cy.get('#valor').type('150.00'); // Valor da movimentação
      cy.get('#conta').select(accountName); // Seleciona a conta criada
  
      // Marca a situação como 'Pago'
      cy.get('#status_pago').click(); // Seleciona Pago
  
      // Clica no botão para salvar a movimentação
      cy.contains('Salvar').click();
  
      // Verifica se a mensagem de sucesso da movimentação é exibida
      cy.contains('Movimentação adicionada com sucesso!').should('be.visible');
    });
  });

  it('Cenário 8: Criar movimentação sem descrição', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");
  
    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Gera novos nomes para a conta
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();
      const accountName = `${newFirstName} ${newLastName}`;
  
      // Atualiza o arquivo user.json com os novos nomes
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;
      cy.writeFile('cypress/fixtures/user.json', user);
  
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();
  
      // Acessa a seção de contas e adiciona uma nova conta
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();
      cy.get('#nome').type(accountName);
      // Clica no botão para salvar a nova conta
      cy.contains('Salvar').click();
  
      // Acessa a seção para criar uma nova movimentação
      cy.contains('Criar Movimentação').click();
  
      // Obtém a data atual e formata no padrão brasileiro
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      // Preenche o formulário de movimentação sem a descrição
      cy.get('#tipo').should('be.visible').select('DESP'); // Seleciona o tipo de movimentação
      cy.get('#data_transacao').type(formattedCurrentDate); // Data da movimentação
      cy.get('#data_pagamento').type(formattedCurrentDate); // Data do pagamento
      // Deixa o campo descrição vazio
      cy.get('#interessado').type(accountName); // Conta interessada
      cy.get('#valor').type('150.00'); // Valor da movimentação
      cy.get('#conta').select(accountName); // Seleciona a conta criada
  
      // Marca a situação como 'Pago'
      cy.get('#status_pago').click(); // Seleciona Pago
  
      // Clica no botão para salvar a movimentação
      cy.contains('Salvar').click();
  
      // Verifica se a mensagem de erro sobre a descrição obrigatória é exibida
      cy.contains('Descrição é obrigatório').should('be.visible');
    });
  });
  
  it('Cenário 9: Criar movimentação sem valor', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");
  
    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Gera novos nomes para a conta
      const newFirstName = faker.name.firstName();
      const newLastName = faker.name.lastName();
      const accountName = `${newFirstName} ${newLastName}`;
  
      // Atualiza o arquivo user.json com os novos nomes
      user.newFirstName = newFirstName;
      user.newLastName = newLastName;
      cy.writeFile('cypress/fixtures/user.json', user);
  
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();
  
      // Acessa a seção de contas e adiciona uma nova conta
      cy.contains('Contas').click();
      cy.contains('Adicionar').click();
      cy.get('#nome').type(accountName);
      // Clica no botão para salvar a nova conta
      cy.contains('Salvar').click();
  
      // Acessa a seção para criar uma nova movimentação
      cy.contains('Criar Movimentação').click();
  
      // Obtém a data atual e formata no padrão brasileiro
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      // Preenche o formulário de movimentação sem o valor
      cy.get('#tipo').should('be.visible').select('DESP'); // Seleciona o tipo de movimentação
      cy.get('#data_transacao').type(formattedCurrentDate); // Data da movimentação
      cy.get('#data_pagamento').type(formattedCurrentDate); // Data do pagamento
      cy.get('#descricao').type('Compra de materiais'); // Descrição da movimentação
      cy.get('#interessado').type(accountName); // Conta interessada
      // Deixa o campo valor vazio
      cy.get('#conta').select(accountName); // Seleciona a conta criada
  
      // Marca a situação como 'Pago'
      cy.get('#status_pago').click(); // Seleciona Pago
  
      // Clica no botão para salvar a movimentação
      cy.contains('Salvar').click();
  
      // Verifica se as mensagens de erro sobre o valor obrigatório são exibidas
      cy.contains('Valor é obrigatório').should('be.visible');
      cy.contains('Valor deve ser um número').should('be.visible');
    });
  });
  
  it('Cenário 10: Logout da conta', () => {
    // Acessa a página de login
    cy.visit("https://seubarriga.wcaquino.me/login");
  
    // Carrega os dados do usuário do arquivo 'user.json'
    cy.fixture('user.json').then((user) => {
      // Preenche o formulário de login com os dados do usuário
      cy.get('#email').type(user.email);
      cy.get('#senha').type(user.password);
      // Clica no botão para fazer login
      cy.contains("Entrar").click();
  
      // Verifica se a mensagem de boas-vindas é exibida após o login
      cy.contains(`Bem vindo, ${user.firstName} ${user.lastName}!`).should('be.visible');
  
      // Faz logout da conta
      cy.contains('Sair').click();
  
      // Verificar se a página de login é exibida
      cy.url('https://seubarriga.wcaquino.me/logout').should('include', '/logout');
      cy.get('#email').should('be.visible');
      cy.get('#senha').should('be.visible');
    });
  });
});

