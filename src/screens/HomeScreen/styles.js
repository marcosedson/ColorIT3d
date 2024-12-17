import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10
    },
    canvas: {
        width: '100%',
        height: 300, // Ajuste o tamanho do canvas conforme necessário
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        width: "80%",
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    buttonSpacer: {
        marginBottom: 20,  // Adiciona um espaçamento entre os botões
    },
    logoutButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
    },
    logoutText: {
        color: "white",
        fontWeight: "bold",
    },
});