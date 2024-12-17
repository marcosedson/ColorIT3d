import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './LoginScreen'; // Ajuste o caminho conforme necessário
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/config';

// Mock do Firebase Auth
jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    auth: {
        currentUser: null, // Simula um usuário não autenticado inicialmente
    },
}));

// Mock do LoadingModal
jest.mock('../../utils/LoadingModal', () => 'LoadingModal');

const MockNavigation = ({children}) => {
    return (
        <NavigationContainer>
            {children}
        </NavigationContainer>
    );
};

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar corretamente', () => {
        const {getByPlaceholderText, getByText} = render(
            <MockNavigation>
                <LoginScreen/>
            </MockNavigation>
        );

        expect(getByPlaceholderText('E-mail')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Log in')).toBeTruthy();
    });

    it('deve chamar a função de login quando os dados forem inseridos corretamente', async () => {
        const mockNavigate = jest.fn();
        signInWithEmailAndPassword.mockResolvedValueOnce({user: {email: 'test@test.com'}});

        const {getByPlaceholderText, getByText} = render(
            <MockNavigation>
                <LoginScreen navigation={{navigate: mockNavigate}}/>
            </MockNavigation>
        );

        const emailInput = getByPlaceholderText('E-mail');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Log in');

        fireEvent.changeText(emailInput, 'test@test.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.press(loginButton);

        await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@test.com', 'password123'));
        expect(mockNavigate).toHaveBeenCalledWith('Home');
    });

    it('deve exibir o modal de carregamento durante o login', async () => {
        signInWithEmailAndPassword.mockResolvedValueOnce({user: {email: 'test@test.com'}});

        const {getByText, getByPlaceholderText} = render(
            <MockNavigation>
                <LoginScreen/>
            </MockNavigation>
        );

        const emailInput = getByPlaceholderText('E-mail');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Log in');

        fireEvent.changeText(emailInput, 'test@test.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.press(loginButton);

        expect(getByText('LoadingModal')).toBeTruthy(); // Verifica se o modal de carregamento aparece
    });

    it('deve mostrar um erro se o login falhar', async () => {
        const mockAlert = jest.spyOn(global, 'alert').mockImplementation(() => {
        });
        signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Usuário não encontrado'));

        const {getByPlaceholderText, getByText} = render(
            <MockNavigation>
                <LoginScreen/>
            </MockNavigation>
        );

        const emailInput = getByPlaceholderText('E-mail');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Log in');

        fireEvent.changeText(emailInput, 'invalid@test.com');
        fireEvent.changeText(passwordInput, 'wrongpassword');
        fireEvent.press(loginButton);

        await waitFor(() => expect(mockAlert).toHaveBeenCalledWith('Usuário não encontrado'));
        mockAlert.mockRestore();
    });
});
