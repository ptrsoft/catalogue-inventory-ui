import React, { Component } from "react";
import { Box, Button } from "@mui/material";
import { connect } from "react-redux";
import status from "Redux-Store/Constants";
import { fetchCustomers } from "Redux-Store/Customers/CustomersThunk";
import { Loader } from "Utils/helperFunctions";
import GridTableWithPagination from "../Components/GridTableWithPagination";
import { Link } from "react-router-dom";
import TablesHeaderFilters from "Views/Postlogin/Components/TablesHeaderFilters";
import { QUOTATIONS_FILTER_STATUS } from "CommonData";
const columns = [
  {
    field: "customer_name",
    headerName: "Customer Name",
    width: 150,
    renderCell: (params) => <Link to={params.value}>{params.value}</Link>,
  },
  {
    field: "email",
    headerName: "Email",
    width: 180,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "shipping_address",
    headerName: "Shipping Address",
    width: 250,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "added_by",
    headerName: "Added By",
    width: 130,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "added_on",
    headerName: "Added On",
    width: 180,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "last_order",
    headerName: "Last Order",
    width: 180,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 240,
  
    renderCell: (data) => {
      return (
        <div className="table-btns">
          <Button className="primary-outline" variant="primary">
            View More {data.value}
          </Button>
          <Button className="primary" variant="primary">
            Create Quotes
          </Button>
        </div>
      );
    },
  },
];

let { FAVOURITE_CUSTOMER, NEW_CUSTOMER } =
  QUOTATIONS_FILTER_STATUS;

const filterItems = [
  {
    label: "All",
  },
  {
    label: FAVOURITE_CUSTOMER,
  },
  {
    label: NEW_CUSTOMER,
  },
 
];

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customersData: [],
      selectedFilters: [],
      paginationDetails: { pageSize: 10, page: 0 },
    };
  }

  componentDidMount = () => {
    this.props.fetchCustomers();
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.customers.status !== this.props.customers.status &&
      this.props.customers.status === status.SUCCESS &&
      this.props.customers?.data
    ) {
      this.manipulationData(this.props.customers?.data.customers || []);
    }
  }
  manipulationData(data, searchData = "", isApply = 0) {
    let { customersData, selectedFilters } = this.state;
    customersData = [];
    if (data?.length) {
      let customers = JSON.parse(JSON.stringify(data));
      if (searchData) {
        customers = data.filter((tableData) => {
          if (
            tableData?.customer_name
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.added_by
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.added_on
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.email.toLowerCase().includes(searchData.toLowerCase()) ||
            tableData?.last_order
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.shipping_address
              .toLowerCase()
              .includes(searchData.toLowerCase())
          ) {
            return true;
          } else {
            return null;
          }
        });
      }
      if (isApply) {
        customers = customers.filter((tableData) => {
          return selectedFilters.includes(
            tableData.status.toLowerCase().replace(" ", "_")
          );
        });
      } else {
        selectedFilters = [];
      }

      customers.forEach((customers) => {
        customersData.push({
          ...customers,
          statusClass: customers?.status?.toLowerCase()?.replace(" ", "_"),
        });
      });
    }
    this.setState({ customersData, searchData, selectedFilters });
  }
  render() {
    const {
      customersData,
      paginationDetails: { page, pageSize },
      searchData,
      selectedFilters,
    } = this.state;
    const startDataNo = page * pageSize + 1;
    const endDataNo = page * pageSize + pageSize;
    return (
      <Box className="main-container">
        <Box className="qutations-container">
          <TablesHeaderFilters
            details={{
              header: "Customers",
              filterLabel: "",
              exportCsv: "Export as CSV",
              importCsv: "Import",
              isOnlySearchVisible: false,
              btnLabel: "Customers",

              dataLength: customersData.length,
              searchData,
              dataRange: customersData.length ? (
                <>
                  <strong>
                    {startDataNo} -{endDataNo}
                  </strong>
                </>
              ) : (
                0
              ),
              filter: {
                label: "Filters",
                data: filterItems,
                header: "Status",
                selectedFilters,
              },
            }}
            handleSearch={(searchData) => {
              this.manipulationData(
                this.props.customers?.data.customers || [],
                searchData
              );
            }}
            handleFilters={(label, prevFilters) => {
              let { selectedFilters } = this.state;
              if (prevFilters) {
                selectedFilters = prevFilters;
              } else {
                if (selectedFilters.includes(label)) {
                  if (label === "all") {
                    selectedFilters = [];
                  } else {
                    selectedFilters = selectedFilters.filter(
                      (item) => ![label, "all"].includes(item)
                    );
                  }
                } else {
                  if (label === "all") {
                    selectedFilters = filterItems.map((item) =>
                      item.label.toLowerCase().replace(" ", "_")
                    );
                  } else {
                    selectedFilters.push(label);
                  }
                }
              }
              console.log(selectedFilters, prevFilters);
              this.setState({ selectedFilters });
            }}
            applyOrCancelFilter={(isApply) => {
              this.manipulationData(
                this.props.quotations?.data.quotations || [],
                searchData,
                isApply ? 1 : 0
              );
            }}
          />

          {this.props.customers.status === status.IN_PROGRESS ? (
            Loader.commonLoader()
          ) : (
            <GridTableWithPagination
              details={{
                paginationDetails: { page, pageSize },
                pagSize: 10,
                data: customersData,
                columns,
                checkboxSelection: true,
              }}
              handlePageChange={(paginationDetails) => {
                this.setState({ paginationDetails });
              }}
            />
          )}
        </Box>
      </Box>
    );
  }
}
function mapStateToProps(state) {
  const { customers } = state.customers;
  return { customers };
}

const mapDispatchToProps = { fetchCustomers };

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
