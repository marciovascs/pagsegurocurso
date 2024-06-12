/**
 * ações específicas e local de armazenamento para dados de usuário
 *
 * Aqui são os métodos que são chamados para armazenar algo na seção.
 * Ao invés de colocar algo diretamene em seção, chama o método daqui pra fazer isso.
 */
export const initialState = {
  avatar: '',
  favorites: [],
  appointments: [],
  user: {},
};

export const UserReducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      return {...state, user: action.payload.user};
      // eslint-disable-next-line no-unreachable
      break;
    default:
      return state;
  }
};
