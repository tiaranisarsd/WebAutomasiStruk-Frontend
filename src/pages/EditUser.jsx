import React, { useEffect } from 'react';
import Header from '../components/Header';
import FormEditUser from '../components/FormEditUser';
import { getMe } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
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
        <FormEditUser />
    </div>
  )
}

export default EditUser