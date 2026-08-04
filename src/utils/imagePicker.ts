import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';

export async function pickImageFromLibrary(): Promise<ImagePicker.ImagePickerAsset | null> {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    showMessage({
      message: 'Galeri erişimi reddedildi',
      type: 'danger',
    });
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}

export function buildImageFormData(
  asset: ImagePicker.ImagePickerAsset,
  fieldName = 'image',
): FormData {
  const formData = new FormData();
  const fileName = asset.fileName ?? asset.uri.split('/').pop() ?? 'profile.jpg';

  formData.append(fieldName, {
    uri: asset.uri,
    name: fileName,
    type: asset.mimeType ?? 'image/jpeg',
  } as unknown as Blob);

  return formData;
}
