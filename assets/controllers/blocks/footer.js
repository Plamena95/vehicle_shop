import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-section" style={{background: "rgb(229, 229, 231)"}}>
          <div className="container relative">
            <div className="row g-5 mb-5 justify-content-between">
              <div>
                <div className="mb-4 footer-logo-wrap">
                  <a href="/" className="footer-logo fw-bold">Vehicles<span className='fw-bold color-secondary'>.</span></a>
                </div>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <ul className="list-unstyled custom-social">
                  <li><a href="#"><span className="fa fa-brands fa-facebook-f"></span></a></li>
                  <li><a href="#"><span className="fa fa-brands fa-twitter"></span></a></li>
                  <li><a href="#"><span className="fa fa-brands fa-instagram"></span></a></li>
                  <li><a href="#"><span className="fa fa-brands fa-linkedin"></span></a></li>
                </ul>
              </div>
            </div>

            <div className="border-top copyright">
              <div className="row pt-4">
                <div className="col-lg-6">
                  <p className="mb-2 text-center text-lg-start">
                    Copyright &copy; {new Date().getFullYear()}. All Rights Reserved. &mdash; Designed by Plamena Zhelyazkova
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
    );
};

export default Footer;