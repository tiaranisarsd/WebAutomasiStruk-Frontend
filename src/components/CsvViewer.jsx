/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Alert } from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";

const CsvViewer = ({ apiUrl }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apiUrl) {
      fetchCsvData();
    }
  }, [apiUrl]);

  const fetchCsvData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', 
      });

      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setColumns(results.meta.fields); 
            setData(results.data);
          } else {
            setError("File CSV kosong atau format tidak dikenali.");
          }
          setLoading(false);
        },
        error: (err) => {
          setError("Gagal memparsing file CSV.");
          setLoading(false);
        }
      });
    } catch (err) {
      setError("Gagal mengunduh file dari server.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><LoadingIndicator /> <p>Memuat data excel...</p></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (data.length === 0) return <p className="text-center">Tidak ada data.</p>;

  return (
    <div className="table-container">
      <table className="excel-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx}>
              {columns.map((col, cIdx) => (
                <td key={cIdx}>
                  {row[col] ? row[col] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvViewer;