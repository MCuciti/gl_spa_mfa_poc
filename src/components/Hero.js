import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Example MFA Auth Demo</h1>

    <p className="lead">
      This is a full stack example for how universal login flow and MFA may be implemented in the member platform
    </p>
  </div>
);

export default Hero;
