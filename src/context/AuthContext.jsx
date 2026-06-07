import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { isAdminEmail } from '../utils/helpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubProfile = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUserProfile({ id: snap.id, ...data });
            setIsAdmin(isAdminEmail(firebaseUser.email) || data.isAdmin === true);
          } else {
            setUserProfile(null);
            setIsAdmin(isAdminEmail(firebaseUser.email));
          }
          setLoading(false);
        }, () => {
          setLoading(false);
        });
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const createAccount = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, loading, login, logout, createAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
