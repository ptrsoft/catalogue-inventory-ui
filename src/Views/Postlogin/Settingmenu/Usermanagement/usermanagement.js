import React from "react";
import {
  Container,
  ColumnLayout,
} from "@cloudscape-design/components";
import { useNavigate, useLocation } from "react-router-dom";  // Import useNavigate and useLocation for routing

const UserManagement = () => {
  const navigate = useNavigate();  // Initialize the navigation hook
  const location = useLocation();  // Get the current location
  const commonStyles = {
    container: {
      cursor: "pointer",
      fontSize: 14,
      fontWeight: "bold",
    },
    span: {
      fontSize: 40,
      fontWeight: 900,
      lineHeight: 1.3,
    },
  };

  // Define categories with corresponding routes
  const categories = [
    { label: "Users", count: "06", route: "/app/settings/usermanagement/users" },
    { label: "Roles", count: "03", route: "/app/settings/usermanagement/roles" },
    { label: "Groups", count: "02", route: "/app/settings/usermanagement/groups" },
    { label: "Policies", count: "01", route: "/app/settings/usermanagement/policies" },
    { label: "Permissions", count: "30", route: "/app/settings/usermanagement/permissions" },
  ];

  const CategoryItem = ({ label, count, route }) => {
    // Check if the current route matches the category's route
    const isSelected = location.pathname === route;
    return (
      <div
        style={commonStyles.container}
        onClick={() => navigate(route)}  // Navigate to the corresponding route
      >
        <p>{label}</p>
        <span
          style={{
            ...commonStyles.span,
            color: isSelected ? "darkblue" : "#2563EB", // Change color based on selection
          }}
        >
          {count}
        </span>
      </div>
    );
  };

  return (
    <Container>
      <ColumnLayout columns={5} variant="text-grid" minColumnWidth={200}>
        {categories.map((category) => (
          <CategoryItem
            key={category.label}
            label={category.label}
            count={category.count}
            route={category.route} 
          />
        ))}
      </ColumnLayout>
    </Container>
  );
};

export default UserManagement;
