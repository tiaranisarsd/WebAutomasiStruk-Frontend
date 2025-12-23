import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";
import CardDataStruk from "../components/CardDataStruk";

const DataStruk = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <Header />
          <CardDataStruk />
        </>
      )}
    </React.Fragment>
  );
};

export default DataStruk;
