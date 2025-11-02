/* eslint-env jest */
const { UserService } = require('../src/userService');

const usuarioBase = {
  nome: 'João da Silva',
  email: 'joao@email.com',
  idade: 26,
};

describe('UserService - Testes Refatorados', () => {
  let servico;

  beforeEach(() => {
    servico = new UserService();
    // limpeza do "banco" antes de cada teste
    // eslint-disable-next-line no-underscore-dangle
    servico._clearDB();
  });

  test('cria um usuário e recupera seus dados com sucesso', () => {
    // Arrange
    const { nome, email, idade } = usuarioBase;

    // Act
    const novoUsuario = servico.createUser(nome, email, idade);
    const usuarioEncontrado = servico.getUserById(novoUsuario.id);

    // Assert
    expect(usuarioEncontrado.nome).toBe(nome);
    expect(usuarioEncontrado.email).toBe(email);
    expect(usuarioEncontrado.status).toBe('ativo');
  });

  test('desativa um usuário comum corretamente', () => {
    // Arrange
    const usuario = servico.createUser('Carlos', 'carlos@teste.com', 35);

    // Act
    const sucesso = servico.deactivateUser(usuario.id);
    const usuarioFinal = servico.getUserById(usuario.id);

    // Assert
    expect(sucesso).toBe(true);
    expect(usuarioFinal.status).toEqual('inativo');
  });

  test('impede desativação de usuário administrador', () => {
    // Arrange
    const admin = servico.createUser('Admin', 'admin@teste.com', 50, true);

    // Act
    const retorno = servico.deactivateUser(admin.id);
    const adminAposTentativa = servico.getUserById(admin.id);

    // Assert
    expect(retorno).toBe(false);
    expect(adminAposTentativa.status).toBe('ativo');
  });

  test('gera relatório de usuários contendo informações esperadas', () => {
    // Arrange
    const primeiro = servico.createUser('Maria', 'maria@email.com', 29);
    servico.createUser('Pedro', 'pedro@email.com', 33);

    // Act
    const relatorio = servico.generateUserReport();

    // Assert
    expect(relatorio).toMatch(/Relatório de Usuários/);
    expect(relatorio).toContain(primeiro.nome);
    expect(relatorio).toContain(`ID: ${primeiro.id}`);
  });

  test('lança erro ao tentar criar usuário menor de 18 anos', () => {
    // Arrange & Act & Assert
    expect(() => servico.createUser('Menor', 'menor@teste.com', 15))
      .toThrow('O usuário deve ser maior de idade.');
  });

  test.todo('deve retornar lista vazia se não houver usuários cadastrados');
});
