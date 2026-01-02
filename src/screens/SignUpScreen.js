import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { supabase } from '../supabaseClient';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert('Gabim', error.message);
    } else {
      Alert.alert(
        'Sukses',
        'Regjistrimi u krye me sukses. Kontrollo email-in për verifikim.'
      );
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/hero1.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.card}>
          <Image
            source={require('../images/logo1.1.png')}
            style={styles.cardLogo}
            resizeMode="contain"
          />

          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#555"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#555"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Duke u regjistruar...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              You have an account
              ? Login here!
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Cook, taste, enjoy! 🍽️</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  card: {
    width: width > 600 ? '40%' : '85%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 25,
    alignSelf: 'center',
    marginTop: height * 0.15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  cardLogo: {
    width: width > 600 ? 150 : 140,
    height: width > 600 ? 150 : 140,
    marginBottom: 25,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#2F855A',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2F855A',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#2F855A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#2F855A', fontSize: 14, marginTop: 5, textAlign: 'center' },
  footerText: { position: 'absolute', bottom: 20, alignSelf: 'center', fontSize: 16, color: '#fff' },
});
