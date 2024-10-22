import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { userState } from '../blocks/userprofile';
import Carousel from 'react-bootstrap/Carousel';

const Vehicle = () => {
    const { type, id } = useParams(); // Extract type and id from URL
    const [vehicle, setVehicle] = useState([]); // Correctly initialize state
    const [message, followingMessage] = useState(false); 

  
    const fetchVehicleData = async () => {
        try {
            const response = await axios.get(`/vehicle/${type}/${id}`); 
            setVehicle(response.data);
            followingMessage(response.data[0].isFollowing)
        } catch (error) {
            window.location.href = '/not-found';
        }
    };

    const followVehicle = async () => {
        try {
            const response = await axios.get(`/follow/${type}/${id}`);
            if(response.data.message == 'You are not logged in.'){
                userState.toggleModal(true);
            }else{
                followingMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error following vehicle:', error); // Handle errors
        }
    };

    const renderImages = () => {
        const elements = [];
        const imageCount = vehicle[0]?.image_count || 0; // Safe access

        for (let i = 0; i < imageCount; i++) {
            const name = i === 0 ? vehicle[0].id : `${vehicle[0].id}-${i + 1}`;
            elements.push(
                <Carousel.Item key={i}>
                    <img className='border-radius'
                        src={`../images/${vehicle[0].type}/${vehicle[0].id}/${name}.jpg`} // Corrected template literal
                        alt={`Vehicle image ${i + 1}`} 
                        style={{width:'100%',minHeight: "500px"}}
                    />
                </Carousel.Item>
            );
        }
        return elements;
    };

    // useEffect to fetch data when type or id changes
    useEffect(() => {
        fetchVehicleData(); // Call the fetch function
    }, [type, id]); // Run when type or id changes

    return (
        <>
        <div className='container row main'>
            {vehicle.map((v, index) => ( // Iterate through the vehicle array
                <div className='row justify-content-between' style={{ margin: '5rem 0px' }} key={index}>
                    <div className='col-12 col-lg-6 position-relative'>
                    <div className='like-section bg-white position-absolute cursor-pointer' onClick={() => followVehicle(id)}>
                        {message ? <i className="fa-solid fa-heart color-secondary"></i> : <i className="fa-regular fa-heart color-secondary"></i>}
                    </div>
                    <Carousel>
                            {renderImages()}
                    </Carousel>
                    </div>
                    <div className='col-12 col-lg-5 mt-5 mt-lg-0 border-radius p-5' style={{boxShadow: "0px 0px 49px 0px rgba(229, 229, 231, 1)",background:"rgba(229, 229, 231, 1)"}}>
                        <div className='row mb-4'>
                            <h1 className='col-6'>{v.brand} <span className='color-secondary'>{v.model}</span></h1>
                            <h1 className='col-6 text-end'>$ {new Intl.NumberFormat('en-US').format(v.price)}</h1>
                        </div>
                        <div>
                            <h4 className='details_section_title'>Details</h4>
                            <div className='row h4'>
                                {
                                    userState.vehicleType[v.type.charAt(0).toUpperCase() + v.type.slice(1)].map((info, index) => (
                                        <div key={index} className="d-flex justify-content-between mx-auto mb-3">
                                            <div className='d-flex'>
                                                <img style={{width:"25px"}} className="img-fluid me-2" src={`../images/${info}.png`} alt={info} />
                                                <div>{info}</div>
                                            </div>
                                            <div>
                                            {(() => {
                                                if (info === 'Engine Capacity') {
                                                    return new Intl.NumberFormat('en-US').format(v[info]) + 'cm³';
                                                } else if (info === 'Load Capacity') {
                                                    return v[info] + 'kg';
                                                } else {
                                                    return v[info];
                                                }
                                            })()}
                                            </div>
                                        </div>
                                    ))
                                }
                                <div key={index} className="d-flex justify-content-between mx-auto mb-3">
                                    <div className='d-flex'>
                                        <div><span className="text-muted fw-bold">Quantity:</span></div>
                                    </div>
                                    <div>{v.quantity}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className='details_section_title'>You May Also Like</div>
                        <div className='product-section row py-2'>
                            {v.more_vehicles.map((item,i) => (
                                <div className="col-12 col-md-6 col-lg-3 mb-3" key={i}>
                                    <a className="product-item p-3" href={'/'+ v.type +'/' + item.id}>
                                    <div className='mb-5 product-thumbnail' style={{
                                        backgroundImage: `url('../images/${v.type}/${item.id}/${item.id}.jpg')`,
                                        backgroundSize: 'cover',  // Optional: Cover to ensure the image covers the whole div
                                        backgroundPosition: 'center',  // Optional: Center the image
                                        width: '100%',
                                        height: '350px'
                                    }}>
                                    </div>
                                    <div className="col-11 mx-auto row">
                                        <h4 className="product-title">{item.brand} {item.model}</h4>
                                        {
                                            userState.vehicleType[v.type.charAt(0).toUpperCase() + v.type.slice(1)].map((info, index) => (
                                                <div key={index} className="d-flex justify-content-between col-11 mx-auto mb-3">
                                                    <div className='d-flex'>
                                                        <img style={{width:"25px"}} className="img-fluid" src={`../images/${info}.png`} alt={info} />
                                                        <div>{info}</div>
                                                    </div>
                                                    <div>
                                                    {(() => {
                                                        if (info === 'Engine Capacity') {
                                                                return new Intl.NumberFormat('en-US').format(item[info]) + 'cm³';
                                                            } else if (info === 'Load Capacity') {
                                                                return item[info] + 'kg';
                                                            } else {
                                                                return item[info];
                                                            }
                                                    })()}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <hr/>
                                        <strong className="product-price">$ {new Intl.NumberFormat('en-US').format(v.price)}</strong>
                                    </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
              </div>
            ))}
        </div>
        </>
    );
}

export default Vehicle;