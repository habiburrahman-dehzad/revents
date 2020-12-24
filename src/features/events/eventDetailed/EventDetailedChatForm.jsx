import { Field, Form, Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import { Loader } from 'semantic-ui-react';
import { addEventChatComment } from '../../../app/firestore/firebaseService';
import * as Yup from 'yup';

const EventDetailedChatForm = ({ eventId, parentId, closeForm }) => {
  return (
    <Formik
      initialValues={{ comment: '' }}
      validationSchema={Yup.object({
        comment: Yup.string().required()
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await addEventChatComment(eventId, {...values, parentId});
          resetForm();
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSubmitting(false);
          closeForm();
        }
      }}
    >
      {({ isSubmitting, handleSubmit, isValid }) => (
        <Form className='ui form'>
          <Field name='comment'>
            {({ field }) => (
              <div style={{ position: 'relative' }}>
                <Loader active={isSubmitting} />
                <textarea
                  {...field}
                  rows='2'
                  placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.shiftKey) {
                      return;
                    }
                    else if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      isValid && handleSubmit();
                    }
                  }}
                ></textarea>
              </div>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default EventDetailedChatForm;
