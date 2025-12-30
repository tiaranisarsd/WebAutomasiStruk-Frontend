import { useEffect } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardDataStruk from "../components/CardDataStruk";
import { getMe } from "../features/authSlice";

const DataStruk = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if(isError){
      navigate("/login")
    }
  }, [isError, navigate]);

  return (
    <div>
      <Header />
      <CardDataStruk />
    </div>
  );
};

export default DataStruk;
