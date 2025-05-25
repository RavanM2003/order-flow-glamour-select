import { useNavigate } from "react-router-dom";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/hooks/use-toast";

const CustomerInfo = ({ customer }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Müştəri Məlumatı</h3>
    <p>
      <span className="font-medium">Ad:</span> {customer?.name}
    </p>
    <p>
      <span className="font-medium">Email:</span> {customer?.email}
    </p>
    <p>
      <span className="font-medium">Telefon:</span> {customer?.phone}
    </p>
  </div>
);

const ServiceInfo = ({
  selectedService,
  selectedStaff,
  formattedDate,
  formattedTime,
}) => (
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Xidmət Məlumatı</h3>
    <p>
      <span className="font-medium">Xidmət:</span> {selectedService?.name}
    </p>
    <p>
      <span className="font-medium">Təchizatçı:</span> {selectedStaff?.name}
    </p>
    <p>
      <span className="font-medium">Tarix:</span> {formattedDate}
    </p>
    <p>
      <span className="font-medium">Saat:</span> {formattedTime}
    </p>
  </div>
);

const PaymentDetails = () => {
  const { orderState, calculateTotal } = useOrder();
  const {
    selectedService,
    selectedStaff,
    appointmentDate,
    appointmentTime,
    customer,
  } = orderState;
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalPrice = calculateTotal();
  const formattedDate = appointmentDate
    ? appointmentDate.toLocaleDateString()
    : "N/A";
  const formattedTime = appointmentTime || "N/A";

  const handleConfirmPayment = () => {
    toast({
      title: "Ödəniş təsdiqləndi",
      description: "Ödəniş uğurla tamamlandı!",
    });
    navigate("/confirmation");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Ödəniş Detalları</h2>
      <div className="mb-6">
        <p className="text-gray-600">
          Zəhmət olmasa aşağıdakı məlumatları yoxlayın və ödənişi təsdiqləyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CustomerInfo customer={customer} />
        <ServiceInfo
          selectedService={selectedService}
          selectedStaff={selectedStaff}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
        />
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
