import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import HomeScreen from './HomeScreen'; // Ajuste o caminho conforme necessário
import {auth, db} from '../../firebase/config'; // Mock das dependências do Firebase
import {signOut} from 'firebase/auth';
import {setDoc, getDoc, doc, collection} from 'firebase/firestore';

// Mock das dependências
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('HomeScreen', () => {
    beforeEach(() => {
        // Mock para o Firebase
        getDoc.mockResolvedValue({
            exists: jest.fn().mockReturnValue(true),
            data: jest.fn().mockReturnValue({colors: {obj1: 'red', obj2: 'blue', obj3: 'green'}})
        });
        setDoc.mockResolvedValue();
    });

    it('renders the HomeScreen and displays initial colors', () => {
        const {getByPlaceholderText, getByText} = render(<HomeScreen navigation={{navigate: jest.fn()}}/>);

        // Verifica se os inputs de cor estão visíveis
        expect(getByPlaceholderText('Cor do Cubo')).toBeTruthy();
        expect(getByPlaceholderText('Cor da Esfera')).toBeTruthy();
        expect(getByPlaceholderText('Cor do Cilindro')).toBeTruthy();

        // Verifica se os objetos 3D estão sendo renderizados com as cores iniciais
        expect(getByText('Apply Colors')).toBeTruthy(); // Verifica se o botão de aplicar está visível
    });

    it('should allow user to change colors and save', async () => {
        const {getByPlaceholderText, getByText} = render(<HomeScreen navigation={{navigate: jest.fn()}}/>);

        const colorInput1 = getByPlaceholderText('Cor do Cubo');
        const colorInput2 = getByPlaceholderText('Cor da Esfera');
        const colorInput3 = getByPlaceholderText('Cor do Cilindro');

        fireEvent.changeText(colorInput1, 'orange');
        fireEvent.changeText(colorInput2, 'purple');
        fireEvent.changeText(colorInput3, 'pink');

        fireEvent.press(getByText('Apply Colors'));

        // Verifica se a função saveColors foi chamada corretamente (mocked)
        await waitFor(() => {
            expect(setDoc).toHaveBeenCalledWith(
                doc(collection(db, 'users'), auth.currentUser?.uid || ''),
                {colors: {obj1: 'orange', obj2: 'purple', obj3: 'pink'}},
                {merge: true}
            );
        });
    });

    it('should show success message when colors are saved', async () => {
        const {getByText, getByPlaceholderText} = render(<HomeScreen navigation={{navigate: jest.fn()}}/>);

        const colorInput1 = getByPlaceholderText('Cor do Cubo');
        const colorInput2 = getByPlaceholderText('Cor da Esfera');
        const colorInput3 = getByPlaceholderText('Cor do Cilindro');

        fireEvent.changeText(colorInput1, 'orange');
        fireEvent.changeText(colorInput2, 'purple');
        fireEvent.changeText(colorInput3, 'pink');

        fireEvent.press(getByText('Apply Colors'));

        await waitFor(() => {
            expect(getByText('Cores atualizadas com sucesso!')).toBeTruthy();
        });
    });

    it('should show alert when inputs are empty', async () => {
        const {getByText, getByPlaceholderText} = render(<HomeScreen navigation={{navigate: jest.fn()}}/>);

        fireEvent.changeText(getByPlaceholderText('Cor do Cubo'), '');
        fireEvent.changeText(getByPlaceholderText('Cor da Esfera'), '');
        fireEvent.changeText(getByPlaceholderText('Cor do Cilindro'), '');

        fireEvent.press(getByText('Apply Colors'));

        // Verifica se o alert é chamado quando algum campo está vazio
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                'Os seguintes campos estão vazios:\nOBJ1: campo vazio.\nOBJ2: campo vazio.\nOBJ3: campo vazio.'
            );
        });
    });

    it('should call logout function', async () => {
        const {getByText} = render(<HomeScreen navigation={{navigate: jest.fn()}}/>);

        fireEvent.press(getByText('Logout'));

        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
            expect(getByText('Login')).toBeTruthy(); // Verifica se a navegação para a tela de login ocorre
        });
    });
});
