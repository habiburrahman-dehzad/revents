import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { Form, Formik } from 'formik';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../../app/firestore/firestoreService';

const ProfileEditForm = ({ profile, setEditMode }) => {
  return (
    <Grid>
      <Grid.Column width={16}>
        <Formik
          initialValues={{
            displayName: profile.displayName,
            description: profile.description || '',
          }}
          validationSchema={Yup.object({
            displayName: Yup.string().required(),
          })}
          onSubmit={async (values, {setSubmitting}) => {
            try {
              await updateUserProfile(values);
              setEditMode(false);
            } 
            catch (error) {
              toast.error(error.message);
            }
            finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className='ui form'>
              <MyTextInput name='displayName' placeholder='Display Name' />
              <MyTextArea
                name='description'
                rows={3}
                placeholder='Description'
              />
              <Button
                loading={isSubmitting}
                disabled={isSubmitting || !isValid || !dirty}
                floated='right'
                size='large'
                positive
                type='submit'
                content='Update Profile'
              />
            </Form>
          )}
        </Formik>
      </Grid.Column>
    </Grid>
  );
};

export default ProfileEditForm;
