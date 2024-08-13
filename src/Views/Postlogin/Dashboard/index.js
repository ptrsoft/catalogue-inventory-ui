import React, { useState, useEffect } from 'react';
import {
  Box,
  ColumnLayout,
  ContentLayout,
  Calendar,
} from '@cloudscape-design/components';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import PieChart from '@cloudscape-design/components/pie-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import Table from "@cloudscape-design/components/table";

const CustomDropdown = ({ options, selectedOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleError = (e) => {
      if (e.message.includes('ResizeObserver loop limit exceeded')) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#0073e7', marginRight: '0.5rem' }}><strong>{selectedOption.label}</strong></span>
        <Icon name="caret-down-filled" variant="link" />
      </button>
      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            listStyle: 'none',
            margin: 0,
            padding: '0.5rem',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: '0.5rem',
                cursor: 'pointer',
                backgroundColor: option.value === selectedOption.value ? '#e6f7ff' : 'transparent',
                color: option.value === selectedOption.value ? '#0073e7' : 'inherit',
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DashboardCards = () => {
  const [value, setValue] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedFilter1, setSelectedFilter1] = useState({ label: 'Today', value: 'today' });
  const [selectedFilter2, setSelectedFilter2] = useState({ label: 'Today', value: 'today' });
  const [selectedFilter3, setSelectedFilter3] = useState({ label: 'Today', value: 'today' });
  const [selectedFilter4, setSelectedFilter4] = useState({ label: 'Today', value: 'today' });
  const [selectedFilter5, setSelectedFilter5] = useState({ label: 'Today', value: 'today' });
  const [selectedFilter, setSelectedFilter] = useState({ label: 'Today', value: 'today' });

  const handleButtonClick = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const data = [
    { title: 'Morning', percentage: 35, value: 35 },
    { title: 'Afternoon', percentage: 30, value: 30 },
    { title: 'Evening', percentage: 20, value: 20 },
    { title: 'Night', percentage: 15, value: 15 },
  ];
  const data2 = [
    { title: 'UPI', percentage: 45, value: 45 },
    { title: 'Cash', percentage: 50, value: 50},
    { title: 'Cards', percentage: 5, value: 5 },
  ];

  const filterOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const handleFilterChange = (option) => {
    setSelectedFilter(option);
  };

  return (
    <ContentLayout
      headerVariant="high-contrast"
      defaultPadding
      header={
        <Header
          variant="h1"
          actions={
            <div>
            <Button
              iconAlign="right"
              iconName="calendar"
              onClick={handleButtonClick}
              size=""
            >
              {isCalendarVisible ? 'Hide Calendar' : 'Calendar'}
            </Button>
            <Button
      iconName="add-plus"
      variant="primary"
      wrapText={false}
    >
      Add Item
    </Button>
            </div>
          }
        >
          DashBoard
        </Header>
      }
    >
      {isCalendarVisible && (
        <Container>
          <Calendar onChange={({ detail }) => setValue(detail.value)} value={value} />
        </Container>
      )}

      <SpaceBetween direction="vertical" size="l">
        <Container className="top-container" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Adam's Dashboard</h2>
          </div>

          <ColumnLayout columns={4} variant="default" minColumnWidth={120}>
            <div>
              <Box variant="awsui-key-label"><p style={{ fontSize: 12}}>Total Item In Inventory</p></Box>
              <span style={{ fontSize: 38, fontWeight: '1000', lineHeight: 1.3 }}>1023</span>
            </div>
            <div>
              <Box variant="awsui-key-label"><p style={{ fontSize: 12}}>Total Quality On Hand</p></Box>
              <span style={{ fontSize: 38, fontWeight: '1000', lineHeight: 1.3 }}>3206</span>
            </div>
            <div>
              <Box variant="awsui-key-label"><p style={{ fontSize: 12}}>Total Inventory Value</p></Box>
              <span style={{ fontSize: 38, fontWeight: '1000', lineHeight: 1.3 }}>$44k</span>
            </div>
            <div>
              <Box variant="awsui-key-label"><p style={{ fontSize: 12}}>Recent Orer</p></Box>
              <span style={{ fontSize: 38, fontWeight: '1000', lineHeight: 1.3 }}>14</span>
            </div>
          </ColumnLayout>
        </Container>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
          ]}
        >
          <Container>
            {/* BarChart section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Purchase & Sales Stock</h3>
              <CustomDropdown
                options={filterOptions}
                selectedOption={selectedFilter1}
                onChange={setSelectedFilter1}
              />
            </div>
            <BarChart
              series={[
                {
                  title: 'Purchase',
                  type: 'bar',
                  data: [
                    { x: new Date(1601058600000), y: 91394 },
                    { x: new Date(1601065800000), y: 56012 },
                    { x: new Date(1601073000000), y: 156204 },
                    { x: new Date(1601080200000), y: 98349 },
                    { x: new Date(1601087400000), y: 99249 },
                  ],
                  valueFormatter: (e) =>
                    Math.abs(e) >= 1e9
                      ? (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'G'
                      : Math.abs(e) >= 1e6
                      ? (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
                      : Math.abs(e) >= 1e3
                      ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                      : e.toFixed(2),
                },
                {
                  title: 'Sales',
                  type: 'bar',
                  data: [
                    { x: new Date(1601058600000), y: 133294 },
                    { x: new Date(1601065800000), y: 96012 },
                    { x: new Date(1601073000000), y: 112604 },
                    { x: new Date(1601080200000), y: 68349 },
                    { x: new Date(1601087400000), y: 79249 },
                  ],
                  valueFormatter: (e) =>
                    Math.abs(e) >= 1e9
                      ? (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'G'
                      : Math.abs(e) >= 1e6
                      ? (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
                      : Math.abs(e) >= 1e3
                      ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                      : e.toFixed(2),
                },
              ]}
              xDomain={[
                new Date(1601058600000),
                new Date(1601065800000),
                new Date(1601073000000),
                new Date(1601080200000),
                new Date(1601087400000),
              ]}
              yDomain={[0, 156204]}
              i18nStrings={{
                filterLabel: 'Filter displayed data',
                filterPlaceholder: 'Filter data',
                legendAriaLabel: 'Legend',
                chartAriaRoleDescription: 'line chart',
                xTickFormatter: (e) =>
                  e
                    .toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                    .split(', ')
                    .join('\n'),
              }}
              ariaLabel="Single data series line chart"
              errorText="Error loading data."
              height={300}
              loadingText="Loading chart"
              recoveryText="Retry"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data available</b>
                  <Box variant="p" color="inherit">
                    There is no data available
                  </Box>
                </Box>
              }
              noMatch={
                <Box textAlign="center" color="inherit">
                  <b>No matching data</b>
                  <Box variant="p" color="inherit">
                    There is no matching data to display
                  </Box>
                  <Button onClick={() => console.log('Clear filter')}>
                    Clear filter
                  </Button>
                </Box>
              }
            />
          </Container>

          <Container>
            {/* PieChart section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Transactions</h3>
              <CustomDropdown
                options={filterOptions}
                selectedOption={selectedFilter2}
                onChange={setSelectedFilter2}
              />
            </div>
            <PieChart
              data={data}
              i18nStrings={{
                detailsValue: 'Value',
                detailsPercentage: 'Percentage',
                filterLabel: 'Filter displayed data',
                filterPlaceholder: 'Filter data',
                filterSelectedAriaLabel: 'selected',
                detailPopoverDismissAriaLabel: 'Dismiss',
                legendAriaLabel: 'Legend',
                chartAriaRoleDescription: 'pie chart',
                segmentDescription: (datum, sum) => `${datum.data.title} - ${datum.data.value} (${datum.data.percentage}%)`,
              }}
              ariaDescription="Donut chart showing customer preferences for meal plans."
              ariaLabel="Donut chart"
              errorText="Error loading data."
              loadingText="Loading chart"
              recoveryText="Retry"
              size="large"
              variant="donut"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data available</b>
                  <Box variant="p" color="inherit">
                    There is no data available
                  </Box>
                </Box>
              }
            />
          </Container>

          <Container>
            {/* Another PieChart section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Order Type</h3>
              <CustomDropdown
                options={filterOptions}
                selectedOption={selectedFilter3}
                onChange={setSelectedFilter3}
              />
            </div>
            <PieChart
              data={data2}
              i18nStrings={{
                detailsValue: 'Value',
                detailsPercentage: 'Percentage',
                filterLabel: 'Filter displayed data',
                filterPlaceholder: 'Filter data',
                filterSelectedAriaLabel: 'selected',
                detailPopoverDismissAriaLabel: 'Dismiss',
                legendAriaLabel: 'Legend',
                chartAriaRoleDescription: 'pie chart',
                segmentDescription: (datum, sum) => `${datum.data.title} - ${datum.data.value} (${datum.data.percentage}%)`,
              }}
              ariaDescription="Donut chart showing order types."
              ariaLabel="Donut chart"
              errorText="Error loading data."
              loadingText="Loading chart"
              recoveryText="Retry"
              size="large"
              variant="donut"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data available</b>
                  <Box variant="p" color="inherit">
                    There is no data available
                  </Box>
                </Box>
              }
            />
          </Container>
        </Grid>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default DashboardCards;
