const fs = require('fs');
const path = require('path');

const profilePath = path.join('client', 'src', 'views', 'user', 'companyProfile', 'index.js');
let profileCode = fs.readFileSync(profilePath, 'utf8');

// Extract Marquee, formatVal, safeChartVal
const utilsCode = profileCode.substring(
  profileCode.indexOf('const Marquee ='),
  profileCode.indexOf('export default function UserCompanyProfile')
);

// Extract the dashboard JSX
let dashboardJsx = profileCode.substring(
  profileCode.indexOf('{company.notes'),
  profileCode.lastIndexOf('</Box>')
);
// Remove the last </Box> which belongs to the parent of UserCompanyProfile
dashboardJsx = dashboardJsx.substring(0, dashboardJsx.lastIndexOf('</Box>')) + '\n';

// Force all SimpleGrid columns to 1 in the sidebar!
dashboardJsx = dashboardJsx.replace(/columns=\{\{ base: 1, xl: 2 \}\}/g, 'columns={1}');
dashboardJsx = dashboardJsx.replace(/columns=\{\{ base: 1, sm: 3 \}\}/g, 'columns={1}');
dashboardJsx = dashboardJsx.replace(/columns=\{\{ base: 1, md: 3 \}\}/g, 'columns={1}');
dashboardJsx = dashboardJsx.replace(/columns=\{\{ base: 1, sm: 2, md: 3, xl: 5 \}\}/g, 'columns={2}');
dashboardJsx = dashboardJsx.replace(/columns=\{\{ base: 1, md: 4 \}\}/g, 'columns={1}');
dashboardJsx = dashboardJsx.replace(/columns=\{\{ base: 1, md: 2 \}\}/g, 'columns={1}');
dashboardJsx = dashboardJsx.replace(/direction=\{\{ base: 'column', xl: 'row' \}\}/g, 'direction="column"');

const newLeftSidebarContent = `
        {selectedCompany ? (
          <Box p="20px" h="100%" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { width: '10px' }, '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '24px' } }}>
            <Button mb="20px" size="sm" onClick={() => setSelectedCompany(null)} leftIcon={<Icon as={MdLocationOn} />} variant="outline" colorScheme="gray">
              Back to Results
            </Button>
            
            {(() => {
              const company = selectedCompany;
              const ghgOptions = {
                chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: true } },
                stroke: { curve: 'smooth', width: 2 },
                fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] } },
                colors: [brandGreen],
                dataLabels: { enabled: false },
                tooltip: { enabled: false }
              };
              const ghgSeries = [{ name: 'Emissions', data: [300000, 320000, 310000, 350000, 400000, 420000, safeChartVal(company.emissions?.scope1_Plus_2_tCO2e)] }];

              const getRadialOptions = (color, label) => ({
                chart: { type: 'radialBar', sparkline: { enabled: true } },
                plotOptions: {
                  radialBar: {
                    hollow: { size: '65%' },
                    track: { background: '#edf2f7' },
                    dataLabels: {
                      name: { show: false },
                      value: { offsetY: 8, fontSize: '18px', fontWeight: 'bold', color: '#1a202c', show: true, formatter: (val) => val }
                    }
                  }
                },
                stroke: { lineCap: 'round' },
                colors: [color],
                labels: [label]
              });

              return (
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor} mb="20px">{company.basicInfo?.companyName}</Text>
                  ${dashboardJsx}
                </Box>
              );
            })()}
          </Box>
        ) : (
          <>
            <Box p="20px" borderBottom="1px solid" borderColor={border}>
              <Text fontSize="xl" fontWeight="bold" mb="15px" color="brand.500">
                Supply Hub Explorer
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="Search facilities or locations..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  borderRadius="10px"
                />
              </InputGroup>
              <Text fontSize="sm" color="gray.500" mt="10px">
                {filtered.length} Facilities Found
              </Text>
            </Box>

            <VStack 
              flex="1" 
              overflowY="auto" 
              spacing="0" 
              align="stretch"
              divider={<Box borderBottom="1px solid" borderColor={border} />}
            >
              {loading ? (
                <Flex justify="center" p="20px"><Spinner /></Flex>
              ) : (
                filtered.map((company) => (
                  <Box 
                    key={company._id} 
                    p="15px" 
                    _hover={{ bg: hoverBg }} 
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCompany(company);
                    }}
                  >
                    <Text fontWeight="bold" fontSize="md" noOfLines={1} color={titleColor}>
                      {company.basicInfo?.companyName || 'Unknown Facility'}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb="2">
                      {company.location?.city || company.location?.state || 'Location not specified'}, {company.location?.country || 'India'}
                    </Text>
                    <Flex gap="2" wrap="wrap">
                      {company.ghgEmissions?.sbtiStatus && company.ghgEmissions.sbtiStatus !== 'Not Disclosed' && (
                        <Badge colorScheme="green" fontSize="xs" borderRadius="4px">SBTi: {company.ghgEmissions.sbtiStatus}</Badge>
                      )}
                      {company.renewableEnergy?.targetYear && company.renewableEnergy.targetYear !== 'Not Disclosed' && (
                        <Badge colorScheme="blue" fontSize="xs" borderRadius="4px">RE Target: {company.renewableEnergy.targetYear}</Badge>
                      )}
                    </Flex>
                  </Box>
                ))
              )}
            </VStack>
          </>
        )}
`;

const supplyHubPath = path.join('client', 'src', 'views', 'user', 'supplyHub', 'index.js');
let shCode = fs.readFileSync(supplyHubPath, 'utf8');

// 1. Widen the sidebar
shCode = shCode.replace(`w={{ base: '100%', md: '400px' }}`, `w={{ base: '100%', md: '500px' }}`);

// 2. Remove the Drawer entirely
const drawerStart = shCode.indexOf('{/* DRAWER FOR COMPANY DETAILS */}');
const drawerEnd = shCode.lastIndexOf('</Flex>');
if (drawerStart !== -1) {
  shCode = shCode.substring(0, drawerStart) + shCode.substring(drawerEnd);
}

// 3. Remove onOpen, onClose from onClick
shCode = shCode.replace('onOpen();', '');

// 4. Replace left sidebar contents
const leftSidebarBoxStart = shCode.indexOf('<Box p="20px" borderBottom="1px solid" borderColor={border}>');
const leftSidebarBoxEnd = shCode.indexOf('{/* RIGHT AREA - MAP */}');
shCode = shCode.substring(0, leftSidebarBoxStart) + newLeftSidebarContent + '\n      ' + shCode.substring(leftSidebarBoxEnd);

// 5. Remove useDisclosure import and usage if exists
shCode = shCode.replace('useDisclosure, ', '');
shCode = shCode.replace('const { isOpen, onOpen, onClose } = useDisclosure();', '');


fs.writeFileSync(supplyHubPath, shCode);
console.log('Successfully injected left-sidebar OS Hub style details!');
