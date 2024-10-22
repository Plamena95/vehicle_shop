import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const VehicleModal = ({ isOpen, onRequestClose, vehicleTypes }) => {
    const [selectedType, setSelectedType] = useState('car');
    const [uploadedID, setUploadedID] = useState();
    const [file, setFile] = useState(null);
    const [modalContent, setModalContent] = useState('form');
    const { register, handleSubmit, reset } = useForm();
    const [imageInputs, setImageInputs] = useState([{ id: 1 }]);
    const [uploadDisabled, setUploadDisabled] = useState([]);

    const vehicleAttributes = {
        car: [['engine_capacity', 'text'], ['colour', 'text'], ['doors', 'number'], ['category', vehicleTypes]],
        motorcycle: [['engine_capacity', 'number'], ['colour', 'text']],
        truck: [['load_capacity', 'number'], ['axles', 'number']],
        trailer: [['load_capacity', 'number'], ['axles', 'number']],
    };

    // ADDING VEHICLE 
    const submitProduct = (data) => {
        axios.post('/make-product', data)
            .then(response => {
                setUploadedID(response.data.id); 
                setModalContent('imageUpload');
            })
            .catch(error => console.error('Product submission error:', error));
    };

    // ADDING NEW IMAGES TO VEHICLE 
    const addNewImage = () => {
        setImageInputs([...imageInputs, { id: imageInputs.length + 1 }]); 
    };

    const submitImage = async (e,id) => {
        e.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('id', uploadedID);
            formData.append('type', selectedType); // Include the current vehicle type
            console.log(uploadedID)
            // Validate image extension
            const extension = file.name.split('.').pop().toLowerCase();
            if (extension !== 'jpg') {
                alert('Invalid file extension. Please upload a .jpg file.');
                return;
            }

            try {
                await fetch('/upload-image', { method: 'POST', body: formData });

                setUploadDisabled(prev => {
                    const newDisabled = [...prev];
                    newDisabled[id - 1] = true;
                    return newDisabled;
                });
                
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        } else {
            alert('No file selected for upload.');
        }
    };

    const handleImageChange = (e) => setFile(e.target.files[0]);

    useEffect(() => {
        reset(); 
        setModalContent('form')
    }, [isOpen, reset]);

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} appElement={document.getElementById('container')}  style={{zIndex:"1000"}}>
            <div className='close-modal-button cursor-pointer' onClick={onRequestClose}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            {modalContent === 'form' ? (
                <form onSubmit={handleSubmit(submitProduct)}>
                    <div className="form-group">
                        <h2>Upload Vehicle</h2>
                    </div>

                    <div className="form-group">
                        <label htmlFor="vehicleType">Select Vehicle Type:</label>
                        <select
                            id="vehicleType"
                            className="form-control"
                            {...register('type', { onChange: (e) => {
                                setSelectedType(e.target.value); 
                                reset()
                            }})}
                            value={selectedType} 
                        >
                            {Object.keys(vehicleAttributes).map((category) => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="brandinput">Enter Brand</label>
                        <input type="text" className="form-control" id="brandinput" {...register('brand')} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modelinput">Enter Model</label>
                        <input type="text" className="form-control" id="modelinput" {...register('model')} />
                    </div>

                    {vehicleAttributes[selectedType].map(([field, type]) => (
                        <div key={field} className="form-group">
                            <label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}:</label>
                            {Array.isArray(type) ? (
                                <select id={field} className="form-control" {...register(field)}>
                                    {vehicleTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type_name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input type={type} className="form-control" id={field} {...register(field)} />
                            )}
                        </div>
                    ))}

                    <div className="form-group">
                        <label htmlFor="priceinput">Enter Price</label>
                        <input type="number" className="form-control" id="priceinput" {...register('price')} />
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="btn custom-button col-3">Submit</button>
                    </div>
                </form>
            ) : (
                <div className='my-5 col-11 mx-auto'>
                    <h2>Upload Images</h2>
                    {imageInputs.map((input, index) => (
                        <div className="row mt-3" key={input.id}>
                            <div className="form-group col-10">
                                <input 
                                className="form-control" 
                                type="file" 
                                id={`imageinput-${input.id}`} 
                                onChange={(e) => handleImageChange(e, input.id)} 
                                />
                            </div>
                            <div className="col-2">
                                <button type="submit" disabled={uploadDisabled[input.id - 1]} onClick={(e) => submitImage(e, input.id)} className="btn custom-button col-12 h-100">Upload Image</button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-3">
                        <button type="button" onClick={addNewImage} className="btn custom-button">Add more</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default VehicleModal;