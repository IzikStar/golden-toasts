import { TokenData } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const TOKEN_EXPIRATION_DAYS = 30;

type InitialStateProps = {
  token: string | null;
  adminGreetingsCompleted: boolean;
  decodedToken: TokenData | null;
};

const initialState: InitialStateProps = {
  token: Cookies.get('token') ?? null,
  adminGreetingsCompleted: Cookies.get('adminGreetingsCompleted') === 'true',
  decodedToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      Cookies.set('token', action.payload, { expires: TOKEN_EXPIRATION_DAYS });
      try {
        state.decodedToken = jwtDecode<TokenData>(action.payload);
      } catch (error) {
        console.error('Error decoding token:', error);
        state.decodedToken = null;
      }
    },

    completeAdminGreetings: (state) => {
      if (state.decodedToken?.isAdmin) {
        state.adminGreetingsCompleted = true;
        Cookies.set('adminGreetingsCompleted', 'true');
      }
    },

    clearToken: (state) => {
      state.token = null;
      state.decodedToken = null;
      state.adminGreetingsCompleted = false;
      Cookies.remove('token');
      Cookies.remove('adminGreetingsCompleted');
    },

    initializeDecodedToken: (state) => {
      if (state.token && !state.decodedToken) {
        try {
          state.decodedToken = jwtDecode<TokenData>(state.token);
        } catch (error) {
          console.error('Error decoding token:', error);
          state.decodedToken = null;
          state.token = null;
          Cookies.remove('token');
        }
      }
    },
  },
});

export const {
  setToken,
  clearToken,
  initializeDecodedToken,
  completeAdminGreetings,
} = authSlice.actions;

export const selectIsAdmin = (state: { auth: InitialStateProps }) =>
  state.auth.decodedToken?.isAdmin === true;

export const selectShouldShowAdminGreetings = (state: {
  auth: InitialStateProps;
}) => selectIsAdmin(state) && !state.auth.adminGreetingsCompleted;

export default authSlice.reducer;
