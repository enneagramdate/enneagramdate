import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();


  return (
    <div className="btm-nav">
  <button className="bg-pink-200 text-pink-600" onClick={() => navigate('/profile')}>
    <span className="btm-nav-label">Profile</span>
  </button>
  <button className="active bg-blue-200 text-blue-600 border-blue-600" onClick={() => navigate('/recs')}>
    <span className="btm-nav-label">Recs</span>
  </button>
  <button className="bg-teal-200 text-teal-600" onClick={() => navigate('/matches')}>
    <span className="btm-nav-label">Matches</span>
  </button>
</div>
  )
}

export default NavBar;