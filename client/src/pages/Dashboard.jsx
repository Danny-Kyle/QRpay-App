import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/AppContext";
import {
  Package,
  Store,
  User,
  ChevronDown,
  ChevronRight,
  Tag,
  ShoppingBag,
} from "lucide-react";
import vendorsData from "../lib/vendorsData.json";

const Dashboard = () => {
  const { userData } = useContext(AppContext);
  const [ vendors, setVendors ] = useState([]);
  const [ expandedVendor, setExpandedVendor ] = useState(null);
  const [ loading, setLoading ] = useState(true);
//   const viewvendor = vendorsData.vendors;

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setVendors(vendorsData.vendors);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vendor data:', error);
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
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-200 to-pink-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {userData ? userData.name : "Student"} to CalebEats LIVE!
          </h1>
          <p className="text-gray-600">
            Click on vendor to expand and view their items
          </p>
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
            <div onClick={() => handleVendorClick(vendor.id)} className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
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
                    ? 'max-h-screen opacity-100' 
                    : 'max-h-0 opacity-0'
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
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ShoppingBag className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500">ID: {item.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-xs text-gray-500">NGN</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Store Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">
                          {vendor.items.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Items</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(vendor.items.reduce((sum, item) => sum + item.price, 0))}
                        </div>
                        <div className="text-sm text-gray-600">Total Value</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">
                          {formatPrice(Math.round(vendor.items.reduce((sum, item) => sum + item.price, 0) / vendor.items.length))}
                        </div>
                        <div className="text-sm text-gray-600">Avg Price</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-orange-600">
                          {formatPrice(Math.min(...vendor.items.map(item => item.price)))} - {formatPrice(Math.max(...vendor.items.map(item => item.price)))}
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
      </div>
    </div>
  );
};

export default Dashboard;
