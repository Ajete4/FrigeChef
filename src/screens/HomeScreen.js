import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/hero1.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.card}>
          <Text style={styles.title}>Mirësevini në Home Screen!</Text>
          <Text style={styles.subtitle}>Këtu mund të shihni përmbajtjen tuaj.</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const { height } = require('react-native').Dimensions.get('window');

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
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#2F855A', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
});
