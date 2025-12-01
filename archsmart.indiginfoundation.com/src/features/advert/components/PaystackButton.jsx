import React from "react";

const PaystackButton = ({ email, amount, onSuccess }) => {
  const paystackPublicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "pk_test_xxxx"; // Replace with your test/live key

  const handlePay = () => {
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: paystackPublicKey,
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      currency: "GHS",
      callback: function (response) {
        // response.reference
        if (onSuccess) onSuccess(response.reference);
      },
      onClose: function () {
        alert("Payment window closed");
      },
    });
    if (handler) handler.openIframe();
  };

  return (
    <button
      type="button"
      className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
      onClick={handlePay}
    >
      Pay (Card or MTN Mobile Money)
    </button>
  );
};

export default PaystackButton;
