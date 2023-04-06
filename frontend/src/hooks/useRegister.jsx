import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from './useAuthContext';
import axios from 'axios';

export default function useRegister() {
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const objectToArray = object => Object.values(object).flat();

  const register = async (user) => {
    setIsLoading(() => true);
    setErrors(null);

    axios.post('/register', user, { timeout: 5000 })
      .then(({ data }) => {
        dispatch({ type: 'REGISTER', payload: data });

        setIsLoading(() => false);
        navigate('/');
      })
      .catch(({ response }) => {
        setIsLoading(() => false);

        if (!response) {
          setErrors(() => ['Network Error']);
          return;
        }

        if (response.status === 422) {
          const errors = response.data.errors
            ? objectToArray(response.data.errors)
            : [response.data.message];

          setErrors(errors);
          return;
        }

        setErrors(() => [response.statusText]);
      });
  }

  return { register, isLoading, errors }
}