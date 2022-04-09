import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function passwordReset(email) {
  return sendPasswordResetEmail(auth, email);
}
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
export function updateName(user, first_name, last_name) {
  return updateProfile(user, { displayName: first_name + " " + last_name });
}

export function logOut() {
  return signOut(auth);
}
export function googleSignIn() {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
}
