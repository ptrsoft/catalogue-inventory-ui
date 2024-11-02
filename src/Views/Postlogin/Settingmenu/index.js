import React from "react";
import {
  ContentLayout,
  BreadcrumbGroup,
  Header,
  Container,
  Grid,
} from "@cloudscape-design/components";
import Icon from "@cloudscape-design/components/icon";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Setting", href: "#components" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">Setting </Header>}
    >
      <Container>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
          ]}
        >
          <Link
            to=""
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #bbb",
                borderRadius: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Category Management
                </div>
                <p style={{ fontSize: "12px" }}>
                  Manage your items with categories and sub categories.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Icon name="angle-right" />
              </div>
            </div>
          </Link>
          <Link
            to=""
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #bbb",
                borderRadius: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Unit Management
                </div>
                <p style={{ fontSize: "12px" }}>
                  Manage units of measurement to use in your Items.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Icon name="angle-right" />
              </div>
            </div>
          </Link>
          <Link
            to=""
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #bbb",
                borderRadius: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Location Management
                </div>
                <p style={{ fontSize: "12px" }}>
                  Enter the names and locations of your inventory locations.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Icon name="angle-right" />
              </div>
            </div>
          </Link>
          <Link
            to=""
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #bbb",
                borderRadius: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Adjustment Management
                </div>
                <p style={{ fontSize: "12px" }}>
                  Enter reason for stock management.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Icon name="angle-right" />
              </div>
            </div>
          </Link>

          <Link
            to="/app/settings/rbac/users"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                border: "1px solid #bbb",
                borderRadius: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  RBAC
                </div>
                <p style={{ fontSize: "12px" }}>
                  Manage users and assign permissions based on roles.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Icon name="angle-right" />
              </div>
            </div>
          </Link>
        </Grid>
      </Container>
    </ContentLayout>
  );
};

export default Settings;
