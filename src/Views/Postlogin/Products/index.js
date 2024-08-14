import React, { Component } from "react";
import { Box} from "@mui/material";
import { connect } from "react-redux";
import status from "Redux-Store/Constants";
import { fetchProducts } from "Redux-Store/Products/ProductThunk";
import { Loader } from "Utils/helperFunctions";
import GridTableWithPagination from "../Components/GridTableWithPagination";
import { Link } from "react-router-dom";
import TablesHeaderFilters from "Views/Postlogin/Components/TablesHeaderFilters";
import { TABLE_VEGAN } from "CommonData";

const columns = [
  {
    field: "product",
    headerName: "Product Name",
    width: 180,
    renderCell: (params) => <Link to={params.value}>{params.value}</Link>,
  },
  {
    field: "customer_name",
    headerName: "Customer Name",
    width: 180,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "product_code",
    headerName: "Product Code",
    width: 180,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "product_type",
    headerName: "Product Type",
    width: 150,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "package_type",
    headerName: "Package Type",
    width: 180,
    renderCell: (data) => {
      return data.value;
    },
  },
  {
    field: "product_catogory",
    headerName: "Product Category",
    width: 180,
    renderCell: (params) => (
      <div className={`value-text ${TABLE_VEGAN[params.row.veganClass]}`}>
        {params.value}
      </div>
    ),
  },
];

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsData: [],
      paginationDetails: { pageSize: 10, page: 0 },
    };
  }

  componentDidMount = () => {
    this.props.fetchProducts();
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.products.status !== this.props.products.status &&
      this.props.products.status === status.SUCCESS &&
      this.props.products?.data
    ) {
      this.manipulationData(this.props.products?.data.products || []);
    }
  }
  manipulationData(data, searchData = "") {
    let { productsData } = this.state;
    productsData = [];
    if (data?.length) {
      let products = JSON.parse(JSON.stringify(data));
      if (searchData) {
        products = data.filter((tableData) => {
          if (
            tableData?.product
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.customer_name
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.package_type
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.product_catogory
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.product_code
              .toLowerCase()
              .includes(searchData.toLowerCase()) ||
            tableData?.product_type
              .toLowerCase()
              .includes(searchData.toLowerCase())
          ) {
            return true;
          } else {
            return null;
          }
        });
      }

      products.forEach((products) => {
        productsData.push({
          ...products,
          veganClass: products?.product_catogory
            ?.toLowerCase()
            ?.replace("-", "_"),
        });
      });
    }
    this.setState({ productsData, searchData });
  }
  render() {
    const {
      productsData,
      paginationDetails: { page, pageSize },
      searchData,
    } = this.state;
    const startDataNo = page * pageSize + 1;
    const endDataNo = page * pageSize + pageSize;
    return (
      <Box className="main-container">
        <Box className="qutations-container">
          <TablesHeaderFilters
            details={{
              header: "Finish Product List ",
              filterLabel: "",
              exportCsv: "",
              btnLabel: "",
              isOnlySearchVisible: true,
              dataLength: productsData.length,
              searchData,
              dataRange: productsData.length ? (
                <>
                  <strong>
                    {startDataNo} -{endDataNo}
                  </strong>
                </>
              ) : (
                0
              ),
            }}
            handleSearch={(searchData) => {
              this.manipulationData(
                this.props.products?.data.products || [],
                searchData
              );
            }}
          />

          {this.props.products.status === status.IN_PROGRESS ? (
            Loader.commonLoader()
          ) : (
            <GridTableWithPagination
              details={{
                paginationDetails: { page, pageSize },
                pagSize: 10,
                data: productsData,
                columns,
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
  const { products } = state.products;
  return { products };
}

const mapDispatchToProps = { fetchProducts };

export default connect(mapStateToProps, mapDispatchToProps)(Products);
