import React, { useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { X, CheckCircle, Store, Tag, ShoppingBag, ReceiptText, Printer } from 'lucide-react';

const PaymentModal = ({ onClose, vendor, totalAmount, onPaymentProcessed, cart }) => {
  const [completed, setCompleted] = useState(false);

  const completeDemo = () => {
    setCompleted(true);
    onPaymentProcessed();
  };

  function formatPrice(price) {
    return `₦${price.toLocaleString()}`;
  }

  const demoUrl = new URL('/demo-checkout', window.location.origin);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          aria-label="Close demo checkout"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {!completed && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Demo checkout
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <div className="flex items-center text-blue-800 mb-2">
                <Store className="w-5 h-5 mr-2" />
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">{vendor.description}</p>
              <div className="flex items-center text-gray-700">
                <Tag className="w-4 h-4 mr-2" />
                <span className="text-sm">QR Account: <strong>{vendor.qrAccount}</strong></span>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 mb-2">Total Amount:</p>
              <p className="text-4xl font-extrabold text-green-600">
                {formatPrice(totalAmount)}
              </p>
            </div>

            <div className="flex flex-col items-center mb-6">
              <p className="text-gray-700 mb-3">Scan to open the demo checkout information page.</p>
              <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-md">
                <QRCodeSVG
                  value={demoUrl.href}
                  size={200}
                  level="H"
                  marginSize={4}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                To finish the demo, use the button below. No money moves.
              </p>
              <button
                onClick={completeDemo}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Simulate checkout
              </button>
            </div>
          </>
        )}

        {completed && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <ReceiptText className="w-8 h-8 mr-3 text-blue-600" />
              Demo receipt
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <div className="flex items-center text-blue-800 mb-2">
                <Store className="w-5 h-5 mr-2" />
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
              </div>
              <p className="text-gray-700 text-sm">QR Account: <strong>{vendor.qrAccount}</strong></p>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-2">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="border-b bg-gray-100 sticky top-0">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Item</th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">Qty</th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">Price</th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{formatPrice(item.price)}</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <span className="text-xl font-bold text-gray-800">Demo total:</span>
              <span className="text-3xl font-extrabold text-green-700">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <p className="text-sm text-gray-500 text-center mb-4">
              Simulation only. No payment was collected.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
            {/* Optional: Print/Download buttons */}
            <div className="flex justify-center mt-2 space-x-2">
                <button
                    onClick={() => window.print()}
                    className="flex items-center text-gray-600 hover:text-gray-800 text-sm py-1 px-2 rounded"
                >
                    <Printer className="w-4 h-4 mr-1" /> Print
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;