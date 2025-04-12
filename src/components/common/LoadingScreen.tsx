import React from 'react';
import  './css/loadingscreen.css'; // Make sure to create this CSS file

const LoadingScreen: React.FC = () => {
  //console.log('Loading...')
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img
         src="/loading.gif" alt="Loading..." />
      </div>
    </div>
  );
};

export default LoadingScreen;