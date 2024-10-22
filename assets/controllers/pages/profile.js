import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import { userState } from '../blocks/userprofile';
import { useNavigate } from 'react-router-dom';  

const Profile = observer(() => {

    const [followedVehicles, setFollowed] = useState([]);
    const navigate = useNavigate();

    // GET USER LIKED VEHICLES
    useEffect(() => {
        if (userState.user && !userState.loading) {
            const fetchFollowedVehicles = async () => {
                try {
                    const response = await axios.post('/followed', {
                        followed: userState.user.followed, 
                    }, {
                        headers: {
                            'Content-Type': 'application/json', 
                        }
                    });
                    
                    setFollowed(response.data);
                } catch (error) {
                    console.error('Error fetching followed vehicles:', error);
                }
            };
            
            fetchFollowedVehicles();
        }else if(!userState.user && !userState.loading){
            navigate('/');
        }

    }, [userState.user, navigate]);

    return (
        <> 
        <div className="main">
            {userState.user && (
                <div>
                    <div className="hero">
                        <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-5">
                                <div className="intro-excerpt">
                                    <h1>Your followed <span className="d-block" style={{ color: '#f9bf29' }}>Vehicles!</span></h1>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='container'>
                        <div>
                            <div className="followedVehicles product-section">
                                <div className="row container">
                                {followedVehicles.length > 0 ? (
                                    followedVehicles.map((vehicle, index) => (
                                        <div className="col-md-6 col-lg-4 mb-3" key={index}>
                                            <a className="product-item p-3" href={'/'+ vehicle.type.toLowerCase() +'/' + vehicle.id}>
                                                <div className='mb-3 product-thumbnail' style={{
                                                    backgroundImage: `url('../images/${vehicle.type}/${vehicle.id}/${vehicle.id}.jpg')`,
                                                    backgroundSize: 'cover',  
                                                    backgroundPosition: 'center',  
                                                    width: '100%',
                                                    height: '350px'
                                                }}>
                                                </div>
                                                <div className="col-11 mx-auto row">
                                                    <h4 className="product-title">{vehicle.brand} {vehicle.model}</h4>
                                                    {
                                                        userState.vehicleType[vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)].map((info, index) => (
                                                            <div key={index} className="d-flex justify-content-between col-11 mx-auto mb-3">
                                                                <div className='d-flex'>
                                                                    <img style={{width:"25px"}} className="img-fluid" src={`../images/${info}.png`} alt={info} />
                                                                    <div>{info}</div>
                                                                </div>
                                                                <div>
                                                                    {(() => {
                                                                    if (info === 'Engine Capacity') {
                                                                                return new Intl.NumberFormat('en-US').format(vehicle[info]) + 'cm³';
                                                                            } else if (info === 'Load Capacity') {
                                                                                return vehicle[info] + 'kg';
                                                                            } else {
                                                                                return vehicle[info];
                                                                            }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    <hr/>
                                                    <strong className="product-price">$ {new Intl.NumberFormat('en-US').format(vehicle.price)}</strong>
                                                </div>
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p>No followed vehicles available.</p>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
});

export default Profile;