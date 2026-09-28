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

const supplyHubPath = path.join('client', 'src', 'views', 'user', 'supplyHub', 'index.js');
let shCode = fs.readFileSync(supplyHubPath, 'utf8');

shCode = shCode.replace(
  'import { SearchIcon } from \'@chakra-ui/icons\';',
  'import { SearchIcon, ExternalLinkIcon } from \'@chakra-ui/icons\';\nimport Chart from \'react-apexcharts\';'
);
shCode = shCode.replace(
  'Icon\n}', 
  'Icon, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Progress, Image, Link, Center\n}'
);
shCode = shCode.replace(
  'MdEco, MdLocationOn, MdPeople, MdFactory', 
  'MdLocationOn, MdDateRange, MdPeople, MdFactory, MdRecycling'
);

// Remove the `MdEco` icon usage since we removed it from imports
shCode = shCode.replace(/<Icon as=\{MdEco\}.*?\/>/g, '');


if (!shCode.includes('const Marquee')) {
  shCode = shCode.replace('export default function SupplyHub() {', utilsCode + '\nexport default function SupplyHub() {');
}

if (!shCode.includes('const cardBg = bg;')) {
  shCode = shCode.replace(
    'const titleColor = useColorModeValue(\'navy.700\', \'white\');',
    `const titleColor = useColorModeValue('navy.700', 'white');
  const cardBg = bg;
  const textColor = titleColor;
  const brandGreen = '#048E3D';
  const brandBg = '#e6f4ea';`
  );
}

const drawerBodyStart = shCode.indexOf('<DrawerBody>');
const drawerBodyEnd = shCode.indexOf('</DrawerBody>');

const newDrawerBody = `<DrawerBody pb="40px" css={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { width: '10px' }, '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '24px' } }}>
            {selectedCompany && (() => {
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
          </DrawerBody>`;

shCode = shCode.substring(0, drawerBodyStart) + newDrawerBody + shCode.substring(drawerBodyEnd + 13);
shCode = shCode.replace('size="md"', 'size="xl"'); // Make the drawer larger for full profile

fs.writeFileSync(supplyHubPath, shCode);
console.log('Success!');
