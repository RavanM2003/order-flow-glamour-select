
import { useEffect, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { usePagination } from "@/hooks/use-pagination";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/models/customer.model";
import CustomersHeader from "./customers/CustomersHeader";
import CustomersTable from "./customers/CustomersTable";
import CustomersModals from "./customers/CustomersModals";

const ITEMS_PER_PAGE = 10;

const CustomersTab = () => {
  const { customers, isLoading, error, fetchCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomerForOrders, setSelectedCustomerForOrders] = useState<Customer | null>(null);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
  const [selectedCustomerForAppointment, setSelectedCustomerForAppointment] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const safeCustomers = Array.isArray(customers) ? customers : [];
  
  const filteredCustomers = safeCustomers.filter(
    (customer) =>
      (customer.full_name || customer.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage
  } = usePagination({
    items: filteredCustomers,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const handleViewOrders = (customer: Customer) => {
    setSelectedCustomerForOrders(customer);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomerForDetails(customer);
  };

  const handleCreateAppointment = (customer: Customer) => {
    setSelectedCustomerForAppointment(customer);
  };

  return (
    <Card>
      <CustomersHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => setIsFormOpen(true)}
      />
      <CardContent className="p-0 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading customers...</div>
        ) : error ? (
          <div className="text-red-500 p-8 text-center">Error: {error}</div>
        ) : (
          <>
            <CustomersTable
              customers={paginatedItems}
              onViewOrders={handleViewOrders}
              onCreateAppointment={handleCreateAppointment}
              onViewDetails={handleViewDetails}
              className="px-4 sm:px-0"
            />
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    {hasPrevPage && (
                      <PaginationItem>
                        <PaginationPrevious onClick={prevPage} />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => goToPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {hasNextPage && (
                      <PaginationItem>
                        <PaginationNext onClick={nextPage} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CustomersModals
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        selectedCustomerForDetails={selectedCustomerForDetails}
        setSelectedCustomerForDetails={setSelectedCustomerForDetails}
        selectedCustomerForOrders={selectedCustomerForOrders}
        setSelectedCustomerForOrders={setSelectedCustomerForOrders}
        selectedCustomerForAppointment={selectedCustomerForAppointment}
        setSelectedCustomerForAppointment={setSelectedCustomerForAppointment}
        fetchCustomers={fetchCustomers}
      />
    </Card>
  );
};

export default CustomersTab;
