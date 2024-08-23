import React from 'react';

const ConfirmationPage = () => {
  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-sm text-center">
      <h1 className="text-success">Thank you for your purchase!</h1>
      <p>Your payment was successful.</p>
      <p>We are processing your order and will send you an email confirmation shortly.</p>
    </div>
  );
};

export default ConfirmationPage;
