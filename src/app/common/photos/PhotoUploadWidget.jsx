import React, { Fragment } from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import { useState } from 'react';
import { useEffect } from 'react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import cuid from 'cuid';
import { getFileExtension } from '../util/util';
import { uploadToFirebaseStorage } from '../../firestore/firebaseService';
import { toast } from 'react-toastify';
import { updateUserProfilePhoto } from '../../firestore/firestoreService';

const PhotoUploadWidget = ({ uploadPhoto, setEditMode }) => {
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadImage = () => {
    setLoading(true);
    const filename = cuid() + '.' + getFileExtension(files[0].name);
    const uploadTask = uploadToFirebaseStorage(image, filename);
    uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    }, error => {
      toast.error(error.message);
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        updateUserProfilePhoto(downloadURL, filename).then(() => {
          setLoading(false);
          handleCancelCrop();
          setEditMode(false);
        }).catch(error => {
          toast.error(error.message);
          setLoading(false);
        });
      }) 
    })
  }

  const handleCancelCrop = () => {
    setFiles([]);
    setImage(null);
  }

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color='teal' sub content='Step 1 - Add Photo' />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 2 - Resize image' />
          {files.length > 0 && (
            <PhotoWidgetCropper
              setImage={setImage}
              imagePreview={files[0].preview}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 3 - Preview & Upload' />
          {files.length > 0 && (
            <Fragment>
              <div
                className='img-preview'
                style={{ minHeight: '200px', minWidth: '200px', overflow: 'hidden' }}
              />
              <Button.Group widths={2}>
                <Button
                  style={{width: 100}}
                  positive
                  icon='check'
                  loading={loading}
                  onClick={handleUploadImage}
                />
                <Button
                  style={{width: 100}}
                  icon='close'
                  disabled={loading}
                  onClick={handleCancelCrop}
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default PhotoUploadWidget;
