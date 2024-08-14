// import React, { Component } from "react";
// import Pagination from "@mui/material/Pagination";
// import PaginationItem from "@mui/material/PaginationItem";
// import {
//   DataGrid,
//   gridPageCountSelector,
//   gridPageSelector,
//   useGridApiContext,
//   useGridSelector,
// } from "@mui/x-data-grid";
// import { Box } from "@mui/material";
// import { NO_DATA_FOUND } from "CommonData";

// function CustomPagination() {
//   const apiRef = useGridApiContext();
//   const page = useGridSelector(apiRef, gridPageSelector);
//   const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//   return (
//     <Pagination
//       className="table-pagination"
//       color="primary"
//       variant="outlined"
//       shape="rounded"
//       page={page + 1}
//       count={pageCount}
//       renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
//       onChange={(event, value) => apiRef.current.setPage(value - 1)}
//       hidePrevButton={!pageCount ? true : false}
//       hideNextButton={!pageCount ? true : false}
//     />
//   );
// }
// class GridTableWithPagination extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     const {
//       paginationDetails = { pageSize: 10, page: 0 },
//       pagSize = 5,
//       data,
//       columns,
//       checkboxSelection=true,
//     } = this.props.details;
//     return (
//       <Box className="common-table-container">
//         <DataGrid
//           checkboxSelection={checkboxSelection}
//           disableRowSelectionOnClick
//           disableColumnMenu
//           paginationModel={paginationDetails}
//           onPaginationModelChange={(pageDetails) => {
//             try {
//               this.props.handlePageChange(pageDetails);
//             } catch (e) {
//               console.error(e);
//             }
//           }}
//           pageSizeOptions={[pagSize]}
//           slots={{
//             pagination: CustomPagination,
//             noRowsOverlay: () => NO_DATA_FOUND,
//           }}
//           rows={data}
//           // getRowHeight={() => "auto"}
//           columnHeaderHeight={44}
//           columns={columns.map((column) => ({
//             ...column,
//             sortable: false,
//             resizable: false,
//           }))}
//         />
//       </Box>
//     );
//   }
// }

// export default GridTableWithPagination;
