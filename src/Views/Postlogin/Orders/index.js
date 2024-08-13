// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { fetchOrders } from "Redux-Store/Orders/OrdersThunk";
// import { Box, Button } from "@mui/material";
// import status from "Redux-Store/Constants";
// import { Loader } from "Utils/helperFunctions";
// import TablesHeaderFilters from "Views/Postlogin/Components/TablesHeaderFilters";
// import GridTableWithPagination from "../Components/GridTableWithPagination";
// import { Link } from "react-router-dom";
// const columns = [
//   {
//     field: "order_id",
//     headerName: "Order Id",
//     width: 150,
//     renderCell: (params) => <Link to={params.value}>{params.value}</Link>,
//   },
//   {
//     field: "customer_name",
//     headerName: "Customer Name",
//     width: 150,
//     renderCell: (params) => <Link to={params.value}>{params.value}</Link>,
//   },
//   {
//     field: "product",
//     headerName: "Product Name",
//     width: 180,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "product_code",
//     headerName: "Product Code",
//     width: 180,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "product_type",
//     headerName: "Product Type",
//     width: 250,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "package_type",
//     headerName: "Package Type",
//     width: 130,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "order_date",
//     headerName: "Order Date",
//     width: 180,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "due_date",
//     headerName: "Due Date",
//     width: 180,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "order_value",
//     headerName: "Order Value",
//     width: 240,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
//   {
//     field: "status",
//     headerName: "Order Status",
//     width: 240,
//     renderCell: (data) => {
//       return data.value;
//     },
//   },
// ];
// class Orders extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       ordersData: [],
//       paginationDetails: { pageSize: 10, page: 0 },
//     };
//   }

//   componentDidMount() {
//     this.props.fetchOrders();
//   }

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       prevProps.ordersData.status !== this.props.ordersData.status &&
//       this.props.ordersData.status === status.SUCCESS &&
//       this.props.ordersData?.data
//     ) {
//       this.manipulationData(
//         this.props.ordersData?.data.data.finish_products || []
//       );
//     }
//   }

//   manipulationData(data, searchData = "") {
//     let { ordersData } = this.state;
//     ordersData = [];
//     if (data?.length) {
//       let orders = JSON.parse(JSON.stringify(data));
//       if (searchData) {
//         orders = data.filter((tableData) => {
//           if (
//             tableData?.customer_name
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.status
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.product_type
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.product_code
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.product
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.package_type
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.order_value
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.order_id
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) ||
//             tableData?.order_date
//               .toLowerCase()
//               .includes(searchData.toLowerCase()) 
//               ||
//             tableData?.due_date.toLowerCase().includes(searchData.toLowerCase())
//           ) {
//             return true;
//           } else {
//             return null;
//           }
//         });
//       }

//       orders.forEach((orders) => {
//         ordersData.push({
//           ...orders,
//           statusClass: orders?.status?.toLowerCase()?.replace(" ", "_"),
//         });
//       });
//     }
//     this.setState({ ordersData, searchData });
//   }

//   render() {
//     const {
//       ordersData,
//       paginationDetails: { page, pageSize },
//       searchData,
//     } = this.state;
//     const startDataNo = page * pageSize + 1;
//     const endDataNo = page * pageSize + pageSize;
//     return (
//       <Box className="main-container">
//         <Box className="qutations-container">
//           <TablesHeaderFilters
//             details={{
//               header: "Orders",
//               filterLabel: "",
//               btnLabel: "",
//               dataLength: ordersData.length,
//               searchData,
//               isOnlySearchVisible: true,
//               dataRange: ordersData.length ? (
//                 <>
//                   <strong>
//                     {startDataNo} -{endDataNo}
//                   </strong>
//                 </>
//               ) : (
//                 0
//               ),
//             }}
//             handleSearch={(searchData) => {
//               this.manipulationData(
//                 this.props.ordersData?.data?.data?.finish_products || [],
//                 searchData
//               );
//             }}
//           />

//           {this.props.ordersData.status === status.IN_PROGRESS ? (
//             Loader.commonLoader()
//           ) : (
//             <GridTableWithPagination
//               details={{
//                 paginationDetails: { page, pageSize },
//                 pagSize: 10,
//                 data: ordersData,
//                 columns,
//                 checkboxSelection: false,
//               }}
//               handlePageChange={(paginationDetails) => {
//                 this.setState({ paginationDetails });
//               }}
//             />
//           )}
//         </Box>
//       </Box>
//     );
//   }
// }

// function mapStateToProps(state) {
//   const { ordersData } = state.orders;
//   return { ordersData };
// }

// const mapDispatchToProps = { fetchOrders };

// export default connect(mapStateToProps, mapDispatchToProps)(Orders);
