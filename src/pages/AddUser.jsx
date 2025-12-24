import React, { useEffect } from 'react';
import Header from '../components/Header';
import FormAddUser from '../components/FormAddUser';
import { getMe } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
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
        <FormAddUser />
    </div>
  )
}

export default AddUser