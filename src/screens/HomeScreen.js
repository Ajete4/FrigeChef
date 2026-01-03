import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { supabase } from '../supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';   

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);

  const cameraRef = useRef(null);   // ✅ përdor useRef
  const [permission, requestPermission] = useCameraPermissions();

  // Merr përdoruesin
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Gabim', error.message);
    }
  };

  // Shto receta manual
  const handleAddRecipeManual = () => {
    if (!newRecipeTitle.trim()) return;
    setRecipes(prev => [...prev, { title: newRecipeTitle }]);
    setNewRecipeTitle('');
    setModalVisible(false);
  };

  // Hap kamera
  const handleCameraPress = async () => {
    console.log('handleCameraPress called');
    if (Platform.OS === 'web') {
      Alert.alert('Gabim', 'Kamera nuk mbështetet në web!');
      return;
    }
    console.log('Checking camera permission');
    if (!permission) {
      console.log('Requesting permission');
      const { status } = await requestPermission();
      console.log('Permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Gabim', 'Leja për kamerën nuk u dhënë!');
        return;
      }
    } else if (permission.status !== 'granted') {
      console.log('Permission not granted');
      Alert.alert('Gabim', 'Leja për kamerën nuk u dhënë!');
      return;
    }
    console.log('Permission granted, opening camera');
    setCameraOpen(true);
  };

  // Kap foto
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo URI:', photo.uri);
      Alert.alert('Foto e kapur!', `Path: ${photo.uri}`);
      setCameraOpen(false);

      setRecipes(prev => [...prev, { title: 'Photo Recipe', uri: photo.uri }]);
    }
  };

  // Shfaq kamera nëse është hapur
  if (cameraOpen) {
    return (
      <CameraView style={{ flex: 1 }} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.snapBtn} onPress={takePicture}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Kap Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.snapBtn, { backgroundColor: '#ccc', marginTop: 10 }]}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={{ color: '#000', fontSize: 18 }}>Mbyll</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../images/logo1.1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => Alert.alert('Settings')}>
            <Ionicons name="settings-outline" size={28} color="#2F855A" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#2F855A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profil Section */}
      {user && (
        <View style={styles.profile}>
          <Text style={styles.welcome}>Welcome, {user.user_metadata.first_name}!</Text>
          <TouchableOpacity onPress={() => Alert.alert('Edit Profile')}>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Recipe Buttons */}
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity style={styles.cameraBtn} onPress={handleCameraPress}>
          <Ionicons name="camera-outline" size={28} color="#fff" />
          <Text style={styles.btnText}>Use Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.manualBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="create-outline" size={28} color="#fff" />
          <Text style={styles.btnText}>Add Manually</Text>
        </TouchableOpacity>
      </View>

      {/* Lista e recetave */}
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text>No recipes yet</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal për shtim manual */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Recipe Manually</Text>
            <TextInput
              placeholder="Recipe Title"
              style={styles.modalInput}
              value={newRecipeTitle}
              onChangeText={setNewRecipeTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddRecipeManual}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logo: { width: 120, height: 60 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profile: { marginBottom: 20 },
  welcome: { fontSize: 18, fontWeight: 'bold' },
  editProfile: { color: '#2F855A', marginTop: 5 },
  addButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cameraBtn: { flex: 1, backgroundColor: '#2F855A', padding: 15, borderRadius: 12, marginRight: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  manualBtn: { flex: 1, backgroundColor: '#2F855A', padding: 15, borderRadius: 12, marginLeft: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  recipeCard: { padding: 15, borderRadius: 12, backgroundColor: '#E6F4EA', marginBottom: 10, shadowColor: '#2F855A', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 3 },
  recipeTitle: { fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalInput: { borderWidth: 1, borderColor: '#2F855A', borderRadius: 12, padding: 10, marginBottom: 15 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalBtn: {
    flex: 1,
    backgroundColor: '#2F855A',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30
  },
  snapBtn: {
    backgroundColor: '#2F855A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: 150
  },
});
