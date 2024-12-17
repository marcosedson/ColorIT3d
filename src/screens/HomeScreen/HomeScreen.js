import React, { useEffect, useState } from "react";
import {View, TextInput, Button, Text} from "react-native";
import { Canvas } from "@react-three/fiber";
import { Box, Cylinder, Sphere } from "@react-three/drei";

import { fetchUserColors, saveUserColors } from "../../services/ColorService";
import { validateColors , getObjectName } from "../../utils/ColorValidator";
import LoadingModal from "../../utils/LoadingModal";

import styles from "./styles";
import AuthService from "../../services/AuthService";

const HomeScreen = ({ navigation }) => {
    const initialColors = { obj1: "red", obj2: "blue", obj3: "yellow" };
    const [colors, setColors] = useState(initialColors);
    const [inputs, setInputs] = useState({ obj1: "", obj2: "", obj3: "" });
    const [isLoading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const loadColors = async () => {
            setLoading(true);
            try {
                const fetchedColors = await fetchUserColors();
                if (fetchedColors) setColors(fetchedColors);
            } catch (error) {
                alert("Não foi possível carregar as cores.");
            } finally {
                setLoading(false);
            }
        };
        loadColors();
    }, []);

    const handleInputChange = (key, value) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
        setColors((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveColors = async () => {
        const validationErrors = validateColors(inputs);

        if (validationErrors.length > 0) {
            alert(validationErrors.join("\n"));
            return;
        }

        setLoading(true);
        try {
            const isSaved = await saveUserColors(colors);
            if (isSaved) {
                setSuccessMessage("Cores atualizadas com sucesso!");
                setInputs({ obj1: "", obj2: "", obj3: "" });
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                alert("Não foi possível salvar as cores.");
            }
        } catch (error) {
            alert("Ocorreu um problema ao salvar as cores.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await AuthService.logout();
            navigation.navigate("Login");
        } catch (error) {
            alert("Não foi possível realizar o logout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                <Box position={[-3, 0, 0]} args={[1, 1, 1]} material-color={colors.obj1} />
                <Sphere position={[0, 0, 0]} args={[1]} material-color={colors.obj2} />
                <Cylinder position={[3, 0, 0]} args={[0.5, 0.5, 2]} material-color={colors.obj3} />
            </Canvas>

            {["obj1", "obj2", "obj3"].map((key) => (
                <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={`Cor do ${getObjectName(key)}`}
                    onChangeText={(text) => handleInputChange(key, text)}
                    value={inputs[key]}
                />
            ))}

            <Button title="Apply Colors" onPress={handleSaveColors} />
            <View style={styles.buttonSpacer} />
            <Button
                title="Logout"
                color={styles.logoutButton.backgroundColor}
                onPress={handleLogout}
            />
            <LoadingModal isVisible={isLoading} />
            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
        </View>
    );
};

export default HomeScreen;
