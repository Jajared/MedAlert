import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const auth = getAuth();

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Signed up successfully");
  } catch (error) {
    // Handle sign up error
    console.log(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return [true, user.uid];
  } catch (error) {
    // Handle sign in error
    return [false, null];
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Additional logic after sign out
  } catch (error) {
    // Handle sign out error
  }
};
