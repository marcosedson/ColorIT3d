import { auth, db } from "../firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export const fetchUserColors = async () => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) return null;

        const docRef = doc(collection(db, "users"), userId);
        const docSnap = await getDoc(docRef);

        return docSnap.exists() ? docSnap.data().colors : null;
    } catch (error) {
        console.error("Erro ao buscar cores:", error);
        return null;
    }
};

export const saveUserColors = async (colors) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) return false;

        const docRef = doc(collection(db, "users"), userId);
        await setDoc(docRef, { colors }, { merge: true });
        return true;
    } catch (error) {
        console.error("Erro ao salvar cores:", error);
        return false;
    }
};
