import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';
import i18n from '@/localization/i18n';

/**
 * Requests gallery permission and opens the image library for a single,
 * square-cropped image. Returns the picked asset, or `null` when permission
 * is denied or the user cancels. Permission denial surfaces a flash message.
 */
export async function pickImageFromLibrary(): Promise<ImagePicker.ImagePickerAsset | null> {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    showMessage({
      message: i18n.t('common.galleryAccessDenied'),
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

/**
 * Builds a multipart `FormData` body for uploading an image asset, deriving a
 * file name and mime type with sensible JPEG fallbacks.
 */
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
