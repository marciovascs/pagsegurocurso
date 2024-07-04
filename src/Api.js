// arquivo de requisições
import {Platform} from 'react-native';
if (Platform.OS === 'ios') {
  var ip = '127.0.0.1'; // url das apis do sistema mercadinho
} else {
  var ip = '10.0.2.2'; // url das apis do sistema mercadinho
}
const BASE_API = 'https://mercadinhointeligente.com.br/api'; // url das apis do sistema mercadinho
// const BASE_API = 'http://' + ip + ':8000/api'; // url das apis do sistema mercadinho

// requisições
export default {
  // atualizar token
  checkToken: async token => {
    console.log(
      'entrou em na api check token... vai chamar a api refresh no laravel...',
    );
    console.log(token);
    const req = await fetch(`${BASE_API}/token/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Content_type': 'application/x-www-form-urlencoded',
        // body: JSON.stringify({token}),
      },
      body: JSON.stringify({token}),
    });
    const json = await req.json();
    console.log('json: ');
    console.log(json);
    return json;
  },
  // login
  signIn: async (email, password) => {
    console.log(
      '6 - entrou na api signIn... email = ' + email + ' senha = ' + password,
    );

    console.log('7 - vai enviar para o back...');
    console.log('8 - url: ');
    console.log(`${BASE_API}/auth/login`);

    const req = await fetch(`${BASE_API}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    const json = await req.json();
    console.log('resposta:');
    console.log(json);
    return json;
  },
  // cadastro do usuário
  signUp: async (name, email, password) => {
    console.log('entrou em signUp...');
    console.log('name = ' + name + ' email = ' + email);
    // const req = await fetch(`${BASE_API}/user`, {
    const req = await fetch(`${BASE_API}/user/cadastrarusuario`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email, password}),
    });
    const json = await req.json();
    return json;
  },
  // buscar produto
  buscarProduto: async codigoDeBarra => {
    console.log('entrou na api buscarProduto...');
    console.log('codigo de barra = ' + codigoDeBarra);
    // const req = await fetch(`${BASE_API}/user`, {
    const req = await fetch(`${BASE_API}/produto/buscarProduto`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({codigoDeBarra}),
    });
    const json = await req.json();
    return json;
  },
  // baixar estoque
  baixarEstoque: async (produtos, user) => {
    console.log('entrou na api baixarEstoque...');
    
    const req = await fetch(`${BASE_API}/produto/baixarEstoque`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({produtos, user}),
    });
    const json = await req.json();

    console.log(json.message);
    return json;
  },
};
