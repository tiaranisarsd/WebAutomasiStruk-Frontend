import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const FormEditDataStruk = () => {
  const [formData, setFormData] = useState({
    reference_no: "",
    product_name: "",
    branch_name: "",
    kanwil_name: "",
    receiver_address: "",
    district: "",
    city: "",
    province: "",
    quantity: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getById = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/master-transaction/${id}`,
        );
        const data = response.data;
        setFormData({
          reference_no: data.reference_no || "",
          product_name: data.product_name || "",
          branch_name: data.branch_name || "",
          kanwil_name: data.kanwil_name || "",
          receiver_address: data.receiver_address || "",
          district: data.district || "",
          city: data.city || "",
          province: data.province || "",
          quantity: data.quantity || "",
        });
      } catch (error) {
        setMsg(error.response?.data.msg || "Gagal memuat data pengguna.");
        setShowToast(true);
        setTimeout(() => {
          navigate("/data-struk");
        }, 3000);
      }
    };
    getById();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/master-transaction/${id}`,
        formData,
      );
      setMsg("Data berhasil diperbarui!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/data-struk");
      }, 3000);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Gagal memperbarui data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="p-3 mt-5 pt-5">
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{
          zIndex: 9999,
          position: "fixed",
          bottom: "80px",
          transform: "translateX(-50%)",
        }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={msg.includes("berhasil") ? "success" : "danger"}
        >
          <Toast.Header>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{msg}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Card className="custom-table">
        <Card.Header className="text-white bg-white">
          <h4 className="mb-0 text-blue fw-bold">Ubah Data Transaksi</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group className="mb-3">
                <Form.Label>No Reference</Form.Label>
                <Form.Control
                  name="reference_no"
                  value={formData.reference_no}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </Form.Group>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Produk</Form.Label>
                  <Form.Control
                    name="product_name"
                    as="textarea"
                    value={formData.product_name}
                    onChange={handleChange}
                    autoComplete="off"
                    rows={5}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jumlah</Form.Label>
                  <Form.Control
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Cabang</Form.Label>
                  <Form.Control
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kantor Wilayah</Form.Label>
                  <Form.Control
                    name="kanwil_name"
                    value={formData.kanwil_name}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alamat Penerima</Form.Label>
                  <Form.Control
                    name="receiver_address"
                    as="textarea"
                    value={formData.receiver_address}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kecamatan</Form.Label>
                  <Form.Control
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kota/Kabupaten</Form.Label>
                  <Form.Control
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Provinsi</Form.Label>
                  <Form.Control
                    name="province"
                    type="text"
                    value={formData.province}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="col-12 d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                <FaArrowLeft /> Kembali
              </Button>
              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave /> Perbarui
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormEditDataStruk;
