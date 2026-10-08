const fs = require("fs");
const file = "d:/hestiya-admin/client/src/views/user/suppliers/index.js";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "  if (loading) {",
  "  const filteredBrands = brands.filter(b => b.basicInfo?.companyName?.toLowerCase().includes((searchQuery || \"\").toLowerCase()));\n\n  if (loading) {"
);

content = content.replace(
  "<Flex align=\"center\" mb=\"30px\">",
  "<Flex align=\"center\" justify=\"space-between\" mb=\"30px\" flexWrap=\"wrap\" gap=\"20px\">\n        <Flex align=\"center\">"
);

content = content.replace(
  "Select a supplier to view their climate dashboard.</Text>\r\n        </Box>\r\n      </Flex>",
  "Select a supplier to view their climate dashboard.</Text>\n        </Box>\n        </Flex>\n        <Box w={{ base: \"100%\", md: \"300px\" }}>\n          <FormControl>\n            <Input \n              list=\"companies-list\" \n              placeholder=\"Search companies...\" \n              value={searchQuery}\n              onChange={(e) => setSearchQuery(e.target.value)}\n              bg={cardBg}\n              borderRadius=\"10px\"\n            />\n            <datalist id=\"companies-list\">\n              {brands.map(brand => (\n                <option key={brand._id} value={brand.basicInfo?.companyName} />\n              ))}\n            </datalist>\n          </FormControl>\n        </Box>\n      </Flex>"
);

content = content.replace(
  "Select a supplier to view their climate dashboard.</Text>\n        </Box>\n      </Flex>",
  "Select a supplier to view their climate dashboard.</Text>\n        </Box>\n        </Flex>\n        <Box w={{ base: \"100%\", md: \"300px\" }}>\n          <FormControl>\n            <Input \n              list=\"companies-list\" \n              placeholder=\"Search companies...\" \n              value={searchQuery}\n              onChange={(e) => setSearchQuery(e.target.value)}\n              bg={cardBg}\n              borderRadius=\"10px\"\n            />\n            <datalist id=\"companies-list\">\n              {brands.map(brand => (\n                <option key={brand._id} value={brand.basicInfo?.companyName} />\n              ))}\n            </datalist>\n          </FormControl>\n        </Box>\n      </Flex>"
);

content = content.replace("{brands.map(company => {", "{filteredBrands.map(company => {");
content = content.replace("{brands.length === 0 ? (", "{filteredBrands.length === 0 ? (");

fs.writeFileSync(file, content);
console.log("done");

