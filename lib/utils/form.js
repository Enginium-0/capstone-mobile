// lib/utils/form.js

import { router } from "expo-router";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Alert } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dj8c8jokq";

export function isSuccess(success, path) {
  if (success !== '') {
    Alert.alert(`🎉  Request ${success} has been submitted successfully!`);
  } else {
    Alert.alert('❌ Failed. Please try again.');
  }
  router.replace(path);
}

export async function uploadFileAsync(file, id, type = 'image') {
  try {
    const resourceType = (type === 'image') ? 'image' : 'raw';
    const uploadUrl = CLOUDINARY_URL + `/${resourceType}/upload`;

    if (type !== 'image' && file.mimeType !== 'application/pdf') {
      throw new Error('Only images and PDFs are allowed');
    }

    const data = new FormData();
    data.append('file', {
      uri: file.uri,
      type: file.mimeType || 'application/octet-stream',
      name: `${id}`,
    });
    data.append('upload_preset', 'FacilitEASE');
    data.append('public_id', id);

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    if (!json.secure_url) {
      throw new Error(`Cloudinary error: ${JSON.stringify(json)}`);
    }

    return json.secure_url;
  } catch (error) {
    console.error('[uploadFileAsync] Upload failed:', error);
    throw error;
  }
}

// 📥 Download and save a PDF with a fixed filename
export async function downloadAndSaveFile(url, filename = 'document.pdf') {
  try {
    const fileUri = FileSystem.documentDirectory + filename;
    const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
    const { uri: savedUri } = await downloadResumable.downloadAsync();
    await Sharing.shareAsync(savedUri); // optional: open or share
    return savedUri;
  } catch (err) {
    console.error('[downloadAndSaveFile] Download failed:', err);
    Alert.alert('Failed to download the file.');
  }
}
