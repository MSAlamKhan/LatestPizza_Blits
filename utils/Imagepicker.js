import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

export const accessGallery = async () => {
  const options = {
    path: 'images',
    mediaType: 'photo',
    selectionLimit: 3,
  };

  const cameraResponse = await launchImageLibrary(options, response => {
    return response;
  });
  return cameraResponse;
};

export const accessCamera = async () => {
  const options = {
    path: 'images',
    mediaType: 'photo',
  };

  const cameraResponse = await launchCamera(options, response => {
    return response;
  });
  return cameraResponse;
};
