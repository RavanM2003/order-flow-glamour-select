import { Route, Routes } from "react-router-dom";
import ServiceList from "./components/ServiceList";
import ServiceDetail from "./components/ServiceDetail";
import ServiceForm from "./components/ServiceForm";

const ServiceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ServiceList />} />
      <Route path="/create" element={<ServiceForm />} />
      <Route path="/:id" element={<ServiceDetail />} />
      <Route path="/:id/edit" element={<ServiceForm />} />
    </Routes>
  );
};

export default ServiceRoutes;
