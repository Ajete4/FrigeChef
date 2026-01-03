import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { supabase } from '../supabaseClient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gabim', 'Ju lutem plotësoni email dhe password');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      Alert.alert('Sukses', 'Logged in successfully!');
      console.log('User:', data.user);
      // navigation.navigate('Home');

    }
  };

  return (
    <View style={styles.container}>
      {/* Hero Image Background */}
      <ImageBackground
        source={require('../images/hero1.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Card */}
        <View style={styles.card}>
          {/* Logo mbi card */}
          <Image
            source={require('../images/logo1.1.png')}
            style={styles.cardLogo}
            resizeMode="contain"
          />

          {/* Inputet */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Button me ngjyrat e logos */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text>Don't have an account? Sign Up</Text>
          </TouchableOpacity>


        </View>

        {/* Footer motivues */}
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
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 25,
    alignSelf: 'center',
    marginTop: height * 0.2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    zIndex: 2,
    alignItems: 'center',
  },
  cardLogo: {
    width: 140,
    height: 140,
    marginBottom: 25,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#2F855A', // border me ngjyrën e logos
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2F855A', // buton me ngjyrën e logos
    paddingVertical: 15,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#2F855A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#2F855A', fontSize: 14, marginTop: 5, textAlign: 'center' }, // link teksti me ngjyrën e logos
  footerText: { position: 'absolute', bottom: 20, alignSelf: 'center', fontSize: 16, color: '#fff' },
});
