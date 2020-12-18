import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { openModal } from '../../app/common/modals/modalReducer';
import { decrement, increment } from './testReducer';

export default function Sandbox() {
  const dispatch = useDispatch();
  const [target, setTarget] = useState(null);

  const data = useSelector((state) => state.test.data);
  const { loading } = useSelector((state) => state.async);

  return (
    <>
      <h1>Testing 123</h1>
      <h3>The data is: {data} </h3>
      <Button
        name='increment'
        onClick={(e) => {
            dispatch(increment(20));
            setTarget(e.target.name);
        }}
        loading={loading && target === 'increment'}
        color='green'
        content='Increment'
      />
      <Button
        name='decrement'
        onClick={(e) => {
            dispatch(decrement(10));
            setTarget(e.target.name);
        }}
        loading={loading && target === 'decrement'}
        color='red'
        content='Decrement'
      />
      <Button
        onClick={() =>
          dispatch(openModal({ modalType: 'TestModal', modalProps: { data } }))
        }
        color='teal'
        content='Open Modal'
      />
    </>
  );
}
