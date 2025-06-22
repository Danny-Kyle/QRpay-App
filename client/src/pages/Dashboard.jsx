import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/AppContext";
import PaymentModal from "../components/PaymentModal";
import { Store, Package, User, ChevronDown, ChevronRight, Tag, ShoppingBag, Plus, Minus, ShoppingCart, Trash2, X } from 'lucide-react';
import vendorsData from "../lib/vendorsData.json";

const Dashboard = () => {
  const { userData } = useContext(AppContext);
  const [vendors, setVendors] = useState([]);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentCartVendorId, setCurrentCartVendorId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentVendorDetails, setPaymentVendorDetails] = useState(null);
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);

  //   const viewvendor = vendorsData.vendors;

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setVendors(vendorsData.vendors);
        setLoading(false);
      } catch (error) {
        console.error("Error loading vendor data:", error);
        setLoading(false);
      }
    };

    loadVendorData();
  }, []);

  // function viewVendor(){
  //     console.log(vendorsData)
  // }

  const handleVendorClick = (vendorId) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }

    // Find the vendor details for the items currently in the cart
    const vendorForCheckout = vendors.find(v => v.id === currentCartVendorId);

    if (vendorForCheckout) {
      setPaymentVendorDetails(vendorForCheckout);
      setIsPaymentModalOpen(true);
      setIsPaymentProcessed(false); // Reset payment status when opening modal
    } else {
      alert("Could not find vendor details for checkout. Please try again.");
    }
  };

  const handlePaymentProcessed = () => {
    setIsPaymentProcessed(true); // Set state to true when payment is processed
    // In a real application, after successful payment, you would:
    // 1. Clear the cart
    // 2. Potentially navigate to an order confirmation page
    // 3. Update user's wallet balance
    // 4. Send order to backend
    // document.getElementById('payment-processed-modal').style.display = 'flex'; // Show the "Payment Processed" modal
    // setTimeout(() => {
    //   setIsPaymentModalOpen(false); // Close the main modal after a delay
    //   clearCart(); // Clear the cart
    //   setIsPaymentProcessed(false); // Reset payment status
    // }, 3000); // Close after 3 seconds for demo
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setIsPaymentProcessed(false); // Reset this when closing the main modal
    if (isPaymentProcessed) { // Only clear cart if payment was actually processed
      clearCart(); // Clear the cart after successful payment simulation
    }
    // document.getElementById('payment-processed-modal').style.display = 'none'; // Ensure the sub-modal is hidden
  };

  const addToCart = (item, vendorName, vendorId) => {
    setCart((prevCart) => {
      if (prevCart.length > 0 && currentCartVendorId !== vendorId) {
        alert(`You can only order from one vendor at a time. Please clear your cart to order from ${vendorName}.`);
        return prevCart;
      }

      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        if (prevCart.length === 0) {
          setCurrentCartVendorId(vendorId);
        }
        return [...prevCart, { ...item, quantity: 1, vendorName }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.id !== itemId);
      }
    });
  };

  const removeItemCompletely = (itemId) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== itemId)
    );
  };

  const clearCart = () => {
    setCart([]);
    setCurrentCartVendorId(null);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  function formatPrice(price) {
    return `₦${price.toLocaleString()}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 pb-32 bg-gradient-to-br from-blue-200 to-pink-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {userData ? userData.name : "Student"} to CalebEats LIVE!
          </h1>
          <p className="text-gray-600">
            Click on vendor to expand, view their items and select the items
            you'd like to purchase
          </p>
          {cart.length > 0 && (
            <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="font-semibold">
                {getTotalItems()} items in cart
              </span>
            </div>
          )}
        </div>
      </div>

      {/*vendor data */}
      <div className="space-y-6">
        {/* <button onClick={viewVendor} >Vendor</button> */}
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div
              onClick={() => handleVendorClick(vendor.id)}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-8 h-8 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">{vendor.name}</h2>
                    <p className="text-blue-100 mt-1">{vendor.description}</p>
                    <p className="text-blue-200 text-sm mt-1">
                      {vendor.items.length} items available
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {expandedVendor === vendor.id ? (
                    <ChevronDown className="w-6 h-6 transform transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-6 h-6 transform transition-transform duration-200" />
                  )}
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-auto ${
                expandedVendor === vendor.id
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 bg-gray-50">
                <div className="flex items-center mb-4">
                  <Package className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Available Items ({vendor.items.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {vendor.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 relative"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShoppingBag className="w-4 h-4 text-gray-500 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              ID: {item.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-xs text-gray-500">NGN</div>
                        </div>
                      </div>
                      {/* Add to Cart*/}
                      {hoveredItem === item.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg transition-all duration-200">
                          <button
                            onClick={() => addToCart(item, vendor.name, vendor.id)}
                            disabled={cart.length > 0 && currentCartVendorId !== vendor.id}
                            className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-200 
                              ${cart.length > 0 && currentCartVendorId !== vendor.id ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
                              `}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Store Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {vendor.items.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Items</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">
                        {formatPrice(
                          vendor.items.reduce(
                            (sum, item) => sum + item.price,
                            0
                          )
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Total Value</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">
                        {formatPrice(
                          Math.round(
                            vendor.items.reduce(
                              (sum, item) => sum + item.price,
                              0
                            ) / vendor.items.length
                          )
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Avg Price</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-orange-600">
                        {formatPrice(
                          Math.min(...vendor.items.map((item) => item.price))
                        )}{" "}
                        -{" "}
                        {formatPrice(
                          Math.max(...vendor.items.map((item) => item.price))
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Price Range</div>
                    </div>
                  </div>

                  {/* QR Account Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        QR Account: <strong>{vendor.qrAccount}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      <div className="flex flex-row justify-between">
        <div>Wallet Balance: {userData.wallet}</div>
        <div>Deposit Component caller</div>
      </div>
    </div>

 {/* Shopping Cart - Fixed at bottom */}
 {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gray-200 p-6 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ShoppingCart className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">Shopping Cart</h3>
                <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {getTotalItems()} items
                </span>
              </div>
              <button
                onClick={clearCart}
                className="flex items-center text-red-600 hover:text-red-700 font-semibold"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto mb-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center flex-1">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">from {item.vendorName}</p>
                      </div>
                      <div className="flex items-center mx-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-3 font-semibold text-gray-800 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item, item.vendorName)}
                          className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                      <button
                        onClick={() => removeItemCompletely(item.id)}
                        className="ml-3 p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-lg">
                  <span className="text-gray-600">Total: </span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <button onClick={handleCheckout} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200">
                  Checkout ({getTotalItems()} items)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/**Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal} // Use the new close handler
        vendor={paymentVendorDetails}
        totalAmount={getTotalPrice()}
        onPaymentProcessed={handlePaymentProcessed} 
        cart = {cart}// Pass the payment processed handler
      />
    </div>
  );
};

export default Dashboard;
