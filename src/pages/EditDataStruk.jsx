import React, { useEffect } from 'react';
import Header from '../components/Header';
import FormEditDataStruk from '../components/FormEditDataStruk';
import { getMe } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EditDataStruk = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if(isError) {
            navigate("/login");
        }
        if(user && user.role !== "admin") {
            navigate("/login");
        }
    }, [isError, user, navigate]);

  return (
    <div>
        <Header />
        <FormEditDataStruk />
    </div>
  )
}

export default EditDataStruk