import { auth } from "../firebase/config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

class AuthService {
    static async login(email, password) {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    static async logout() {
        return await signOut(auth);
    }
}

export default AuthService;
