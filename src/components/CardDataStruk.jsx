import React from 'react'
import { useState } from 'react';
import { Container, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const CardDataStruk = () => {
    const [dataStruk, setDataStruk] = useState([]);
    const [loading, setLoadling] = useState(null);

  return (
    <Container className='p-3'>
        <h2 className='mt-5 pt-5 text-blue fw-bold'>Data Struk</h2>
        <div className='mb-2 d-flex justify-content-end'>
                <FaSearch size={24} />
            <input placeholder='Masukkan Nama Invoice' className='form-control w-25 rounded ms-2 mb-2 px-2 py-1'></input>
        </div>
        <div>
            <Table className='custom-table'>
                <thead className='custom-table'>
                    <tr>
                        <th>No</th>
                        <th>Nama Invoice</th>
                        <th>Status</th>
                        <th>Tindakan</th>
                    </tr>
                </thead>
                <tbody>
                    {dataStruk.map((dataStruk, index) => (
                        <tr key={dataStruk.id}>
                            <td>{index + 1}</td>
                            <td>{dataStruk.namaInvoice}</td>
                            <td>{dataStruk.status}</td>
                            <td>
                            <Link
                                to={`/data-struk/edit/${dataStruk.id}`}
                                className='btn btn-sm btn-primary me-2 text-white'
                                >
                                <FaEdit />
                             </Link>
                             <Button
                             variant='danger'
                             size="sm"
                            //  onClick={() => handleDeleteClick(dataStruk.id)}
                            className='me-2 mt-1 mb-lg-1'
                             >
                                <FaTrash />
                             </Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </div>
    </Container>
  )
}

export default CardDataStruk