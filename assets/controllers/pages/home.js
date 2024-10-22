import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { userState } from '../blocks/userprofile';

const Home = () => {
    const typeKeys = Object.keys(userState.vehicleType); 
    const [activeTab, setActiveTab] = useState(typeKeys[0]); 
    const [tabs, setTabs] = useState([]);
    
    const fetchTabs = async () => {
        try {
            const response = await axios.get(`/select_by_type/${activeTab}`);
            setTabs(response.data); 
        } catch (error) {
            console.error('Error fetching tabs:', error);
        }
    };

    useEffect(() => {
        fetchTabs();
    }, [activeTab]); 

    const handleTabClick = (id) => {

        setActiveTab(id); 
        fetchTabs(id)
        
    };


    return (
        <>
        <div className="main">
            <div className="hero">
                <div className="container">
                <div className="row justify-content-between">
                    <div className="col-lg-5 mt-5">
                    <div className="intro-excerpt mt-5">
                        <h1>Choose Your <span className="d-block" style={{ color: '#f9bf29' }}>Vehicle</span></h1>
                    </div>
                    </div>
                    <div className="col-lg-7">
                    <div className="position-relative">
                        <img className="dots-light" src="../images/dots-light.png?" />
                        <Carousel>
                                <Carousel.Item>
                                <img className="home-slider" src="../images/car.png?v=1" alt="First slide" />
                                </Carousel.Item>

                                <Carousel.Item>
                                <img className="home-slider" src="../images/truck.png?v=2.1" alt="Second slide" />
                                </Carousel.Item>
                                
                                <Carousel.Item>
                                <img className="home-slider" src="../images/motorcycle.png?v=1" alt="Third slide" />
                                </Carousel.Item>
                        </Carousel>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="product-section">
                <div className="container">
                        <div className="js-tabs hb-tabs tab-titles d-flex justify-content-center mb-5" data-existing-hx="h3" data-tabs-prefix-class="hb">
                            <div className="px-5 js-tablist hb-tabs__nav">
                            {
                                typeKeys.map((category) => ( 
                                    <div key={category} onClick={() => handleTabClick(category)} className={activeTab === category ? 'active js-tablist__item hb-tabs__nav-list-item' : 'js-tablist__item hb-tabs__nav-list-item position-relative'}>{category}</div>
                                ))
                            }
                            </div>
                        </div>
                        
                </div>
                <div className="row container">

                    {/* Product Items */}
                    {tabs.map((product, index) => (
                    <div className="col-md-6 col-lg-4 mb-3" key={index}>
                        <a className="product-item p-3" href={'/'+ tabs[0].type.toLowerCase() +'/' + product.id}>
                            <div className='mb-3 product-thumbnail' style={{
                                backgroundImage: `url('../images/${tabs[0].type}/${product.id}/${product.id}.jpg')`,
                                backgroundSize: 'cover',  // Optional: Cover to ensure the image covers the whole div
                                backgroundPosition: 'center',  // Optional: Center the image
                                width: '100%',
                                height: '350px'
                            }}>
                            </div>
                            <div className="col-11 mx-auto row">
                                <h4 className="product-title">{product.brand} {product.model}</h4>
                                {
                                    userState.vehicleType[activeTab].map((info, index) => (
                                        <div key={index} className="d-flex justify-content-between col-11 mx-auto mb-3">
                                            <div className='d-flex'>
                                                <img style={{width:"25px"}} className="img-fluid me-3" src={`../images/${info}.png`} alt={info} />
                                                <div>{info}</div>
                                            </div>
                                            <div>{product[info]}</div>
                                        </div>
                                    ))
                                }
                                <hr/>
                                <strong className="product-price">$ {new Intl.NumberFormat('en-US').format(product.price)}</strong>
                            </div>
                        </a>
                    </div>
                    ))}
                </div>
            
            </div>
        </div>
        </>
    );
}

export default Home;