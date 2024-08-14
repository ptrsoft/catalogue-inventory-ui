// import React, { Component } from "react";
// import { Box, Button, Stack } from "@mui/material";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
// import AddIcon from "@mui/icons-material/Add";
// import { styled } from "@mui/system";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import MenuItem from "@mui/material/MenuItem";
// import Menu from "@mui/material/Menu";
// import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
// const PopupBody = styled("div")(
//   ({ theme }) => `
//   width: max-content;
//   padding: 12px 16px;
//   margin: 8px;
//   border-radius: 8px;
//   border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
//   background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
//   box-shadow: ${
//     theme.palette.mode === "dark"
//       ? `0px 4px 8px rgb(0 0 0 / 0.7)`
//       : `0px 4px 8px rgb(0 0 0 / 0.1)`
//   };
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-weight: 500;
//   font-size: 0.875rem;
//   z-index: 1;
// `
// );

// const grey = {
//   50: "#F3F6F9",
//   100: "#E5EAF2",
//   200: "#DAE2ED",
//   300: "#C7D0DD",
//   400: "#B0B8C4",
//   500: "#9DA8B7",
//   600: "#6B7A90",
//   700: "#434D5B",
//   800: "#303740",
//   900: "#1C2025",
// };
// class TablesHeaderFilters extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       anchor: null,
//       beforeApplyFilters: [],
//     };
//   }

//   filterPopupToggle = (target) => {
//     try {
//       let { beforeApplyFilters } = this.state;
//       if (!target) {
//         let removedFilters =
//           this.props.details?.filter?.selectedFilters?.filter(
//             (item) => !beforeApplyFilters.includes(item)
//           );

//         this.props.handleFilters(null, removedFilters);
//       }
//       this.setState({ anchor: target, beforeApplyFilters: [] });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   renderFilterListItem = () => {
//     let { filter } = this.props.details;

//     if (filter?.data?.length) {
//       return filter.data.map((item, index) => {
//         return (
//           <MenuItem key={`item-${index}`}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   size="small"
//                   sx={{ p: 0.5 }}
//                   id={item.label}
//                   checked={filter.selectedFilters.includes(
//                     item.label?.toLowerCase()?.replace(" ", "_")
//                   )}
//                   onClick={(e) => {
//                     let { beforeApplyFilters } = this.state;
//                     let label = item.label?.toLowerCase()?.replace(" ", "_");
//                     if (e.target.checked) {
//                       if (label === "all") {
//                         beforeApplyFilters = filter.data.map((item) =>
//                           item.label?.toLowerCase()?.replace(" ", "_")
//                         );
//                       } else {
//                         beforeApplyFilters.push(label);
//                       }
//                     } else {
//                       beforeApplyFilters.filter((item) => item !== label);
//                     }
//                     this.props.handleFilters(
//                       item.label?.toLowerCase()?.replace(" ", "_")
//                     );
//                     this.setState({ beforeApplyFilters });
//                   }}
//                 />
//               }
//               label={item.label}
//             />
//           </MenuItem>
//         );
//       });
//     }
//   };

//   onClickFilters = (isApply = 1, label) => {
//     try {
//       let { filter } = this.props.details;
//       if (filter.selectedFilters) {
//         this.filterPopupToggle();
//         this.props.applyOrCancelFilter(isApply);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   render() {
//     let {
//       header,
//       exportCsv,
//       btnLabel,
//       searchData,
//       dataLength,
//       dataRange,
//       filter,
//       importCsv,
//       isOnlySearchVisible,
//     } = this.props.details;
//     const { anchor } = this.state;

//     return (
//       <Box className="list-heading d-flex align-items-center justify-content-between">
//         <Box className="d-block">
//           <h2>{header}</h2>
//           <p>
//             Showing {dataRange} of <strong>{dataLength}</strong>{" "}
//           </p>
//         </Box>
//         <Stack direction="row" spacing={1.5}>
//           <Box className="top-search">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search"
//               value={searchData}
//               onChange={(e) => {
//                 try {
//                   this.props.handleSearch(e.target.value);
//                 } catch (e) {
//                   console.error(e);
//                 }
//               }}
//             />
//             <button className="button">
//               <SearchOutlinedIcon />
//             </button>
//           </Box>

//           {!isOnlySearchVisible ? (
//             <>
//               <Box>
//                 <Button
//                   className="btn-outline-secondary"
//                   type="button"
//                   onClick={(e) => this.filterPopupToggle(e.currentTarget)}
//                 >
//                   {filter?.label || "Filters "}
//                 </Button>
//                 {filter?.data?.length ? (
//                   <Menu
//                     className="filter-popup-content"
//                     id={`basic-menu`}
//                     anchorEl={this.state.anchor}
//                     open={anchor}
//                     onClose={() => this.filterPopupToggle(null)}
//                     MenuListProps={{
//                       "aria-labelledby": "basic-button",
//                     }}
//                     // anchorOrigin={{
//                     //   vertical: "top",
//                     //   horizontal: "center",
//                     // }}
//                     // transformOrigin={{
//                     //   vertical: "top",
//                     //   horizontal: "center",
//                     // }}
//                   >
//                     <h4>{filter?.header} </h4>
//                     {this.renderFilterListItem()}
//                     <Box className="d-flex align-items-center justify-content-between">
//                       <Button
//                         className="cancel-btn"
//                         size="small"
//                         onClick={() => this.onClickFilters(0)}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         className="apply-btn"
//                         size="medium"
//                         onClick={() => this.onClickFilters(1)}
//                       >
//                         Apply filters
//                       </Button>
//                     </Box>
//                   </Menu>
//                 ) : (
//                   <></>
//                 )}
//               </Box>
//             </>
//           ) : (
//             <></>
//           )}
//           {importCsv ? (
//             <Button
//               className="btn-outline-secondary"
//               variant="outlined"
//               startIcon={<CloudDownloadOutlinedIcon />}
//             >
//               {importCsv}
//             </Button>
//           ) : (
//             <></>
//           )}

//           {exportCsv ?
//            <Button
//            className="btn-outline-secondary"
//            variant="outlined"
//            startIcon={<CloudUploadOutlinedIcon />}
//          >
//            {exportCsv}
//          </Button>
//           :<></>}

//           {btnLabel ? (
//             <Button
//               className="primary-btn "
//               variant="contained"
//               startIcon={<AddIcon />}
//             >
//               {btnLabel}
//             </Button>
//           ) : (
//             <></>
//           )}

//           {this.props.details?.btnLabel2 ? (
//             <Button
//               className="primary-btn "
//               variant="contained"
//               startIcon={<AddIcon />}
//             >
//               {this.props.details.btnLabel2}
//             </Button>
//           ) : (
//             <></>
//           )}
//         </Stack>
//       </Box>
//     );
//   }
// }

// export default TablesHeaderFilters;
