import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';

const PaymentDetails = () => {
  const { order, selectedService, selectedStaff, selectedTime, selectedCustomer } = useContext(OrderContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalPrice = selectedService ? selectedService.price : 0;
  const formattedDate = selectedTime ? new Date(selectedTime).toLocaleDateString() : 'N/A';
  const formattedTime = selectedTime ? new Date(selectedTime).toLocaleTimeString() : 'N/A';

  const handleConfirmPayment = () => {
    toast({
      title: "Ödəniş təsdiqləndi",
      description: "Ödəniş uğurla tamamlandı!",
    });
    navigate('/confirmation');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Ödəniş Detalları</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">Zəhmət olmasa aşağıdakı məlumatları yoxlayın və ödənişi təsdiqləyin.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Müştəri Məlumatı</h3>
          <p><span className="font-medium">Ad:</span> {selectedCustomer?.name}</p>
          <p><span className="font-medium">Email:</span> {selectedCustomer?.email}</p>
          <p><span className="font-medium">Telefon:</span> {selectedCustomer?.phone}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Xidmət Məlumatı</h3>
          <p><span className="font-medium">Xidmət:</span> {selectedService?.name}</p>
          <p><span className="font-medium">Təchizatçı:</span> {selectedStaff?.name}</p>
          <p><span className="font-medium">Tarix:</span> {formattedDate}</p>
          <p><span className="font-medium">Saat:</span> {formattedTime}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Toplam Qiymət</h3>
        <p className="text-green-600 text-xl">{totalPrice} AZN</p>
      </div>
      
      <div>
        <button 
          onClick={handleConfirmPayment}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Ödənişi Təsdiqlə
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;
