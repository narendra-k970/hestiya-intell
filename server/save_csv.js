const fs = require('fs');

const rawData = `Tier,Hestiya Company ID,Factory Name,Name Variants Found,Already in Hestiya Dashboard?,Num Factories Supplying H&M (India),Est. Total Workers (H&M factories),Avg Female Worker % (H&M factories),Longest H&M Relationship,Certifications Reported to H&M,Factory Types,Product Types,Any Trade Union Reported,HQ City,HQ State,Latitude,Longitude,Year Established,Ownership Type,Total Employees,Scope 1 (tCO2e),Scope 2 (tCO2e),Scope 1+2 (tCO2e),Renewable Energy %,Total Energy (TJ),Solar Capacity (MWp),Total Water (KL),Total Waste (MT),Energy Carbon Intensity (tCO2e/TJ),ESG Score,SBTi Status,RE100 Member,CDP Score,ISO14001 (Y/N),GOTS (Y/N),Renewable Energy Target,Coal Phase-Out Status,Major Buyers,Primary Raw Material,Fabric Sourcing Geography,Data Source(s) / Citation,Reporting FY,Last Verified Date,Data Status,Assigned To,Notes,"Notes 2
ESG Score Reference"
2,,Agpl Rotary Printing,,No,1,250,,6-10 Years,,Component unit,,No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,1993,Private Ltd,200,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,Yes,Not Disclosed,Not Disclosed,Print Houses,GOTS organic cotton fabrics,"Tirupur, Tamil Nadu","https://www.agplindia.in/
CARE Ratings, AGPL PDF",FY2023-24,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. 
",Not Applicable - ESG Score not disclosed
1,arvind-limited,Arvind Limited,,arvind-limited,5,10500,75.8,>10 Years,,"Manufacturing unit, Processing unit","Denim, Jersey, Underwear/Swimwear, Woven",No / Not Reported,Ahmedabad,Gujarat,23.0225,72.5714,1931,Public Listed,33311,253283,190808,444091,37,6187.58,Not Disclosed,2645994,34493,71.77135488,80,Targets set (near-term + net-zero),No,Not Disclosed,Yes,Yes,40% RE by 2025,Biomass replacing coal,"Levi's, Gap Inc., H&M, American Eagle, Inditex, VF Corporation, Marks & Spencer, Calvin Klein, Hugo Boss, J.Crew, Mango, Banana Republic","Cotton (BCI certified), Organic Cotton, Linen, Viscose, Modal, Tencel","India: Gujarat (Ahmedabad, Naroda, Santej) + Bangladesh facility","Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail
""Arvind_Limited_SR_2022-24_web_0.pdf
",FY2024-25,2026-07-01,Live,Already live,"Already researched and shipped on the current dashboard — use as the reference example for depth/format.
",74 (S&P Global Corporate Sustainability Assessment / CSA)
1,,Scm Garments Pvt Limited,,No,5,8500,50,<3 Years,,"Component unit, Manufacturing unit, Processing unit","Jersey, Underwear/Swimwear",No / Not Reported,Tirupur,Tamil Nadu,11.11,77.34,1989,Private ltd,25000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,2.2,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term, 1.5C)",Not Disclosed,Not Disclosed,No,Yes,Wind + Solar,Not Disclosed,H&M ,Knitted Fabrics / Knitwear,"Tirupur, Tamil Nadu",https://www.scmgarments.com/index.php,Not Stated,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Google search indicates GOTS certification, but no disclosure on the company website to confirm.
Formally committed to the SBTi Net-Zero standard. Reports focus on integrated organic cotton value chains in the Tirupur hub. 
As a GOTS-certified entity, the company adheres to strict environmental and social criteria. Per the sources, this certification guarantees at least 70% to 95% organic fiber content, bans toxic chemical inputs (the ""no hazard in, no hazard out"" approach), and mandates the treatment of all wastewater to protect local river systems..

Search record: No sustainability disclosure found; company registration confirmed via Company website

SBTi: Validated near-term target: absolute Scope 1+2 -68.1% by FY2030 from an FY2022 base; Scope 3 -25%. Register updated 09/01/2025. Source: https://sciencebasedtargets.org/target-dashboard","Reporting Focus: Sustainability reporting for this entity is heavily centered on its integrated organic cotton value chain. This includes full transparency from the cotton farms in Southern India through the spinning, knitting, and processing stages in Tirupur [History].
Future Compliance: With the introduction of GOTS 8.0, Scm Garments will be required to transition toward mandatory annual calculation of Scope 1 and Scope 2 GHG emissions, including a formal GHG Emissions Management Plan to track and demonstrate progress over time"
1,,Indian Designs Exports Pvt Ltd,,No,6,7750,83.3,>10 Years,,"Manufacturing unit, Processing unit","Accessories, Denim, Jersey, Woven",No / Not Reported,Bangalore,Karnataka,13.0285,77.6186,1993,Private,15000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,Not Disclosed,Not Disclosed,No,No,Net-Zero 5yr,Not Disclosed,H&M,Apparel and Home Furnishings,"Bangalore, Karnataka",https://www.indian-designs.com/csr-activities/,FY2024-25,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

The key elements of their environmental and sustainability focus include:
Tree Planting and Nurturing: Starting with the basics of environmental restoration, the company actively plants and nurtures trees (currently maintaining 900 saplings).
Water and Waste Management: Focuses on water conservation, recycling, waste management, and repurposing.
Sustainable Design and Operations: Incorporates internal collections and Research & Development (R&D) to promote sustainable design practices to their buyers, while taking ownership of operational impacts, waste reduction, and energy sources.","LEED Plat. (Leadership in Energy and Environmental Design):A globally recognized green building rating system administered by the U.S. Green Building Council (USGBC). It evaluates facilities across key environmental dimensions: energy efficiency, water conservation, site selection, low-emitting materials, and waste reduction."
2,,Arvind Limited- Denim,,No,1,1500,,>10 Years,,Component unit,,Yes,Ahmedabad,Gujarat,23.0225,72.5714,1931,"Subsidiary of Arvind Limited (public company structure, unlisted)",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,Yes,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,https://www.arvind.com/sites/default/files/sustainability_listing/Arvind_Limited_SR_2022-24_web.pdf,FY2024-25,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Arvind Limited.

Relationship: Division of the listed parent (denim fabric business, Naroda and Khatraj; India's first denim plant, 1987).

Unit-level disclosure: Unit-level claims exist but are unquantified: the Naroda denim facility is stated to save 2.5 billion litres of freshwater a year (with Gap Inc., 2019), and denim is stated to be made and laundered with 100% recycled water. Both are company claims with no reporting year and no audited figure, so nothing is entered in the columns.",Not Applicable - ESG Score not disclosed
1,,Arvind Ltd - Santej,,No,1,4500,,>10 Years,,Component unit,,Yes,Ahmedabad,Gujarat,23.0225,72.5714,1931,"Subsidiary of Arvind Limited (public company structure, unlisted)",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,Yes,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,https://www.arvind.com/sites/default/files/sustainability_listing/Arvind_Limited_SR_2022-24_web.pdf,FY2024-25,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Arvind Limited.

Relationship: Division of the listed parent (shirting, gabardine and knits mill at Santej, Gandhinagar district, Gujarat; commissioned 1998).

Unit-level disclosure: Unit-level claims exist but are unquantified: Santej is described as one of Asia's largest Zero Liquid Discharge plants and as hosting one of India's largest rooftop solar installations, with the GWICA water-innovation centre sited there in 2024. The widely cited 16.2 MWp Santej solar figure appears only in trade press, not on any company page, so it is deliberately not entered.",Not Applicable - ESG Score not disclosed
1,,Raymond Uco Denim Pvt Ltd,RAYMOND UCO DENIM PVT LTD; RAYMOND UCO DENIM PVT. LTD.,No,3,6250,61.6,>10 Years,,"Component unit, Manufacturing unit, Processing unit",Denim,Yes,Mumbai,Maharashtra,20.3951,78.1307,2006,Private (JV entity of Raymond Ltd),2395,11.18,656.77,667.95,15,3.44,Not Disclosed,"580,000",14404.81,194.11,Not Disclosed,No Target,No,Not Disclosed,Yes,No,10% by 2035,Group-level 30% reduction,Raymond Lifestyle / JV Brands,Cotton and Denim Fabrics,"Yavatmal, Maharashtra","
https://www.raymonddenim.com/Sustain/Garment
1766468001313Raymond Ltd. ESG Data book 2024-25.pdf",FY2024-25,2026-09-11,Verified,Ankita D,"Raymond UCO Denim Pvt. Ltd. integrates sustainability through eco-friendly manufacturing processes and resource conservation, adhering to group-level reporting under its parent entity, Raymond Limited. Here, we have collected data from the company's sustainability portal, as it is considered as direct disclosure from Raymond Uco Denim Pvt Ltd's side.

Raymond Limited ESG Data Book, focusing on zero liquid discharge, significant greenhouse gas reduction goals, and eco-friendly manufacturing across its plant in Yavatmal, Maharashtra.

The data book specifies the implementation of 450 solar hot water systems/panels across operational sites rather than an explicit photovoltaic capacity in MWp.

Website highlights:
1. Less Water
Reduced Consumption: Lowered water usage from 75 liters down to 60 liters per pair of jeans.

Advanced Water Recycling: Utilizes an advanced Effluent Treatment Plant (ETP) to recycle 97% of water.

Ozone Technology: Implements ozone instead of traditional washes for de-sizing garments.

2. Less Waste
Reduced Sludge Generation: Uses hand-made stones and abrasive plates instead of traditional pumice stones, which reduces sludge at the ETP by 90% to 95%.

Laser Finishing: Replaces traditional manual sanding with lasers to achieve the desired washed aesthetic.

3. Less Energy
Lower Consumption Rates: Optimized processes to reduce energy usage to 1.10 kWh per pair of jeans.

Shorter Cycle Times: Shorter wash cycles achieved via ozone de-sizing and lasers directly decrease total energy consumption.

4. Less Chemicals
Chemical Replacements: Incorporates potassium permanganate (PP) replacement chemicals to make the garmenting process more sustainable.

Certified Eco-Friendly Inputs: Uses GreenScreen and BlueSign certified chemicals to achieve ZDHC (Zero Discharge of Hazardous Chemicals) compliance.

Sustainable Management: Implements specialized chemical management systems for transitioning traditional denim production to eco-friendly alternatives.","CITI Winner
""CITI Winner"" refers to a recipient of the national CITI Textile Sustainability Awards & CITI-Birla Awards. Awarding Body: Organized annually by the Confederation of Indian Textile Industry (CITI) in partnership with the Ministry of Textiles.Scope of Recognition: Acknowledges Indian textile and apparel manufacturers for excellence in:Excellence in Carbon Emissions Reduction / Low Carbon FootprintBest Alternate Materials UseWater Management & ConservationRenewable Energy Integration & HR Practices.
Raymond Uco Denim Pvt Ltd: Recognized as a CITI Winner for Best Alternate Materials Use.
"
1,vamani-overseas,Vamani Overseas Pvt. Ltd.,,vamani-overseas,5,6000,51,6-10 Years,,"Component unit, Manufacturing unit, Processing unit","Home (textile), Woven",No / Not Reported,Faridabad,Haryana,28.4089,77.3178,2008,Private,11464,2138,4799,6937,5.1,35.58,0.38,82038,483.26,194.9690838,87,Not Disclosed,No,Not Disclosed,Yes,Yes,80% renewable electricity by 2030,100% PNG-fired boilers + biomass-fired boiler,"ZARA (Inditex), LEVI's, Mango, Kiabi, Target, C&A, H&M","Cotton (BCI/GOTS/OCS), Polyester (GRS/RCS), Viscose (Ecovera/Ecoliva), Linen",Not Disclosed,"Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2023-24,2026-07-01,Live,Already live,Already researched and shipped on the current dashboard — use as the reference example for depth/format.,
1,,First Steps Babywear Pvt Ltd,,No,5,5500,68.7,>10 Years,,"Component unit, Manufacturing unit, Processing unit","Jersey, Underwear/Swimwear",No / Not Reported,Bangalore,Karnataka,12.8093,77.6953,2001,Private,5200,808.83,2665.43,3474.26,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term, 1.5C)",Not Disclosed,D,No,Yes,100% by 2030–2035,Not Disclosed,"H&M, Walmart, Carters, Next Retailer, Target, Primark, George ASDA, Landmark Kmart, Tesco",Cotton Babywear Fabrics,"Bangalore, Karnataka",https://www.firststepsindia.com/sustainability-report/,FY2025,2026-09-11,Verified,Ankita D,"The reporting framework aligns with broader decarbonization goals, aiming to optimize production efficiency, transition toward renewable solar and wind energy sources, and systematically reduce Scope 1, Scope 2, and Scope 3 impacts heading toward net-zero manufacturing targets.

SBTi: Validated near-term target: absolute Scope 1+2 -75.0% by 2030 from a 2024 base; Scope 3 -37.5% by 2035. Register updated 13/08/2026. Source: https://sciencebasedtargets.org/target-dashboard

CDP 2025 scores as published by the company: Climate D, Water B-. The CDP Score column carries the climate grade. Reproduced from the company report; not independently confirmed against CDP's own database.",Not Applicable - ESG Score not disclosed
1,,Arvind Smart Textiles Limited,,No,3,5250,70.3,6-10 Years,,"Manufacturing unit, Processing unit","Denim, Jersey",No / Not Reported,Ahmedabad,Gujarat,23.0225,72.5714,1931,"Subsidiary of Arvind Limited (public company structure, unlisted)",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,Yes,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,https://www.arvind.com/sites/default/files/sustainability_listing/Arvind_Limited_SR_2022-24_web.pdf,FY2024-25,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Arvind Limited.

Relationship: SEPARATE INCORPORATED SUBSIDIARY, not a division - Arvind Smart Textiles Limited, CIN U17299GJ2017PLC100201, incorporated 19 December 2017, RoC Ahmedabad, registered office within Arvind Limited premises on Naroda Road; files its own MCA accounts. LEI 3358009LLEY5CMFELC86.

Unit-level disclosure: No disclosure of its own. Note the structural gap: it is unlisted so falls outside BRSR scope, and Arvind Limited's BRSR is a standalone listed-entity filing, so this company's figures appear in neither its own nor its parent's disclosure.",Not Applicable - ESG Score not disclosed
1,,Cl Gupta Exports Ltd,,No,2,4750,2.8,>10 Years,,"Manufacturing unit, Processing unit","Accessories, Socks/Tights/Micro tights",No / Not Reported,Moradabad,Delhi,28.8231,78.6878,1942,Private,"6,404",14942,5694.2,20636.2,14.96,282.06,8.6,"45,239","12,310.79",Not Disclosed,Not Disclosed,Committed to validating targets,No,Not Disclosed,Yes,No,75% Solar Electricity Share by 2030,No Direct Coal Usage,H&M,"Metal (Aluminum, steel, brass, copper), Wood (Native/imported timber, MDF, ply-board), Stone (Marble), and Glass (Mouth-blown glass)","As a handicraft and furniture manufacturer specializing in metal, wood, stone, and glass, C.L. Gupta Exports does not engage in textile production or fabric sourcing.","C.L.-Gupta-Exports_Sustainability_Report_2024

https://clgupta.com/wp-content/uploads/2026/01/C.L.-Gupta-Exports_Sustainability_Report_2024_fINAL.pdf",CY2024,2026-09-11,Verified,Ankita D,"Waste Calculation: 12,310.79 MT (CY 2024 Total Non-Hazardous: 12,189.89 MT + Total Hazardous: 120.90 MT)

H&M has collaborated with institutional partners (such as the International Finance Corporation) to help strategic manufacturing suppliers—including C.L. Gupta Exports—adopt renewable energy solutions and lower their carbon footprints.Supplier Policy Alignment. C.L. Gupta Exports formally integrates compliance frameworks, ethical standards, and social accountability guidelines that align with major international retail compliance expectations, referencing partners like H&M in vendor documentation.

Reporting basis: calendar year 2024 (Jan-Dec), not a financial year. Renewable electricity share 68.23%; renewable share of total energy 14.96% - the column carries the energy basis. Scope 2 of 5,694.2 tCO2e is the location/excluding-I-REC basis; counting 8,100 MWh of I-RECs the company reports market-based Scope 2 of zero. Total waste 12,310.79 MT is hazardous 120.90 + non-hazardous 12,189.89; no combined total is printed in the report. Solar 8.6 MW is on-site plus off-site open access.",Not Applicable - ESG Score not disclosed
1,,Global Mode And Accessories Pvt. Ltd.,,No,7,4750,30.2,>10 Years,"Global Organic Textile Standard (GOTS), Global Recycle Standard (GRS), Organic Content Standard (OCS), Recycled Claim Standard (RCS)","Manufacturing unit, Processing unit","Accessories, Denim, Home (textile), Jersey, Woven",No / Not Reported,Noida,Uttar Pradesh,28.5355,77.391,2010,Private,700,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,Not Disclosed,Not Disclosed,No,Yes,Not Disclosed,Not Disclosed,International Brands,Apparel Accessories,"Noida, Uttar Pradesh","https://globalfashionindia.com/csr
Corporate Social Responsibility - Global Mode and Accessories",Not Stated,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
GOTS marked Yes based on H&M's own supplier certification disclosure . ISO14001 not mentioned in H&M's cert list or found elsewhere. No Scope 1/2, energy, water, employee totals, or ESG-relevant figures found beyond generic company marketing pages. ","Operates worker-welfare programs, including a charitable trust focused on medical aid and health support for factory workers and their families.Focuses on workplace gender equality, female empowerment, and non-discrimination initiatives across manufacturing operations."
1,,Cta Apparels Pvt Ltd,,No,3,3000,18.8,>10 Years,,"Manufacturing unit, Processing unit","Denim, Jersey, Woven",No / Not Reported,Noida,Uttar Pradesh,28.58,77.31,1993,Private Ltd,"5,000",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,1,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Biomass/PNG,PNG and biomass steam,"Major global fashion brands and retailers (including H&M, Marks & Spencer, Cecil, Street-One, and Kappahl)",Cotton and Man-Made Fibers (including organic cotton and 100% recycled polyester),"India (In-house vertical processing, weaving/knitting units in Noida and Pilkhua, Uttar Pradesh)",https://ctaapparels.com/sustainability,FY2025-26,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Real, specific sustainability targets found (2027 renewable electricity goal, ZLD/RO water reuse) but no quantified current-state Scope 1/2, energy, or water figures — these are forward targets, not baseline disclosures. GOTS/ISO14001 not confirmed.

SBTi: Absent from the SBTi register. The previously recorded ""Net-Zero 2030"" was a company aspiration in trade press, not a validated target. Source: https://sciencebasedtargets.org/target-dashboard",Not Applicable - ESG Score not disclosed
1,vardhman-textiles,Vardhman Textiles,,vardhman-textiles,1,4500,,>10 Years,,Component unit,,No / Not Reported,Ludhiana,Punjab,30.901,75.8573,1965,Public Listed,27956,282924,857272.48,1140196.48,14.46,12928,19.2,5695455,21423.87,88.19589109,60,Not found,No,Not Disclosed,Yes,Yes,53 MW solar capacity by 2025,Transitioning boilers to biomass,"H&M, Gap, Banana Republic, Old Navy, Esprit, Benetton, Ford (special steels)","Lint Cotton (primary), Organic Cotton, Better Cotton, Man-made Fibres","India (Punjab, HP, MP) + limited global specialty fibres","Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2023-24,2026-07-01,Live,Already live,Already researched and shipped on the current dashboard — use as the reference example for depth/format.,
1,,Victus Dyeings,Victus Dyeing; Victus Dyeings,No,4,4000,67.9,6-10 Years,"Global Organic Textile Standard (GOTS), Global Recycle Standard (GRS), Organic Content Standard (OCS), Recycled Claim Standard (RCS)","Component unit, Manufacturing unit, Processing unit",Jersey,No / Not Reported,Kizhakkambalam,Kerala,11.02885,77.3302,1989,Private,250,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term + net-zero, 1.5C)",Not Disclosed,Not Disclosed,No,Yes,Not Disclosed,Not Disclosed,Marks & Spencer (M&S),Dyed and Processed Fabrics [History],"Tirupur, Tamil Nadu",https://www.linkedin.com/company/victus-dyeings/?original_referer=https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&originalSubdomain=in,FY2024-25,2026-09-11,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Linkedin. Unable to navigate through company website given.

SBTi: Validated 25/06/2026: near-term Scope 1+2 to 2030 from a 2023 base; net-zero across the value chain by 2050. Source: https://sciencebasedtargets.org/target-dashboard

Victus publishes ""89% of power generation from windmills"" alongside unit figures of 13% (processing) and 76% (garments). These sit on different bases and cannot be reconciled into a single renewable share, so none is entered in the column. The sustainability page was last updated January 2023 and carries no reporting year. Solar is listed as ""under process"", i.e. not operational.","CITI Runner
Recognized as a CITI Award Runner (Confederation of Indian Textile Industry Sustainability Awards) for environmental practices and process control.
"
1,,Kitex Garments Ltd,,No,2,3750,71.4,<3 Years,,"Component unit, Manufacturing unit, Processing unit",Jersey,No / Not Reported,Kizhakkambalam (Aluva),Kerala,10.037,76.408,1992,Public Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,93360,762.96,Not Disclosed,Not Disclosed,No Target,Not Disclosed,Not Disclosed,No,Yes,Increasing use of RE; no specific commitment goals set with timelines,Not Disclosed,"Walmart, Carters, Gerber, Amazon, Sam's Club, and LAT","Cotton, organic cotton, polyester, and blends",Kerala (Kizhakkambalam) and Telangana (Warangal),https://www.kitexgarments.com/wp-content/uploads/2026/04/BRSR-24-25.pdf,FY2024-25,2026-09-12,Verified,Ankita D,"EMISSIONS AND ENERGY WITHHELD - the company's environmental data is not usable. Re-tested against the FY2025-26 BRSR on 2026-10-05.

FY2025-26 BRSR (filed 03-Sep-2026, https://nsearchives.nseindia.com/corporate/KITEX_03092026204852_KGL_BRSRs.pdf) reports Scope 1 of 1,63,420 and Scope 2 of 31,89,580, unit cell ""Metric tonnes of CO2 equivalent"", against total energy of 3,63,803 GJ. That is about 9,216 tCO2e/TJ where the textile sector reports roughly 50-150. The implied Scope 2 works out at about 181 tonnes CO2 per MWh of electricity against an Indian grid factor near 0.7. The filing's own physical-output intensity row reads 67.32 tCO2e per 1,000 garments, i.e. about 67 kg of CO2e per infant garment.

Root cause: the identical values 2,68,541 and 33,64,854 first appear in the FY2022-23 BRSR under the unit ""Gco2/Littre"" - not a mass unit - and were carried into later tables relabelled as metric tonnes. The FY2025-26 numbers are freshly computed but on the same broken basis, so the defect is now two filings old and not a transcription slip.

Two further reasons for withholding: the FY2025-26 filing silently restates FY2024-25 total energy upward by 90% with no note, and every filing is unassured (""Name of assurance provider: Not Applicable""). The renewable/non-renewable energy split required by the amended BRSR format is still absent, so no renewable share can be stated either.

Retained from the FY2024-25 filing, not contradicted by the later one: water withdrawal 93,360 KL and total waste 762.96 MT. Treat both with caution given the above. Workforce: 610 employees plus 4,648 workers.

No CDP response, no sustainability report, no ESG page, no assurance statement, and no usable figure from any group entity (Kitex Childrenswear is unlisted and files no BRSR). Query raised with the company CFO 2026-10-05.","Social & Governance Indicators:Board Gender Diversity: 33.3% female representation on the Board of Directors.Employee Welfare & Safety: 100% training coverage on health, safety, and human rights across its manufacturing workforce."
1,,Cotton World,,No,5,3250,80.4,>10 Years,,"Manufacturing unit, Processing unit","Accessories, Jersey, Woven",No / Not Reported,Bangalore,Karnataka,13.1007,77.5963,1987,Partnership,200,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Does not target an immediate phase-out of coal,"Tata CLiQ, H&M","cotton, linen, bamboo, and modal, emphasizing regional and eco-conscious textile production.","Mumbai, India, with retail stores distributed across various Indian cities.","Cottonworld Initiatives: Our Commitment to Sustainability
https://cottonworld.net/pages/initiative?srsltid=AfmBOooiOqQWPLyAiazAyS0GPE5LV0QjoC_sYhf12AOd7YbSsq6PjuBE",Not Stated,2026-10-03,Verified,Ankita D,"ENTITY SETTLED from H&M's own supplier list. ""Cotton World"" is a PARTNERSHIP FIRM (no CIN exists for firms), principal address Plot B-34/B-35, KSSIDC Yelahanka Industrial Estate, Bengaluru 560064; GSTIN 29AABFC0495N1Z3. Founded 1994 by B.N. Monnappa; garment manufacturer-exporter. H&M lists five owned factories - Hindupur (Andhra Pradesh) and four in Bangalore - which matches this firm's footprint exactly. It is NOT the Colaba, Mumbai ""Cottonworld"" retail brand, which is a different entity in a different business.

No quantified environmental disclosure exists. As a partnership firm it has no BRSR obligation and files no public annual report, so none is expected. The only sustainability-adjacent statement on its site is a buyer-scorecard claim (""Gold Supplier"" / ""Platinum rating"" from H&M) - not a figure. Absent from the SBTi register.","124/150
Internal H&M Assessment / Audit System: H&M evaluates suppliers using internal scorecards (such as their Green Fashion Initiative or internal sustainability evaluations) that rate factories out of total weighted points (e.g., 150 points total)."
1,,Le-Shark Global Llp,,No,3,3250,64.6,>10 Years,,"Component unit, Manufacturing unit, Processing unit","Accessories, Jersey",No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,2011,LLP,2000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Reputed international customers,Knitted and printed garments,India,lesharkglobal.com,Not Stated,2026-09-11,Verified,Ankita D,"No GOTS or ISO14001. No Scope 1/2, energy, or water figures found. No public Scope 1 / Scope 2 GHG, energy consumption, or water consumption figures available.
As a private LLP, the company does not file public SEBI BRSR reports or publish direct CDP climate disclosure ratings.
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.","OEKO-TEX Standard 100: Confirmed / Active certification for product chemical safety.

ISO-9002: Quality management standard verified.

GOTS / ISO 14001: Not GOTS certified and No ISO 14001 certification found."
1,,K.H. Exports India Private Limited,,No,3,3250,74.2,6-10 Years,,"Component unit, Manufacturing unit","Accessories, Bag&Belt, Footwear",Yes,Chennai,Tamil Nadu,13.0827,80.2707,1985,Private Ltd,1512,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),Not Disclosed,Not Disclosed,No,No,"Focuses heavily on resource efficiency—specifically minimizing water and energy consumption across operations and partner tanneries—however, specific numeric corporate targets for a 100% renewable energy transition or net-zero timeline are not publicly itemized on their core sustainability portal.","There is no explicit coal phase-out policy or timeline officially stated in their corporate governance or sustainability framework. Their primary energy and environmental focus remains centered on reducing resource volatility, optimizing operational technology, and adhering to strict LWG standards in partner tanneries.","Specific names of major retail or brand buyers are kept confidential as part of their standard export and manufacturing business arrangements, though they supply global leather goods markets adhering to international ethical and environmental standards.",leather,"Chennai, Tamil Nadu, India.","KH Group
https://khindia.com/sustainability",Not Stated,2026-09-11,Verified,Ankita D,"Leather Working Group (LWG) certification is a genuine, verifiable environmental credential specific to tanneries — noted here since GOTS/ISO14001 don't apply to a leather-goods manufacturer the same way; left the GOTS/ISO14001 dropdown fields ""No"" since neither is the right certification for this industry. No Scope 1/2, energy, water figures found. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.


Leather Sourcing & Standards: The leather used in their products is sourced from tanneries in the Ranipet District, India, that are audited and certified by the Leather Working Group (LWG)—representing the highest environmental standard for leather tanning. These partner tanneries focus on reducing water and energy consumption, minimizing hazardous substances, implementing material traceability, and fighting against deforestation practices.

Resource Efficiency & Technology: The company utilizes resource-efficient technology to minimize environmental, social, and human impact while adhering to international and national business ethics.

Business Strategy & Framework: KH Group recognizes critical sustainability challenges—such as fluctuating resource availability, strict government regulations, rising stakeholder expectations, and investor scrutiny. To address these, they have implemented a comprehensive Sustainability Framework and policies designed to place sustainability at the core of their business operations, supported by employee training and education.

SBTi: The leather goods division committed and the commitment lapsed on 14/12/2023 without targets being set. Source: https://sciencebasedtargets.org/target-dashboard",Not Applicable - ESG Score not disclosed
1,,Atlas Export Enterprises,,No,2,3250,66.4,3-6 Years,,"Component unit, Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Karur,Tamil Nadu,10.9601,78.0816,1978,Private,5000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term + net-zero, 1.5C)",Not Disclosed,Not Disclosed,No,No,5 MW captive capacity; began RE sales to 3rd parties in FY25,Not Disclosed,"Diversified clients in UK (21%), Sweden (12%), Germany, US, France","Cotton yarn, linen, jute, and bamboo","Karur, Tamil Nadu",https://sciencebasedtargets.org/target-dashboard,FY2023-24,2026-09-11,Verified,Ankita D,"Since Atlas Export Enterprises is a privately held partnership/unlisted entity, it is not legally required to publish public SEBI BRSR annual reports or audited ESG filings.

Google search surfaced an unconfirmed mention of CDP participation — not verified, not treated as an active score

Environmental Infrastructure: Employs Zero Liquid Discharge (ZLD) wet-processing operations, renewable energy integration, and certified organic/recycled raw material sourcing.
On-Site Renewable Infrastructure: Atlas Export Enterprises has installed its own captive solar power unit at its manufacturing facilities in Karur, Tamil Nadu.

Energy Strategy: Sourced through direct solar plant installations and wind power initiatives, helping drive their SBTi-validated net-zero emission commitments.
Effluent Treatment Plant (ETP): Indicates that 100% of industrial process wastewater generated at their dye house and processing mills undergoes full in-house treatment.

SBTi: Validated 27/11/2025: near-term Scope 1+2 and Scope 3 to 2033 from a 2023 base; net-zero by 2050. Source: https://sciencebasedtargets.org/target-dashboard","Certifications & Standards: Holds OEKO-TEX Made in Green, OEKO-TEX STeP, SMETA/SEDEX, Higg Index (HIGG-FEM & HIGG-FSLM), and OEKO-TEX Standard 100 certifications."
1,,Shenghong Group,,No,1,3000,64,>10 Years,,"Manufacturing unit, Processing unit",Denim,No / Not Reported,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,https://hmgroup.com/sustainability/leading-the-change/transparency/supply-chain/,Not Stated,2026-10-05,Verified,Ankita D,"ROW CLEARED 2026-10-05 - DATA ARTIFACT, EXCLUDE FROM PUBLICATION AND FROM ALL COUNTS.

This is not a supplier. H&M's supplier list records the name ""Shenghong Group"" against a factory called ARVIND LIMITED (BOMMASANDRA UNIT), No. 12, 4th Cross, Bommasandra Industrial Area, Hosur Road, Bangalore - denim manufacturing and processing, 2001-4000 workers, owned, >10 years with H&M.

Research established no link whatsoever between Shenghong and that unit: no acquisition, no joint venture, no Arvind divestment, and no Indian Shenghong entity (no CIN, no registered office, no subsidiary or branch). The Bommasandra site is Arvind's own and has operated since 2005. H&M's list separately carries ""Shenghong Group Co., Ltd. - Premium"", a Chinese mill in Wujiang, Suzhou, also >10 years with H&M. The two records appear to have been merged on a supplier-name key.

The Indian factory behind this row therefore belongs to Arvind Limited, which is already row 3 of this pack and is Live. All researched fields have been cleared so that nothing incorrect can be rendered or counted. Treat this row exactly like the ten roll-up rows: verified as to what it is, and excluded from the public profiles and from any supplier total.

Outstanding with H&M: ask them to correct the mis-join, and whether the Bommasandra factory should be added to their Arvind record.",Not Applicable - ESG Score not disclosed
2,,Cta Apparels Pvt. Ltd.- Fabric Mill,,No,1,250,,6-10 Years,,"Component unit, Manufacturing unit, Processing unit",Woven,No / Not Reported,Noida,Uttar Pr.,28.58,77.31,1993,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,Not Disclosed,Yes,Yes,Not Disclosed,Not Disclosed,"Major global fashion brands and retailers (including H&M, Marks & Spencer, Cecil, Street-One, and Kappahl)",Cotton and Man-Made Fibers (including organic cotton and 100% recycled polyester),"India (In-house vertical processing, weaving/knitting units in Noida and Pilkhua, Uttar Pradesh)",https://ctaapparels.com/sustainability,FY2025-26,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Cta Apparels Private Limited (CIN U74899DL1993PTC052505, RoC Delhi, operating from A-60 Sector 58, Noida).

Relationship: Division of the same legal entity - the in-house vertically integrated woven mill. No separate CIN exists.

Unit-level disclosure: No disclosure of its own.",Not Applicable - ESG Score not disclosed
1,,Brandix Asia Holdings Pte Ltd,,No,1,3000,94.5,3-6 Years,,Manufacturing unit,Underwear/Swimwear,No / Not Reported,Vizag,Andhra Pradesh,17.6868,83.2185,1972,MNC Sub.,Not Disclosed,319,"14,678",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term + net-zero, 1.5C)",Not Disclosed,Not Disclosed,Yes,No,Net-zero roadmap aligned with SBTi; 50% sustainable sourcing by 2027,Part of net-zero environmental impact strategy,Leading partner-brands in the global fashion industry,"BCI Cotton, Organic, CMIA, and recycled materials","Sri Lanka, India, and Bangladesh","Brandix ESG Report

https://brandix.com/wp-content/uploads/2025/10/Brandix-ESG-Report-24-25.pdf",FY2024-25,2026-09-12,Verified,Ankita D,"Figures were directly taken from sustainability report. Scope & Boundary: Covers all entities and manufacturing facilities owned and operated by the Group across Sri Lanka, India, and Bangladesh. 

Frameworks & Standards: Reported in accordance with GRI Standards, with voluntary inclusions from IFRS S1 & S2 standards and the SASB Apparel, Accessories & Footwear Standard. External assurance was conducted by Ernst & Young.

HELD FROM VERIFICATION: supplier identity is not settled - see the QA Review Register.

SCOPE MIXING - read carefully. Scope 1 (319) and Scope 2 (14,678) ARE India-specific: the ESG report country table gives India diesel 101.53 + refrigerant 217.54 = 319.07 tCO2e Scope 1, and grid electricity 14,678.74 tCO2e Scope 2. Everything else on this row is GROUP (Sri Lanka + India + Bangladesh): energy 460,866 GJ, renewable 37%, solar 18.8 MW, water 1,011,098 m3. Group Scope 1+2 is 32,010 tCO2e, not 14,997. Reporting entity is Brandix Lanka (Pvt) Ltd, not ""Brandix Asia Holdings Pte Ltd"".",95% (Higg)
1,,Intimate Fashions (India) Pvt Ltd,,No,1,3000,86.3,3-6 Years,,Manufacturing unit,"Jersey, Socks/Tights/Micro tights",No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,1998,Joint Venture,2500,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,https://tracxn.com/d/legal-entities/india/intimate-fashions-india-private-limited/__l28_7JPdJ5jZMYNGxfZ-Jv6MUq1e7Zv8mV6guamp7OQ,Not Stated,2026-10-03,Verified,Ankita D,"ENTITY SETTLED. INTIMATE FASHIONS (INDIA) PRIVATE LIMITED, CIN U18101TN1997PTC037536, incorporated February 1997, RoC Chennai. Registered office Thiruporur Kottamedu High Road, Nandivaram Village, Guduvancheri, Kancheepuram district, Tamil Nadu 603202 - matching H&M's listed address.

CONSOLIDATION: this is a three-way JOINT VENTURE promoted by Triumph International (Liechtenstein), Mast Industries (USA) and MAS Holdings (Colombo) - not a wholly-owned MAS subsidiary. MAS is private and publishes no audited consolidation schedule, so the boundary cannot be confirmed and full consolidation into MAS is unlikely. MAS group figures are therefore deliberately NOT applied to this row. H&M also lists this as a separate supplier from Brandix, whose India factory is Brandix Intimate India Pvt Ltd at Visakhapatnam - a different entity.

No entity-level disclosure exists; outside SEBI BRSR scope. Absent from the SBTi register.","SLCP Verified
SLCP stands for the Social & Labor Convergence Program.
The facility has completed an accredited third-party social & labor audit.H&M accepts this verified report to confirm workplace safety, fair wages, working hours, and labor compliance without requiring a separate internal social audit."
1,,Laguna India Private Limited,,No,1,3000,58.3,3-6 Years,"Global Organic Textile Standard (GOTS), Global Recycle Standard (GRS), Masters of FLAX FIBRE, Organic Content Standard (OCS), Recycled Claim Standard (RCS), Responsible Wool Standard (RWS)",Manufacturing unit,Woven,No / Not Reported,Bangalore,Karnataka,12.9121,77.5946,1990,Private Limited Company,1000,"19,725","32,184",51909,57,"1,087",2.63,"1,714,465",Not Disclosed,47.74,Not Disclosed,Committed,Not Disclosed,Not Disclosed,Yes,Yes,Over 80% by 2030 (with an intermediate target of 60% by 2025),"Achieved / Completed (coal has been completely eliminated as a fuel across operations, including the CFL mill in Mauritius and the COTONA joint venture in Madagascar)",Not Disclosed,"Cotton (along with certified sustainable/organic cotton, synthetic fibers, and blended yarns)","Sourced and processed across CIEL Textile's core operating footprint: Mauritius, Madagascar, India, and Bangladesh.","CIEL_Textile_Winning_Well_Altogether_report_2024.pdf

https://cieltextile.com/sites/default/files/sustainablity/CIEL_Textile_Winning_Well_Altogether_report_2024.pdf",FY2022-23,2026-09-11,Verified,Ankita D,"Laguna India is an important manufacturing unit operating under CIEL Textile's Woven cluster in India.

Laguna Clothing Private Limited (Laguna India), a joint venture of CIEL Textile and Readiness Group, integrates sustainability into its garment manufacturing operations. Rather than publishing an independent standalone corporate report, its environmental and social milestones are governed and highlighted through CIEL Textile's Sustainability Reporting

1. Community Impact & Corporate Social Responsibility (CSR)
Clean Water Initiative: In partnership with Aquarelle India, Laguna India installed Reverse Osmosis (RO) water purification plants to provide safe drinking water to surrounding communities, successfully supplying clean water to 1,500 people in local villages.

2. Workforce Highlights & Employee Engagement
Employee Spotlights: The report highlights individual employees from Laguna India—such as Pushpa and Snigdha—showcasing workforce diversity, inclusion, and the company's commitment to employee well-being and engagement on the shop floor.

3. Sustainability Assessments & Manufacturing Footprint
Higg Index Integration: Laguna India (including the Doddaballapura unit) participates in the group's annual evaluations using Cascale's sustainability framework, specifically the Higg Facility Environmental Module (FEM) and Facility Social & Labor Module (FSLM).

Baseline Impact: The integration and initial assessments of newer units like Laguna India and Aquarelle India into these global benchmarks accounted for slight adjustments in group-wide modular score averages as they underwent their first verified assessments.



Energy Carbon Intensity (tCO2e/TJ) : Not specifically scored as a single ESG rating in the report (uses Higg Index: FEM 87.6 FSLM 92.6","Key Highlights of Laguna's LEED Platinum UnitsFacilities Certified:Dodballapur Unit (Bengaluru): Awarded LEED v4.1 Platinum rating under Existing Buildings: Operations and Maintenance.Kanakapura (KPR) Unit (Bengaluru): Achieved LEED v4.1 Platinum certification scoring 84/100 points.Environmental & Operational Performance Metrics:Energy Efficiency: Installed 425 kW captive rooftop solar PV systems, lowering energy consumption by over 60% with naturally ventilated, low-LPD LED facilities.Water Management: Zero-discharge site operations achieving over 40% potable water savings via 100% tertiary-treated wastewater reuse and rainwater harvesting.Zero Waste to Landfill: Directs 100% of post-industrial fabric scraps (chindi) and waste to third-party recycling streams."
2,,Dileep Crafts Private Limited,,No,1,250,13.5,>10 Years,Forest Stewardship Council Chain of Custody (FSC COC),Manufacturing unit,Home (hardgoods),No / Not Reported,Jaipur,Rajasthan,26.9124,75.7873,1988,Private Ltd,108,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Biomass,Biomass fuel replacements,Anthropologie,"Stone, sustainable timber, eco-mix","Jaipur, Rajasthan",https://tracxn.com/d/legal-entities/india/dileep-art-and-crafts-private-limited/__HrZ3p_njt0W5cAw4UEKsH0PeXx_V8VlqdFLT5ABW0lM,FY2024-25,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No sustainability disclosure found; company registration confirmed via Tracxn.
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Sustainable Material Innovation: Known for pioneering Ecomix (utilizing recycled paper-mache and eco-resins) alongside sustainably harvested timber.
Certifications & Standards: Operates under strict compliance guidelines matching FSC (Forest Stewardship Council) standards for wood sourcing and ISO 9001 quality frameworks.   
Global Compliance: Supplies major international retail brands (including H&M, Pottery Barn, and Zara Home), ensuring adherence to ethical manufacturing, non-hazardous finish coatings, and safe food-grade standards.
Grid-Tied: Indicates that the manufacturing and artisan processing facilities in Jaipur utilize utility-connected solar photovoltaic systems. This allows them to balance onsite renewable electricity generation with the public grid, ensuring stable power for workshops while minimizing reliance on fossil-fuel-generated power.
Recovered: Tracks the company's internal waste management and circularity measures—specifically capturing post-industrial wood scraps, clay/ceramic dust, or water used in processing and finishing lines to prevent landfill waste and maximize resource efficiency.
Eco-Mix: Represents Dileep Crafts' signature proprietary material composite blends (often featuring recycled paper-mache, organic plant fibers, and eco-resins). Used extensively in crafting lightweight, sustainable home accessories and decorative vases as an eco-friendly alternative to virgin plastics and energy-intensive synthetic resins.



47.74 tCO2e/TJ (Calculated from total Scope 1 + 2 emissions of 51,909 t divided by total energy of 1,087 TJ)

Search record: BRSR report, Sustainability Disclosure, Annual Report, CDP disclosure searched via google, no sustainability disclosure found; company registration confirmed via Tracxn.","Phi Capital Inv
Phi Capital incorporates structured Environmental, Social, and Governance (ESG) frameworks—benchmarked against IFC Performance Standards and International Labour Organization (ILO) conventions—into its portfolio management and oversight."
1,,Radiaant Expovision Pvt. Ltd.,,No,2,2250,,<3 Years,,"Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Noida,Uttar Pradesh,28.5355,77.391,2019,Private,3500,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),Not Disclosed,Not Disclosed,No,No,Replace fossil fuel-based energy with renewable energy by 50% of intensity (per sq. ft.) by FY2026-27.,Focus on replacing fossil fuel-based energy in stores; retail operations do not use industrial coal stacks.,EU/US Retail,Apparel,Delhi,https://radiaantexpovision.in/sustainability/,Not Stated,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Product Safety & Material Integrity Certifications
OEKO-TEX Standard 100: Tests textiles for harmful substances.

GOTS (Global Organic Textile Standard): Verifies organic status from harvesting to labeling.

GRS (Global Recycled Standard): Tracks and verifies recycled content.

Better Cotton: Promotes measurable improvements for cotton farmers and the environment.

European Flax: Certifies premium quality, traceable European flax fiber.

Chemical Management & Environmental Accounting
ZDHC (Zero Discharge of Hazardous Chemicals): Principles for responsible chemical management.

Higg Index: Measures environmental performance and footprint.

CDP: Climate disclosures for environmental transparency.

Science Based Targets (SBTi): Framework for emissions reduction pathways.

RESET Carbon: Carbon accounting and advisory services.

Supply-Chain Transparency & Social Responsibility
Sedex: Transparent supply-chain assessments and ethical data sharing.

SCAN (Supplier Compliance Audit Network): Supply chain security audits.

SLCP (Social & Labor Convergence Program): Reinforces social responsibility and worker welfare.

C-TPAT (Customs-Trade Partnership Against Terrorism): Validates supply-chain security.

SBTi: Both near-term and net-zero commitments removed. The company website still references science-based target alignment. Source: https://sciencebasedtargets.org/target-dashboard",Not Applicable - ESG Score not disclosed
1,,Stonemen Crafts India Private Ltd,,No,2,2250,7.6,<3 Years,"Forest Stewardship Council Chain of Custody (FSC COC), Global Recycle Standard (GRS), Recycled Claim Standard (RCS)",Manufacturing unit,"Accessories, Home (hardgoods)",No / Not Reported,Agra,Uttar Pradesh,27.1767,78.0081,1995,Private Limited Company,600,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term + net-zero, 1.5C)",Not Disclosed,Not Disclosed,Yes,No,Not Disclosed,Not Disclosed,"Williams Sonoma Singapore Pte Ltd, Target Stores Pvt Ltd, Euro-market Designs Inc.","Natural Stones (primarily Marble, Alabaster, Granite, Sandstone, Slate, and Soapstone), combined with secondary materials like wood, metal, and resin","Agra, UP",https://sciencebasedtargets.org/target-dashboard,FY2022-23,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Lack of Standalone Sustainability Report: Stonemen Crafts India Private Limited does not publish a standalone or public corporate sustainability report.

Environmental Approvals & Compliance: The company maintains a valid Consent to Operate (CCA) certification under state pollution control regulations through the Uttar Pradesh Pollution Control Board. This certification covers environmental compliance for its manufacturing operations through March 31, 2026.

Waste Management: The company partners with certified external agencies for the safe handling, recycling, and disposal of industrial waste.

Quality & Safety Systems: Production lines incorporate Quality Management Systems (QMS) and relevant chemical safety protocols for hardgoods and home decor items.


Formally committed to obtaining SBT Net-Zero certification within 24 months. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

SBTi: Validated 28/11/2024: absolute Scope 1+2 -85.9% by 2032 from a 2022 base; renewable electricity from 8.8% (2022) to 100% by 2030. Source: https://sciencebasedtargets.org/target-dashboard",Not Applicable - ESG Score not disclosed
1,,Network Clothing Company Pvt. Ltd.,NETWORK CLOTHING COMPANY PVT LTD; NETWORK CLOTHING COMPANY PVT. LTD.,No,4,2000,45.8,>10 Years,"Global Organic Textile Standard (GOTS), Global Recycle Standard (GRS), Organic Content Standard (OCS), Recycled Claim Standard (RCS)","Component unit, Manufacturing unit, Processing unit","Accessories, Jersey",No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,1999,Private,5000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Targeted the installation of Solar and Bio-gas plants by the end of 2016 (Action Plan).,Committed to a six-area environmental action plan including air quality and energy.,Global Brands,Organic Cotton,"Tirupur, Tamil Nadu",https://nccindia.com/#sustainability,Not Stated,2026-09-11,Verified,Ankita D,"Solar Capacity / Energy: Wind Captive / Clean energy usage noted in tracker.
Water Management: Zero Liquid Discharge (ZLD) site with high water recovery standards.
Waste Management: Active fabric and waste Upcycling initiatives noted.Reporting is driven by organic cotton certifications and Tier 1 procurement transparency for the French Government. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Water Management: Achieves 93% recycled water usage, supported by its processing unit operating as a Zero Liquid Discharge facility since 2001.

Energy & Power: Utilizes 98% renewable energy across operations and is 100% coal-free.

Materials & Chemistry: Uses 100% ZDHC MRSL-compliant dyes to ensure chemical safety and responsible manufacturing.

Performance Assessment: Reached a score of 63% in the Higg FEM Verified Assessment, outperforming the global average score of 48.08%.


ISO 9001:2000: Robust quality systems ensuring overall product quality and standardized manufacturing processes.   

Oeko-Tex Standards: Benchmarks applied for product quality and consumer safety.   

ZDHC MRSL Compliance: Uses 100% Zero Discharge of Hazardous Chemicals Manufacturing Restricted Substances List-compliant dyes.

Higg FEM Verified Assessment: Scores 63%, well above the global average score of 48.08%.

Zero Liquid Discharge (ZLD): Certified and operated through its dedicated processing unit (NCC Spectra) established to eliminate wastewater discharge.   

Other Industry Standards & Partner Certifications: Often associated with standards like GOTS (on request), WRAP, and OEKO-TEX Standard 100 across its partner and production ecosystems.

Network Clothing publishes 98% renewable energy, 93% recycled water and a Higg FEM score of 63 as animated counters. The figures do not render on the live page and carry no reporting year, no boundary, and no statement of whether ""renewable"" means electricity or total energy. Recorded as unverified company claims and deliberately NOT entered in the columns.","Higg FEM
Higg (specifically Higg FEM - Facility Environmental Module):
Focus: Environmental impact.
What it measures: Energy use, greenhouse gas (GHG) emissions, water consumption, wastewater, air emissions, waste management, and chemical management.
How it works: Facilities complete a standardized assessment to measure and quantify their environmental performance year-over-year."
1,,Asian Fabricx Private Limited,,No,3,2000,81.3,3-6 Years,,"Component unit, Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Karur,Tamil Nadu,10.9601,78.0816,1974,Private Ltd,4000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,68,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),Not Disclosed,Not Disclosed,No,No,Implementation of ISO 50001 energy management systems.,Complies with local cluster environmental regulations.,IKEA,Home Furnishings,"Karur, Tamil Nadu",https://www.asianfab.com/we_are_responsible.html,Not Stated,2026-09-11,Verified,Ankita D,"Recognized as an SBTi-committed entity working toward a 1.5°C-aligned Net-Zero roadmap. 
Water Recovery: Highlighted at 95% Recov. (Water recycling & recovery standards).
Waste Management: Highlighted at 80% Sludge (Sludge reduction/management metrics).
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Windmills and Solar for Energy conservation and contributing to sustainable development

SBTi: Both commitments removed from the register. Source: https://sciencebasedtargets.org/target-dashboard","Texprocil Silv 
It refers to the TEXPROCIL Silver Award (or Silver Recognition) awarded by The Cotton Textiles Export Promotion Council of India for export performance/sustainability standards in cotton textiles."
2,,Raj Overseas,,No,5,1750,17.4,>10 Years,,"Component unit, Manufacturing unit, Processing unit","Accessories, Home (textile)",No / Not Reported,Panipat,Haryana,29.3909,76.9635,1939,Unlisted Private,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),Not Disclosed,Not Disclosed,Yes,Yes,Engaged in the Lindex Climate Roadmap which identified potential for 20-30% emission reductions.,Focus on social sustainability and women's empowerment via Project Sehat and Mukta.,H&M,"Wool, Cotton, Jute","Panipat, Haryana","

https://rajgroup.in/csr-sustainability/

",Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Renewable Energy & Environmental StewardshipClean Energy: Captive solar and wind power installations across Haryana, Rajasthan, and Maharashtra.Eco-Materials & Zero Waste: Focuses on natural fiber processing, REACH-certified non-toxic dyes, and circular recycling certifications (GRS / Global Recycled Standard, OEKO-TEX, GOTS).

Water Targets: Targeted -25% Water Footprint reduction

Waste Targets: Targeted -50% Waste Generation reduction
",94% (FEM)
2,,Dileep Potteries Pvt Ltd,,No,1,250,34,6-10 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Jaipur,Rajasthan,26.9124,75.7873,2012,Subsidiary,348,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"Zara, H&M",Handcrafted stoneware/ceramics,Jaipur and Karnataka,https://tracxn.com/d/legal-entities/india/dileep-potteries-private-limited/__JBGP4Wlg5p9hT-bkw7FYzXxiZWUMjCe_9_9K2shQL3A,Not Stated,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Tracxn.
The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Search record: BRSR report, Sustainability Disclosure, Annual Report, CDP disclosure searched via google, no sustainability disclosure found; company registration confirmed via Tracxn, Justdial.","Pottery Barn Std
It refers to compliance and social/environmental audit standards specified by Pottery Barn (part of parent company Williams-Sonoma, Inc.).Audit Overview: Williams-Sonoma / Pottery Barn requires suppliers to comply with their strict Vendor Code of Conduct, which covers labor practices, human rights, health and safety, and environmental protection. They issue audit performance grades (typically from A to D) or accept verified third-party equivalency reports"
2,,Tata International Limited,Tata International; Tata International Limited,No,2,1750,81.2,3-6 Years,,"Component unit, Manufacturing unit","Bag&Belt, Footwear",No / Not Reported,Mumbai,Maharashtra,19.076,72.8777,1962,Public Limited Company (Subsidiary / Part of the Tata Group),8363,Not Disclosed,Not Disclosed,"20,612",Not Disclosed,79,Not Disclosed,"239,367",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,Not Disclosed,Yes,No,Not Disclosed,Achieved / Phased Out,"Tata International supplies footwear products to H&M. Tata International supplies leather products and footwear to several international brands and retailers, with H&M featuring prominently alongside other global names like Zara, Marks & Spencer, Clarks, and Timberland. These products are manufactured primarily through Tata International's specialized facilities in Tamil Nadu, India (such as Walajapet, Ranipet, and Ambur).",Leather,"Primarily concentrated in India (Tamil Nadu facilities at Walajapet, Ranipet, and Ambur, alongside units in Dewas and Chennai)","Tata International_AR 2024-25_ESG Report_2024-25
https://www.tatainternational.com/wp-content/uploads/pdf/Tata%20International_AR%202024-25_ESG%20Report_Inside.pdf",FY2024-25,2026-09-12,Verified,Ankita D,"Tata International Limited is a large, multi-industry GLOBAL trading company (metals, agri, auto distribution, leather, minerals) operating in countries across globe.

1. Environment & Circular Economy
Muda-Phoenix Initiative: Focuses on waste minimization, material reuse, and resource optimization. It uses patented technologies to recover protein hydrolysate from shaving dust and convert leather waste into syntans.

2. Renewable Energy & Emission Reductions: Accelerated transition to renewable energy sources such as solar power and biogas sourced from municipal waste, alongside phasing out coal usage. 10% of electricity consumption was met through rooftop solar panels on manufacturing plants.

3. Water Stewardship: Implemented Zero Liquid Discharge (ZLD) systems across operations, rainwater harvesting, and Sewage Treatment Plants (STPs) to ensure no liquid effluent is released into the environment and freshwater usage is minimized.

4. Ferrous Scrap Trading: Handled 400 KMT of scrap through collection terminals in Amsterdam and Klaipeda to promote secondary raw materials and reduce the carbon intensity of primary steel production.

FY2024-25. Renewable: 10% of electricity consumption met by solar (electricity basis - no energy-basis figure is published). Total energy is disclosed as 21,919,697 kWh; the column carries the TJ conversion. The ESG Scorecard labels 20,612 tCO2e as ""Scope 1 & 2 Emissions Intensity"", but tCO2e is an absolute unit - the source label is internally inconsistent.",Not Applicable - ESG Score not disclosed
2,,Premier Fine Linens Pvt Ltd,,No,2,1750,,<3 Years,,"Component unit, Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Coimbatore,Tamil Nadu,11.0161,76.971,1995,Unlisted Private,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,Yes,Focus on family-friendly policies and social accountability since 2020.,Not Disclosed,M&S,Cotton & Blends,"Coimbatore, Tamil Nadu",https://www.premierfinelinens.com/sustainability.html,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

99%+ Water Recycling: Factories are equipped with modern effluent treatment plants that enable almost 99% of water to be reused.

70%+ Renewable Energy: Over 70% of the green energy utilized across factories is powered by windmills.

1,000,000 sq. ft. Rainwater Harvesting: Extensive infrastructure covers one million square feet dedicated to rainwater harvesting.

90%+ Reduced Heat Emission: Modern techniques have successfully reduced heat emissions to the atmosphere by more than 90%.

50%+ Heat Recovery System: Advanced technology is used to achieve over 50% heat recovery in operations.

99%+ Sustainable Fibers: Over 99% of production relies on natural and sustainable fibers.

Waste Management & Bio Gas: Bio gas plants and established waste management systems are active in all factories to decompose industrial waste in eco-friendly ways.

Employee Transportation: Employees are encouraged to carpool or use company-provided transport to help minimize pollution.

Clean Energy Sourcing: Premier Fine Linens powers its manufacturing facilities using captive wind mills / wind farms

Recovery Rate: Over 99% of process wastewater is treated and recycled back into operations, significantly reducing fresh water intake.

Renewable energy: the company website claims ""over 70% renewable energy"" but the same page also uses 70% to mean the windmill share of green energy. Undated, no denominator, no reporting period. Recorded as a claim, not entered as a figure.",SAP Integrated
2,,Fiabila India Pvt Ltd,,No,1,250,,6-10 Years,,Manufacturing unit,Beauty,No / Not Reported,Taloja,Maharashtra,19.09,73.13,1995,Private Ltd,66,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Zara Home,"Natural clay HNTs, green solvents","Taloja, Maharashtra",https://www.fiabila.net/wp-content/uploads/2023/01/CSR-REPORT-2023.pdf,Not Stated,2026-09-12,Verified,Ankita D,"A major nail polish/lacquer manufacturer. The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. 

The parent group publishes consolidated environmental and corporate social responsibility updates, such as the CSR Report 2023, rather than issuing a separate standalone local report for the Indian entity.


Certifications & Ratings
EcoVadis: Awarded the highest sustainability rating—the Platinum Medal—for the third consecutive year in 2022, placing Fiabila among the top 1% of assessed companies in its industry.

SMETA 4P Audits: Audited annually on-site by an independent organization across all French sites to meet the SMETA 4P standard (covering ethical, social, environmental, and responsible purchasing) with results published on the SEDEX platform.

UN Global Compact: A member of the United Nations Global Compact program since 2020, publishing annual progress reports on CSR.

Environmental Policies & Lowering Impact
Solvent & Emission Controls: Maintenon (France) and Linden (USA) production sites are equipped with Regenerative Thermal Oxidizers (RTOs) monitored by Continuous Emissions Monitoring Systems (CEMS) to minimize Volatile Organic Compounds (VOCs) and solvent emissions. The Maintenon site reduces releases to half the limits required by French regulations.

Waste Reduction & Recycling:

Installed 16 storage tanks (450-ton total capacity) in 2015, eliminating 5,000 drums per year.

Recycles more than half of dirty solvents on-site for cleaning manufacturing tanks.

100% of wastewater is treated and 100% of hazardous waste is recycled by local partners.

Overall, more than 83% of total waste produced was recycled or reused in 2021.

Paper, cardboard, and plastic pallet films are segregated internally for 100% recycling.

Energy Audits: Regularly conducts energy audits at the Maintenon site via accredited firms (last conducted in 2021).

Industrial Safety: Strict hazard controls, sprinkler systems installed across historical and international sites (Maintenon since 2008, Brazil since 2017, USA since 2018), and a storm basin for fire water containment.

Sustainable Sourcing & Raw Materials
Supplier Standards: Evaluates suppliers using high standards, requiring ISO 22716 certification, ECOVADIS environmental and ethical certification, and certificates of conformity for all cosmetic raw materials.

Compliance Frameworks:

REACH: Complies with REACH for all raw materials purchased.

RSPO (Roundtable on Sustainable Palm Oil): Promotes and encourages suppliers to use sustainable palm oil and derivatives.

CITES: Ensures all protected raw materials adhere to Washington Convention rules.

Conflict Minerals: Does not purchase mineral ingredients from conflict zones.

RMI (Responsible Mica Initiative): Favors Mica pearl sourcing from suppliers adhering to the RMI.

Bio-Sourced Innovations: Since 2010, has marketed formulas containing a majority of bio-sourced raw materials of renewable origins, with some nail polish formulas consisting of over 85% bio-sourced raw materials.

Banned Materials: Early pioneer in banning raw materials affecting health or the environment (e.g., formaldehyde resin-free in 1997; camphor, DBP, and toluene-free in 2001; formaldehyde-free nail hardeners in 2001; global toluene ban across all products in 2008).

Animal Protection
Animal testing for cosmetic products has been banned since 2004, and for raw materials since 2014.

Enforces strict non-animal testing policies across all suppliers and supports brand certifications such as Cruelty Free International (CFI).

Search record: No sustainability disclosure found; company registration confirmed via company's web page.

Parent group (Fiabila, France; 7 subsidiaries) publishes a CSR report with EcoVadis PLATINUM, top 1% of assessed companies (2022, third consecutive year), and 83% of total waste recycled or reused (2021). GROUP-level - the report names the Indian site only in relation to filling machines and gives no India-entity environmental figure, so nothing is entered in the columns. Source: https://www.fiabila.net/wp-content/uploads/2023/01/CSR-REPORT-2023.pdf. Note the registered office is Taloja, Maharashtra (U24222MH1995PTC086610).","MoCRA Compl.
Meaning: It stands for MoCRA Compliant (Modernization of Cosmetics Regulation Act compliance).Regulation Overview: MoCRA is a U.S. FDA regulatory framework passed to ensure the safety and compliance of cosmetic products and ingredients distributed in the United States."
2,,Gupta H.C. Overseas (I) Pvt Ltd.,,No,1,1500,2.6,>10 Years,,Manufacturing unit,"Bag&Belt, Footwear",No / Not Reported,Agra,Uttar Pradesh,27.1767,78.0081,1987,Unlisted Private,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,0.35,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Luxury brands,High-fashion leather,Agra / Intl,https://www.guptaoverseas.com/golife/,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no latest sustainability report on company site; not a CDP discloser.
Solar capacity figure inconsistent across sources (250kW in 2021 vs 350kW on the company's current site). Hence we are considering 350 kW, as it is disclosed through company website.  LWG-certified leather sourcing and GRS/BCI-certified inputs are real and specific but are supply-chain-input certifications, not the company's own GOTS/ISO14001 status. No Scope 1/2, absolute energy, or water figures found. 

Gupta H.C. Overseas (I) Pvt. Ltd. follows sustainability and eco-friendly practices under its GOlife

Solar: 350 kW solar power plant across all units, stated as saving 380 tonnes CO2 a year. Source states kW; the peak (kWp/MWp) designation is not disclosed. Confirmed genuine for this company - the identical 0.35 figure on Neokraft Global is the one to re-check.",Higg Index
2,,Marque Impex Pvt. Ltd.,,No,1,1500,3.1,>10 Years,,"Manufacturing unit, Processing unit",Home (hardgoods),No / Not Reported,Moradabad,Uttar Pradesh,28.8386,78.7733,1996,Private Limited,2156,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Not Disclosed,"Metal, Wood, Glass, and Brass",Not Disclosed,http://www.marqueimpex.com/,FY2024-25,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser

Corporate Social Responsibility (CSR) Filings
CSR Filings: The company has filed Form CSR-2 with the Ministry of Corporate Affairs (MCA), with the recent filing recorded on December 30, 2025. Form CSR-2 is mandatory for companies covered under India's Corporate Social Responsibility provisions to report their CSR activities, policy implementation, and expenditures..

Search record: BRSR report, Sustainability Disclosure, Annual Report, CDP disclosure searched via google and company website, no sustainability disclosure found. Company registration confirmed via Company Website.",Not Applicable - ESG Score not disclosed
2,,Basant,,No,1,1500,0.3,6-10 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Jodhpur,Rajasthan,26.28,73.02,1998,Private Limited,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,50,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Committed,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,H&M,"Wood, Metal, Marble","Jodhpur, Rajasthan",https://basant.info/about-us.html,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Renewable Energy %: source discloses a 50-75% range; 62.5 entered as the midpoint per the agreed convention.

ENTITY: this row is BASANT of Jodhpur (basant.info, founded 1998, wood/metal/marble furniture, lighting and decor; domestic brand Orange Tree). It is NOT ""Basant India Inc"", a separate Noida partnership firm (est. 1992) making apparel and bags. The two must not be merged. Renewable: 50% of total power consumption is solar based (single disclosed figure, no range).",FFSC Partner
2,,Soni International Jewelry Private Limited,,No,1,1500,21.4,3-6 Years,,"Component unit, Manufacturing unit, Processing unit",Accessories,No / Not Reported,Jaipur,Rajasthan,26.9124,75.7873,1917,Unlisted Private,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,H&M,Precious Materials,"Jaipur, India",https://www.soniinternational.com/in,Not Stated,2026-09-12,Verified,Ankita D," No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Their sustainability and corporate responsibility initiatives include:
100% Solar Powered Units: Company claims on its official website that they are utilizing renewable solar energy to power their manufacturing operations.
Waste & Water Management Systems: Implementing structured systems to manage waste and water responsibly.
CSR & Awareness Initiatives: Engaging in corporate social responsibility programs and awareness campaigns.
Tree Plantation Drive: Actively participating in environmental preservation efforts through tree planting initiatives.
Adheres to the Responsible Jewellery Council (RJC) Code of Practices (COP) for ethical sourcing. 
Zero Industrial Wastewater Discharge: Soni International operates an in-house wastewater treatment plant where 100% of manufacturing effluent and process water is treated and recycled back into facility operations.",RJC Member
2,,Teejay India Private Limited,,No,1,1500,,3-6 Years,,Component unit,,No / Not Reported,Vizag,Andhra Pr.,17.6868,83.2185,2009,Subsidiary,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),No,Not Disclosed,Yes,Yes,Strategy 2030,Not Disclosed,"PVH, Oniverse, VS&Co., Decathlon, Marks & Spencer, Nike, Uniqlo, LIDL, and Lacoste.","Yarn (spanning cotton, synthetic, man-made cellulosics, and blended fibers) and Greige raw materials (totaling over 21,000 MT of yarn and 23,000 MT of greige raw materials annually)","Visakhapatnam Hub, ndia, Bangladesh, Egypt, Indonesia, and Mauritius.","Teejay Integrated Annual Report

https://www.teejay.com/imgup/pdf/teejay-annual-report-2025-26.pdf",FY2025-26,2026-09-12,Verified,Ankita D,"The Group's Scope 1/2/3 GHG inventory is reported across Sri Lanka + India + other geographies combined, NOT broken out for Teejay India specifically.

Group-level disclosure only (Teejay Group, consolidated - NOT the India entity): Scope 1 68,395 tCO2e, Scope 2 28,482 tCO2e, combined 96,877.02 tCO2e, carbon intensity 89.81 tCO2e/TJ. Deliberately not entered in the columns, which cover Teejay India Private Limited only.

No entity-level environmental data exists for Teejay India Private Limited. Group figures (Teejay Lanka PLC, FY2025/26): total energy 1,078,661.75 GJ, water 2,544,186 m3, waste 7,062.16 MT, renewable 11%. Deliberately NOT entered - they are group, not India.",Higg FEM 97%
2,,Farida Shoes Private Limited,,No,2,1500,94.1,<3 Years,,Manufacturing unit,"Bag&Belt, Footwear",Yes,Ambur,Tamil Nadu,12.785,78.718,1976,Subsidiary,"4,371",297.55,"2,942.48","3,240.03",70,41.81,Not Disclosed,42223,Not Disclosed,77.49,Not Disclosed,Not Disclosed,No,Not Disclosed,Yes,No,42% Reduction,Not Disclosed,Luxury brands,"Leather (30%), Soles (50%)",90% Imported leather,https://farida.co.in/Content/GRI.pdf,FY2018-19,2026-09-12,Verified,Ankita D,"Farida Shoes Private Limited is one specific legal entity within the larger, multi-plant Farida Group — group-level history and awards are real but not necessarily specific to this entity’s own environmental footprint; did not attribute group-wide claims to this row without confirmation. ISO 9001:2015 is a quality standard, not GOTS/ISO14001. 
In-House / Dedicated Power Generation: Instead of buying open-market grid energy or third-party power, Farida Shoes utilizes a captive solar power setup (rooftop solar panels / dedicated solar array installed across their leather processing & footwear manufacturing units in Tamil Nadu).

FSPL sustainability report found is published for FY 2018-19. Hence, flagging it as backdated (8 years ago).

Figures are from the FY2018-19 GRI report (1 Apr 2018 - 31 Mar 2019) and confirmed against it: employees 4,371; Scope 1 297.55; Scope 2 2,942.48; renewable 70%; total energy 11,616 MWh (41.82 TJ); water consumed 42,223 KL. Scope 1+2 of 3,240.03 and intensity of 77.49 are DERIVED - the report prints neither. No newer report, CDP score or LWG entry was found.",LWG Gold
2,,Golden Fashions India Pvt Ltd,,No,1,1500,,<3 Years,,Component unit,,No / Not Reported,Erode,Tamil Nadu,11.341,77.7172,2012,Private Limited,67,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"H&M Group, Regional B2B textile traders,",Cotton / Woven / Cotton Grey Fabric,"Erode, Tamil Nadu (India)",https://tracxn.com/d/legal-entities/india/golden-fashions-india-private-limited/__v8yWj7WivXd6-4D84Zwurn4_HyuGD68kWrmF4b3-Rmg,Not Stated,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Tracxn.

Golden Fashions India Private Limited, a regional cotton grey fabric and textile manufacturer based in Erode, Tamil Nadu, does not publicly publish a dedicated corporate sustainability report or ESG disclosure. Because it is a private SME with an annual turnover of around INR 53.1 crores, formal standalone sustainability reporting is not publicly mandated

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Search record: BRSR report, Sustainability Disclosure, Annual Report, CDP disclosure searched via google, no sustainability disclosure found; company registration confirmed via Tracxn.",Not Applicable - ESG Score not disclosed
2,indo-count,Indo Count,,indo-count,1,1500,49.8,<3 Years,,Manufacturing unit,Home (textile),No / Not Reported,Mumbai,Maharashtra,18.922,72.8231,1988,Public Listed,7442,185243,105108,290351,Not Disclosed,Not Disclosed,9.3,Not Disclosed,Not Disclosed,Not Disclosed,67,Committed SBTi,No,B,Yes,Yes,Net Zero by 2040,Reducing coal via efficiency,"Walmart, Costco, Kohl's, Revman, JC Penney, Target","Cotton, Yarn, Fabric",No data,"Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2023-24,2026-07-01,Live,Already live,Already researched and shipped on the current dashboard — use as the reference example for depth/format.,
2,,Mohan Spintex India Limited,,No,1,1500,,<3 Years,,"Component unit, Processing unit",,No / Not Reported,Vijayawada,Andhra Pr.,16.5062,80.648,2005, Unlisted public limited,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,10.8,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Committed,No,Not Disclosed,Yes,Yes,Target 70% / 100% RE Transition Focus,100% (Husk),H&M,Cotton/Blend,Andhra Pr.,"https://www.mohanspintex.com/sustainability

The Textile Magazine Jan 2026
",FY2025-26,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.


1. Green Plantation
Focuses on green plantation drives around industrial premises to offset emissions.

2. Sustainable Fibers & Packaging Materials
Integration of sustainable fiber sourcing and eco-friendly packaging materials within their production cycle.

3. Rooftop Solar System
Capacity: Features a 10.8 MW and 16 KW rooftop solar power unit.

Environmental Impact: Avoids 13,296 tonnes of CO2 per annum, equivalent to the planting of 66,480 trees.

4. Coal-Free Steam Generation
Environmental Impact: Avoids 54,444 tonnes of CO2 per annum, equivalent to the planting of 2,57,220 trees.

5. Zero Liquid Discharge (ZLD)
Technology: Equipped with an advanced Effluent Treatment Plant (ETP).

Efficiency: Recovers 98% of water from liquid waste discharged by process units for internal reuse.

6. Rainwater Harvesting
Capacity: Stores up to 10,000 cubic meters of water.

Method: Utilizes both roof and non-roof collection systems to maximize water resources and minimize dependence on groundwater.


Key Facility Certifications: ISO, OEKO-TEX, GOTS (Global Organic Textile Standard), GRS (Global Recycled Standard), BCI, and MADE IN GREEN

Solar 10.8 MW rooftop confirmed against the company sustainability page (source says MW, not MWp). Note the page still carries Lorem Ipsum placeholder text under three headings, so treat it as a weak source.",Not Applicable - ESG Score not disclosed
2,,Sahu Global Pvt Ltd,,No,1,1500,45.6,<3 Years,,"Manufacturing unit, Processing unit",Woven,No / Not Reported,Noida,Uttar Pr.,28.6273,77.3725,2019,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,25% RE,Green Fuels,"H&M, M&S",Flax/Garment,"Noida, UP","Environmental Responsibility - Sahu Global
https://www.sahuglobal.com/sustainability",Not Stated,2026-09-12,Verified,Ankita D,"As an unlisted private entity, Sahu Global Private Limited is not legally mandated by SEBI to file a public Business Responsibility and Sustainability Report (BRSR). However, the company voluntarily outlines its environmental and resource management metrics through corporate responsibility guidelines.

Renewable Energy: Operates on-site solar energy generation, fulfilling 25% of its total electricity demand.   
Water Management: Utilizes a Zero Liquid Discharge (ZLD) effluent treatment plant to recycle 100% of process water.   
Circularity & Materials: Uses organic, recycled, and sustainable cotton inputs across its supply chain.   
Social Responsibility: Participates in community programs and workforce development initiatives, including the HERproject for female workforce empowerment.

Renewable: on-site solar provides 25% of electricity (electricity basis). No total energy figure is published, so no energy-basis share can be derived.",Not Applicable - ESG Score not disclosed
2,,Trend Setters International,,No,1,1500,,<3 Years,"Global Organic Textile Standard (GOTS), Global Recycle Standard (GRS), Organic Content Standard (OCS)","Manufacturing unit, Processing unit",Woven,No / Not Reported,Manesar,Haryana,28.351,76.94,1986,Private Ltd,1000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,Yes,Efficiency,Grid Mixed,"Inditex, Mango",Woven/Knit,Haryana,https://www.trendsettersco.com/,Not Stated,2026-10-03,Verified,Ankita D,"ENTITY SETTLED from H&M's own supplier list, which places the factory at Plot No. 11, Sector 7, IMT Manesar, Gurugram - woven, 1001-2000 workers, owned. The operator is TREND SETTERS INTERNATIONAL, a PARTNERSHIP FIRM (GLEIF legal form A0PS), LEI 335800GCM5CXDQVBNR79, active since 15 February 1996. Registered legal address A-23, Mangolpuri Industrial Area Phase II, Delhi 110034; the Manesar site is Unit 1 of four units across Manesar and Khandsa. No CIN exists because it is not a registered company. This resolves the earlier three-way name ambiguity.

No quantified environmental disclosure exists; no BRSR obligation and no public financials. Absent from the SBTi register.",Not Applicable - ESG Score not disclosed
2,,Banox Exim Pvt Ltd,,No,2,1000,20.4,>10 Years,,"Component unit, Manufacturing unit","Bag&Belt, Footwear",No / Not Reported,Manesar,Haryana,28.351,76.94,2005,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,0.2,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,Yes,Yes,Not Disclosed,Biomass,H&M Group,"Pristine quality leather and suede, alongside vegan leather alternatives, BCI Cotton Fabric, organic cotton, recycled cotton, and recycled polyester",Manesar,"Annual-Report-2024-25.pdf

https://www.banox.in/sustainability/#",FY2024-25,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Energy Efficiency: Installed a 200 KW solar panel system (generating 143,431 kWh and saving 135 tons of CO2 in 2022), replaced 1,100 tube lights with energy-saving 18W LEDs, and swapped 100 constant-running clutch motors for efficient servo motors.

Water & Waste Management: Operates a 15-year rainwater harvesting system, reuses RO water domestically, upcycles leftover leather into small accessories, and recycles stationary via authorized agencies.

Packaging: Utilizes recycled paper fillers, polybags, and cartons.
Groundwater replenishment / aquifer recharge initiative
Leather waste upcycling practices implemented

Solar 200 kW installed at the facility, stated for 2022 (capacity, undated beyond that). The cited Annual-Report-2024-25.pdf exists but is a Companies Act statutory filing with no energy data - it supports none of these figures.",Not Applicable - ESG Score not disclosed
2,,Nandan Terry Limited,,No,2,1000,12.4,3-6 Years,,"Component unit, Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Ahmedabad,Gujarat,23.0225,72.5714,2015,Public Ltd,"1,000",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Committed (near-term + net-zero),No,Not Disclosed,Yes,Yes,70% (Wind/Sol),Not Disclosed,"Walmart, Ross",Terry/Hemp,Ahmedabad,"https://chiripalgroup.com/union-budget2025-26-catalyzing-growth-and-innovation-at-nandan-yerry-limited

",Not Stated,2026-09-12,Verified,Ankita D,"Related Listed Entity — Nandan Denim Limited

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Solar Infrastructure & Manufacturing: Grew Energy features state-of-the-art manufacturing facilities with expertise in producing high-quality PV modules and cells, supporting India's broader renewable energy and solar objectives.

SBTi: near-term and net-zero commitments both active (ID 40029481, published 30/04/2026); no validated targets yet. Source: https://sciencebasedtargets.org/target-dashboard. NOT BRSR-obligated - the company filed a DRHP in Dec 2021 but withdrew the IPO in 2022 and never listed. Certifications: GOTS, OEKO-TEX Made in Green, GRS, Detox, SEDEX, SA8000, BCI, Fairtrade. CAUTION: sibling Chiripal entities Nandan Denim Ltd and Vishal Fabrics Ltd ARE listed and do file BRSR - their data must not be attributed here.",Details noted from Chiripal group as it comes under chiripal group. Not 100% sure if it applies.
2,,Obeetee Private Limited,,No,2,1000,13,3-6 Years,,"Component unit, Manufacturing unit",Home (textile),Yes,Bhadohi,Uttar Pr.,25.3,82.4,1920,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Parsons,Wool Carpets,Mirzapur,"Obeetee SA 8000 Disclosure

https://www.obeetee.in/pages/sustainability",Not Stated,2026-09-12,Verified,Ankita D,"Strong, real, independently-verifiable SOCIAL certifications (GoodWeave/anti-child-labour, SA8000, Fairtrade, ILO recognition). But no ENVIRONMENTAL certifications (GOTS/ISO14001) or quantified emissions/water data found anywhere, including the company's own site, which only uses qualitative sustainability language.
Highlights a 90% reduction in water consumption/withdrawal achieved through water efficiency initiatives.

Husk Ash - Refers to the byproduct management of rice husk ash generated from the facility's biomass boiler energy operations.


Solar Energy: Solar panels at their main factory meet 30% of their energy needs, saving approximately 37,666 trees and reducing CO2 emissions by about 1,807,790 lbs per year.

Biomass Steam Generation: The dye plant uses locally sourced rice husks instead of coal to generate steam, reducing their carbon footprint by roughly 74,000 trees annually.

Recycled PET Yarns: Plastic bottles are recycled into durable, weather-resistant PET yarns—averaging 540,000 bottles used to produce 6,000 kg of yarn every month.

Natural and Eco-Friendly Materials: They utilize natural hand-spun wool, unwoven hand-spun linen, BCI cotton, organic cotton, recycled cotton, hemp, and jute.

Conscious Dyes: Design processes incorporate natural dyes (such as indigo for blue, saffron for yellow, and walnut shells for brown) alongside azo-free dyes.

Water Conservation
Obeetee has reduced its water consumption by 90% through targeted conservation steps:

Efficient Washing: Tufted collections are washed using a low concentration of detergent and significantly less water than the traditional average of 30 buckets per square yard.

Wastewater Treatment: Residual water goes through an onsite effluent treatment and wastewater recycling facility (consisting of channeling, primary physical separation, secondary biological processes, and tertiary final polishing). This clean water is reused to irrigate fields around the factory.

Heat Recovery: Heated water is captured and reused for dyeing yarns.

Renewable: solar panels at the main factory meet 30% of that factory's energy requirement (single-site figure, not company-wide). Company-level renewable share is not disclosed.","Certifications
Obeetee holds several international sustainability and ethical standards, including: Fairtrade, Woolmark, RWS (Responsible Wool Standard), Fernmark, Goodweave, GRS & RCS (Global Recycled Standard & Recycled Claim Standard), SA 8000:2014"
2,,Bhartiya International Ltd.,,No,2,1000,24.8,<3 Years,,"Component unit, Manufacturing unit",Woven,No / Not Reported,New Delhi,Delhi,28.524,77.156,1987,Public Ltd,508,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Sourced RE,Not Disclosed,"Coach, Ralph",Leather/Fashion,Multi-Region,"Bhartiya Annual Report 2025 (Janta).pdf
https://bhartiyafashion.com/download/ANNUAL-REPORT-2024-2025-Consolidated-and-Standalone.pdf

",FY2025,2026-09-12,Verified,Ankita D,"Listed company but small-cap — likely below the ~top-1,000-by-market-cap threshold that makes BRSR mandatory in India, which is why no filing was found despite being publicly traded. This is a useful distinction for the researcher/tech head: 'listed' alone does not guarantee a BRSR exists, only sufficient market cap requirement does. No environmental certifications or quantified emissions/energy/water figures found anywhere public.


No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser

Sourcing/procurement of renewable energy dedicated to their Bangalore unit operations


Industrial water treatment via an Effluent Treatment Plant (ETP) designed for leather processing

Specialized heavy metal recovery systems to capture and reuse chromium from tanning waste

Listed (BSE 526666 / NSE BHAI) but BRSR NOT applicable - the FY2024-25 Directors' Report states it falls below the SEBI threshold. The annual report contains no energy, emissions or water figures. Registry disclosure found: Leather Working Group rating GOLD for subsidiary J & J Leather Enterprises Ltd (Nallambakkam/Vandalur tannery, URN JJL101), with traceability of 11.26% physical, 38.53% documented, 5.78% group, 4.03% regional, 40.4% not traceable. Site/subsidiary-level, not parent-level.",CSR Charter
2,,Rmp Fab Sourcing Pvt Ltd,,No,1,750,,>10 Years,,Component unit,,No / Not Reported,Panipat,Haryana,29.3909,76.9635,2003,Private Ltd,"1,000",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Planned Solar,Biomass,Home Textiles,Woven Fabric,Panipat,https://rmpgroup.com/#Aboutus,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

RMP Fab Sourcing Pvt Ltd does not publicly publish a formal, standalone corporate sustainability report or ESG disclosure document online.

Utilizes Biomass Boiler systems for thermal energy
Renewable solar capacity installation is in the planning phase
Subject to ethical/environmental audit compliance for water management
",Not Applicable - ESG Score not disclosed
2,,Good Leather Company,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Ranipet,Tamil Nadu,12.9271,79.3331,1988,Group Flagship,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,"LWG Protocol, Green Energy",Not Disclosed,Footwear,"Patent Leather, Raw Hide / Leather (processes and manufactures leather goods and finished leather)","Ranipet, Primarily in Tamil Nadu, India",https://www.goodleathergroup.com/sustainability,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Good Leather Company is currently undergoing an expansion of its leather processing unit (semi-finished to finished leather) in the Vellore District of Tamil Nadu, as verified by the MoEFCC Expert Appraisal Committee.

The environmental initiatives implemented by the Good Leather Group include:
Solar Power: Operates a 2 MW captive solar power generation plant in Karur, Tamil Nadu (through an LLP established in 2021) and generates 80 kW of solar power daily directly at their leather factory.
Waste Water Management: Treats wastewater using a Sewage Treatment Plant (STP) system and repurposes the treated water to nurture on-site gardens.
Energy Saving: Adopts energy-efficient technologies including LED lighting, electronic synchronizer motors, and explores transitions from electric to electronic machinery to lower environmental impact and enhance productivity.
Pollution Control & Certifications: Holds Pollution Control Board certifications, operates within a carbon-free enclave nestled among mango farms, and maintains a LWG Gold-rated certification for environmentally responsible practices.
Sustainability Highlights: 
LWG Protocol:The comprehensive framework and auditing standard used to evaluate leather manufacturing facilities. It assesses environmental performance across critical areas including water/energy usage, waste management, chemical safety, traceability, and effluent treatment. The current main standard version is Protocol 7 (P7).LWG Audited:Refers to a facility or supplier that has undergone an official assessment by an accredited LWG auditor. Meeting the baseline standard certifies the facility as audited. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
","LWG Gold
The highest level of certification awarded under the LWG assessment system. Facilities achieving an overall score of 85% or higher (while satisfying key critical section thresholds) receive Gold status. Lower performance tiers include Silver (65%+) and Bronze (55%+)"
2,,Jawandsons Private Limited,,No,1,750,44.9,6-10 Years,"Global Recycle Standard (GRS), Organic Content Standard (OCS), Recycled Claim Standard (RCS)","Component unit, Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Ludhiana,Punjab,30.901,75.8573,2001,Private Ltd,"2,300",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Mission Zero,Not Disclosed,"IKEA, H&M",Home Textiles,Punjab,https://jawandson.com/esg-compass/,Not Stated,2026-09-12,Verified,Ankita D,"No specific sustainability reports found in current sources.No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser


The Jawandsons Group uses a proprietary technological and data-monitoring tool called ESG Compass to manage its sustainability initiatives.

Scope: Covers performance data collection across all group business entities, sites, and plants.

Metric Tracking: Securely tracks and collates data across 30+ ESG KPIs spanning the Environmental, Social, and Governance (ESG) domains.

Key Parameters Tracked:
Electricity and fuel consumption
Waste generation
Greenhouse Gas (GHG) and environmental emissions
Governance parameters and diversity ratios


Strategic Integration: Integrates consumer-driven and innovation-led ESG initiatives into operational paradigms, moving beyond short-term financial returns to create a more inclusive and balanced organization.

Business Benefits: Connects robust ESG compliance to long-term valuation, profitability, enhanced equity, and lower capital costs by mitigating organizational risks

Technology & Process: Leverages SAP to automate data collection alongside individual data entry. It utilizes a maker-checker framework for capturing data with complete traceability and features a dedicated dashboard mapping the group's shift toward decarbonization (Scope 1, 2, and 3 emissions).
Engaged in roadmap planning toward net-zero targets.
Energy usage tracking and accounting automated via SAP systems.
Solar power installation capacity is currently in the planning stage.
Water treatment handled via an internal on-site Effluent Treatment Plant (ETP).
Industrial waste reduction implemented using Kaizen continuous improvement methodologies.

The company website carries ESG pages whose content is copied near-verbatim from Welspun and does not describe this company. Nothing from it has been recorded. No genuine disclosure exists.",Not Applicable - ESG Score not disclosed
2,,Good Leather Shoes Pvt Ltd,,No,1,250,,<3 Years,,Manufacturing unit,"Bag&Belt, Footwear",No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,2019,Private Limited / LLP,1400,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Good Leather Group
https://www.goodleathergroup.com/",Not Stated,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: the Good Leather group of businesses - note ""Good Leather Group"" is a trading and brand name, NOT a legal parent entity; no holding company of that name exists.

Relationship: SEPARATE LEGAL ENTITY and group affiliate, not a subsidiary - Good Leather Shoes Private Limited, CIN U19201TN1994PTC028398, incorporated 24 August 1994, RoC Chennai, registered office No. 18, III Floor, Railway Colony 1st Street, Aminjikarai, Chennai 600029; footwear units at Sriperumbudur and Noombal.

Unit-level disclosure: No environmental disclosure of its own. IMPORTANT: this company is NOT in the Leather Working Group registry. The group's only LWG-certified site is a different entity, ""Good Leather Company"" (URN GOO002, Ranipet tannery, Gold rating), which is row 53 of this pack - that certification must not be inherited here. An SA 8000 certificate does name Good Leather Shoes Private Ltd, but that is a social standard, not environmental.",Not Applicable - ESG Score not disclosed
2,,Indodan Lampshades Pvt. Ltd.,,No,1,250,,6-10 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Noida (NSEZ),Uttar Pr.,28.5355,77.391,1998,Joint Venture,50,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Cosmetic Brands,Scandinavian and natural fabrics,Noida Special Economic Zone,https://indodanlampshades.com/csr,Not Stated,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser. 
Uses NSEZ Grid. 
Water Management through Water Monitoring System
Waste Management : Glue-Free processes implemented in production.

Search record: No sustainability disclosure found; company registration confirmed via company's web page.","IFU Audited
In-Factory Usage / Unit Audit: It certifies that the manufacturing facility and its production processes (such as adhesive use, fabric assembly, wiring, and finishing) adhere to safety, chemical management, and operational standards directly on the shop floor."
2,,Rs Print Fab Pvt Ltd,,No,1,750,,6-10 Years,,Component unit,,No / Not Reported,Noida,Uttar Pr.,28.5355,77.391,2016,Private Ltd,"1,000",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,Yes,No,Biomass,Coal-Free,International,Woven/Knit,"Gr. Noida, Site-C","Sustainability - R. S. Printfab Pvt Ltd
rsprintfab.com",Not Stated,2026-09-12,Verified,Ankita D,"Operates within the Laxmi Fab Dye cluster; reports focus on local environmental compliance.

The company does not publish a standalone, formal annual ESG or Sustainability Report.

Thermal Energy Sourcing: Utilizes Biomass for process heating/boiler operations.Water Management: Operates water-saving and water-reuse systems within its dyeing and printing unit in Noida/Greater Noida.Waste Recycling: Implements polyester/waste fabric recycling and reuse mechanisms.Solar Energy: Incorporating solar power facilities to offset grid electricity consumption.

Water Management & Conservation: Implements water-saving technologies and automated liquid management practices across their dyeing and printing processing lines.

Recycling & Circularity: Actively engaged in recycling and reusing polyester materials, transforming waste fabrics into usable material.

Energy & Emissions: Incorporating solar energy capacity to offset grid electricity and relying on Biomass for thermal energy needs.

Safety & Workplace: Maintains plant safety standards, staff welfare, and women empowerment programs within their integrated unit in Greater Noida.

","R.S. Printfab Private Limited displays the following certifications, standards, and accreditations: Management & Systems ISO CertificationsISO 14001:2015 — Environmental Management SystemISO 9001:2015 — Quality Management SystemISO 45001:2018 — Occupational Health and Safety Management System Sustainability & Compliance AccreditationsHigg Index — Environmental and social impact assessment toolOEKO-TEX Confidence in Textiles — Tested for harmful substancesBCI (Better Cotton Initiative) — Sustainable cotton sourcing frameworkSedex — Ethical supply chain & social audit standardsZDHC  — Zero Discharge of Hazardous Chemicals initiativeINDITEX — Approved supplier compliance framework"
2,,Aarti International Ltd.,,No,1,750,,3-6 Years,,Component unit,,No / Not Reported,Ludhiana,Punjab,30.901,75.8573,1984,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,11.6,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,Yes,Not Disclosed,Not Disclosed,H&M,Not Disclosed,Not Disclosed,https://www.aartiinternational.com/sustainability.php,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

1. Water Management & Recycling
Zero Liquid Discharge (ZLD): Operates a fully functional 2 MLD (Million Liters per Day) ZLD ETP Plant, achieving a 92% to 95% water recovery rate.

Condensate Recovery: Collects MEE (Multiple Effect Evaporator) condensate water and reintroduces it back into production processes.

Low Liquor Ratio Processing: Utilizes dyeing machines engineered with low liquor ratios to minimize unit water consumption.

2. Renewable Energy & GHG Reduction
Total Installed Solar Power: 11.6 MW rooftop solar power across manufacturing sites to generate green power and cut greenhouse gas (GHG) emissions:

10 MW rooftop solar capacity at the Spinning Unit.

1.6 MW rooftop solar capacity at the Knits Processing Unit.

3. Sustainable Chemical Management
ZDHC Engagement: Committed to the Zero Discharge of Hazardous Chemicals (ZDHC) initiative to implement safe and green chemical practices.

Automated Chemical Dispensing: Features auto-dispensing systems for dyes and chemicals to eliminate manual waste and overconsumption.

4. Raw Materials & Global Certifications
Eco-Friendly Sourcing: Produces textiles using certified sustainable raw materials.

Global Certifications Held:
GOTS (Global Organic Textile Standard)
OCS (Organic Content Standard)
GRS (Global Recycled Standard)
OEKO-TEX Standard 100

Solar 11.6 MWp is the sum of two separately stated rooftop installations - 10 MW at the AIL Spinning Unit and 1.6 MW at the AIL Knits Processing Unit. No combined total is published. CAUTION: the SBTi register contains ""Aarti Steel International Limited"" (Committed), a different group company - this textile entity is not on the register and must not inherit that status.","Certifications
OEKO -TEX Standard 100

Quality Management System -QMS (ISO 9001:2015 Certified Company)"
2,,Arthanari Loom Centre,,No,1,750,,3-6 Years,,Component unit,,No / Not Reported,Salem,Tamil Nadu,11.6377,78.1693,1991,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,Yes,Yes,60% Solar,Not Disclosed,Benetton,Flax/Linen,"Salem, TN",https://alctex.com/,FY2023-24,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser. Uses CARE Ratings as a proxy for operational transparency; verifies 60% solar and 99.5% ZLD water recycling.
Solar Energy: 18.27 MW captive rooftop solar capacity (meeting ~60% of operational power needs).
Water Recycling: Zero Liquid Discharge (ZLD) Effluent Treatment Plant achieving a 99.5% water recycling rate.
Flax & Raw Material Capability: Certified under Masters of FLAX FIBRE™, alongside Organic Cotton (GOTS) and BCI sourcing.

5 Million Calories (MCal) of thermal energy saved through heat recovery systems (such as steam condensate recovery or waste heat recovery units in their dyeing/finishing plants).

Salt Recovery Systems integrated within their Zero Liquid Discharge (ZLD) effluent treatment process. In textile dyeing operations, sodium chloride/sulfate salts are extracted and recovered from wastewater so they can be reused in processing rather than discharged as hazardous waste.

","Flax Master
Arthanari Loom Centre holds the official ""Masters of FLAX FIBRE™"" certification from the Alliance for European Flax-Linen and Hemp (Certificate No. BVFR30409891)."
2,,Daks India Industries Pvt Ltd,,No,1,750,30.7,3-6 Years,,Manufacturing unit,"Bag&Belt, Footwear, Jersey",No / Not Reported,Delhi,Delhi,28.6139,77.209,2016,Private Ltd,3500,Not Disclosed,Not Disclosed,431.07,Not Disclosed,3.47722,0.1,9426.24,100.673,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Luxury Brands,Woven/Knit,Okhla & Gr. Noida,https://daksindia.com/wp-content/uploads/2026/06/DAKS-SUSTAINIBILITY-REPORT-FINAL.pdf,FY2025-26,2026-09-12,Verified,Ankita D,"Though public profile highlights an aggressive 100% renewable energy target by 2025, but no confirmation disclosure found from company.
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser

Renewable Energy & Clean Operations100% Renewable Target: Aggressively transitioning facilities to run on 100% renewable energy.On-Site Solar PV: Installed solar panel arrays on factory rooftops (e.g., unit B1 operates as a primary solar-powered plant).Clean Fuel Conversion: Replaced conventional diesel steam boilers and machinery with Piped Natural Gas (PNG) systems, yielding up to 60% electricity savings and reduced emissions.Logistics: Utilizes CNG-powered transport vehicles for internal logistics to reduce Scope 1 transport emissions. Water Stewardship & Waste RecyclingEffluent Treatment Plant (ETP): In-house ETP systems process and treat factory wastewater for recycling in production or groundwater recharge.Rainwater Harvesting: Facilities feature integrated rainwater harvesting systems to recharge local water tables.Waste Management: Implements strict solid waste segregation (glass, metal, plastic, paper) and lamp-crushing units for safe disposal and recycling

Sustainability Performance Report FY2025-26, GRI Standards 2021 (Core). IMPORTANT BOUNDARY: the report covers ONE SITE only - B-1, EPIP Site-V, Kasna, Greater Noida, on an operational-control basis - and explicitly excludes the other DAKS units (D-37, B-02, F-33/5 Okhla). These figures are site-level, not company-wide. Also disclosed: solar generation 38.96 MWh, water recycled 373.56 KL, rainwater harvested 162 KL, waste recovery 73.55%, local procurement 35%. Certifications ISO 9001/14001/45001, SA 8000, FSC, FEM, GSV; supply chain EcoVadis-assessed. Targets (not actuals): carbon neutrality by 2040, 100% renewable at B-1 by 2027, 90% waste recovery by 2028.","ESG / Sustainability Tier: Indicates that the facility holds an external Silver Rating / Medal for Corporate Social Responsibility (CSR) & ESG performance.

EcoVadis / Standard Reference: Represents an EcoVadis Silver Medal or equivalent third-party ESG benchmark"
2,,K.P.R Mill Limited-Processing Mill,,No,1,750,,6-10 Years,,Component unit,,No / Not Reported,Coimbatore,Tamil Nadu,11.0168,76.9558,1989,Public Limited / Listed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,Yes,100%,Not Disclosed,"Primark, Walmart, H&M, Marks & Spencer, ASDA, K-Mart","Cotton (major), Organic Cotton, Viscose",India (mainly South & West India),"23rd AGM Notice and Annual Report for the Financial Year 2025–26 of K.P.R. Mill Limited.

https://nsearchives.nseindia.com/corporate/KPRMILL_27062026114004_23RDAGMNOTICEANNUALREPORT.pdf",FY2025-26,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: K.P.R. Mill Limited (NSE: KPRMILL / BSE 532889).

Relationship: Division of the listed parent - fabric processing unit at SIPCOT Industrial Estate, Perundurai, Erode district (dyeing, bleaching and finishing). Same legal entity.

Unit-level disclosure: No disclosure at unit level. The parent's FY2024-25 figures (61.92 MW wind, about 37 MW rooftop solar, ZLD, and a 100% renewable claim for FY26) are entity and group level for K.P.R. Mill Limited and must not be carried onto this row. Separately, do not confuse this with KPM Processing Mill (P) Ltd of Tirupur, an unrelated company that also appears in this pack.",Not Applicable - ESG Score not disclosed
2,,Centex Fabrics Export Unit,,No,1,750,,<3 Years,"Global Organic Textile Standard (GOTS), Organic Content Standard (OCS)","Manufacturing unit, Processing unit",Accessories,No / Not Reported,Ludhiana,Punjab,30.901,75.8573,1969,Private Ltd,338,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,Yes,Not Disclosed,Not Disclosed,H&M,Not Disclosed,Not Disclosed,"Centex CARE Rating
https://www.careratings.com/upload/CompanyFiles/PR/CENTEX%20INTERNATIONAL%20PRIVATE%20LIMITED-03-18-2016.pdf",FY2022-23,2026-09-12,Verified,Ankita D,"CARE Ratings rationales provide audited financial and operational transparency for this private entity.

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser

",Not Applicable - ESG Score not disclosed
2,,Designco Export Private Limited,,No,1,750,,<3 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Moradabad,Uttar Pr.,28.8386,78.7733,1979,Private Ltd,"6,302",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Committed,No,Not Disclosed,Yes,No,Not Disclosed,Not Disclosed,Home Retail,Handicrafts,Not Disclosed,https://designco-india.com/production-process.php,Not Stated,2026-09-12,Verified,Ankita D,"Formally listed in the global SBTi registry as committed to obtaining Net-Zero certification.

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser

Designco focuses its sustainability initiatives and community engagement around several key programs, as outlined in their corporate structure:

Saamarthya: A focused initiative directed toward empowering individuals and communities through skill-building, capability enhancement, and developmental support.

Karma-Chetna: A program aimed at fostering social consciousness, ethical responsibility, and community welfare awareness.

Access to Education: Initiatives dedicated to improving educational opportunities and learning infrastructure for underprivileged groups.

Access to Clean Water: Projects focused on ensuring safe, clean, and reliable drinking water sources for local communities.

Access to Energy: Efforts aimed at promoting sustainable energy solutions and better power accessibility.

Our Sustainability Guiding Force: The core leadership and philosophical framework driving Designco's overarching environmental and social commitments throughout its supply chain.

No entity-level disclosure. AFFILIATE NOTE: a separate legal entity, DESIGNCO PRIVATE LIMITED (CIN U74994UP2018PTC101951), sharing the Lakri Fazalpur Moradabad address and the Lohia promoters, HAS validated SBTi near-term and net-zero targets (ID 40008573, published 13/11/2025; 60% absolute Scope 1+2 by 2034 and 90% by 2050 from a 2024 base). That is a DIFFERENT CIN from this supplier row (U36942UP2021PTC148410) and must not be recorded as this entity's. The Lohia group also owns a wind-energy business - likewise not attributable here.","FIEO Award
IEO: Federation of Indian Export Organisations (set up by the Ministry of Commerce, Government of India).Award Citation: Refers to the Niryat Shree / FIEO Export Excellence Award awarded to the company for outstanding export performance, quality compliance, and international trade practices."
2,grasim-industries,Grasim Industries,,grasim-industries,1,750,,<3 Years,,Component unit,,No / Not Reported,Mumbai,Maharashtra,19.0178,72.8478,1947,Public Listed,55257,86219949,3095951,89315900,6.5,423991.73,Not Disclosed,63570000,3978444,210.6548163,87,Not Committed,No,Not Disclosed,Yes,No,16% renewable energy in total energy mix by FY30,No formal coal phase-out date,"Paints (retail+B2B), Cellulosic Fibres (viscose/VSF), Chemicals (caustic soda, chlorine), Cement (via UltraTech)","Wood pulp (FSC/SFI/PEFC certified), Cotton (Textiles), Caustic soda inputs, Limestone (Cement)","India (multi-state: MP, Gujarat, Karnataka, Rajasthan, etc.) + International (Sri Lanka, UAE, Bangladesh)","Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2023-24,2026-07-01,Live,Already live,Already researched and shipped on the current dashboard — use as the reference example for depth/format.,
1,kpr-mill,K.P.R. Mill Limited,,kpr-mill,2,7500,98.3,6-10 Years,,"Manufacturing unit, Processing unit","Jersey, Underwear/Swimwear",No / Not Reported,Coimbatore,Tamil Nadu,11.0168,76.9558,2003,Public Listed,20774,59834,161703,221537,24.1,1741.85,34,1842246,1828.4,127.1848896,73,Not Committed,No,Not Disclosed,Yes,Yes,33% of power from solar,Not Disclosed,"Primark, Walmart, H&M, Marks & Spencer, ASDA, K-Mart","Cotton (major), Organic Cotton, Viscose",India (mainly South & West India),"Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2025-26,2026-07-01,Live,Already live,Already researched and shipped on the current dashboard — use as the reference example for depth/format.,
2,,Alpine Apparels Pvt. Ltd.,,No,2,500,19.1,3-6 Years,,Manufacturing unit,"Bag&Belt, Footwear",No / Not Reported,Faridabad,Haryana,28.4089,77.3178,1986,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,Yes,No,Rooftop Solar,PNG Commission,Ralph Lauren,Leather,"India, the Far East, and Italy",https://alpineapparels.com/who-we-are/,Not Stated,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. 

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

At  Alpine Apparels, sustainability and ESG (Environmental, Social, and Governance) principles are integrated into manufacturing operations, supply chain management, and corporate culture.

Key focus areas include:

Responsible Manufacturing & Compliance:The company enforces rigorous ethical manufacturing standards, ensuring adherence to local labor laws, safety regulations, and global ESG policies across internal divisions and external supplier networks.
Industry Audits & Frameworks: Operations incorporate standard compliance tools and environmental assessments—such as the Higg Index Facility Environmental Module (FEM) and the Social & Labor Convergence Program (SLCP)—to systematically track and minimize environmental footprints.
Data-Driven ESG Tracking:  Alpine monitors key sustainability Key Performance Indicators (KPIs), maintaining detailed records on employee welfare, workplace diversity, health and safety, and governance practices.
Sustainable Material Innovation: Across divisions (such as leather goods, lifestyle accessories, and specialized home products like leather wall tiles), the company utilizes treated hides, traditional craftsmanship paired with modern non-toxic/eco-friendly chemical treatments, and durable designs aimed at longevity.
Corporate Social Responsibility (CSR) & Training: Continuous internal training programs are conducted to build workforce awareness regarding workplace ethics, safety protocols, and sustainability objectives, alongside active community engagement.

Company discloses only: PNG plant to cut fossil-fuel reliance by up to 25% (target), solar reducing carbon footprint by 143 tonnes/year, and 4,819 KL of RO water recycled in 2022. No emissions, energy total, renewable share or water withdrawal figure is published.",ISO 9001:2015 certified
2,,Vinty Impex Pvt Ltd.,,No,2,500,33.2,3-6 Years,,"Manufacturing unit, Processing unit",Accessories,No / Not Reported,New Delhi,Delhi,28.523,77.1557,2005,Private Ltd,128,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,H&M,"Organic resin, wood, lead-free alloy","New Delhi, Delhi",https://tracxn.com/d/legal-entities/india/vinty-impex-private-limited/___YnxhMAM7prQWkbnQjNtYAjYCExStT2IQnwt3F0R1Xo,FY2024-25,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser. No sustainability disclosure found; company registration confirmed via Tracxn.

Search record: BRSR report, Sustainability Disclosure, Annual Report, CDP disclosure searched via google, no sustainability disclosure found; company registration confirmed via Tracxn, Indiamart.",Not Applicable - ESG Score not disclosed
2,,Ac Brothers,,No,2,500,,<3 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Moradabad,Uttar Pr.,28.8386,78.7733,1993,Private Ltd,50,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Fashion Jewelry,Non-ferrous and ferrous castings,"Moradabad, Uttar Pradesh","CRISIL Rating Rationale
https://www.crisilratings.com/mnt/winshare/Ratings/RatingList/RatingDocs/A.C.%20Brothers-RU-30-07-2026.pdf",FY2022-23,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser. 

",CRISIL BBB-
2,,Champo Carpets,,No,2,500,13.5,<3 Years,,"Component unit, Manufacturing unit, Processing unit",Home (textile),No / Not Reported,Bhadohi,Uttar Pr.,25.3908,82.5706,1970,Family-owned,"12,500",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Natural Gas,Clean natural gas switch,H&M,"Recycled PET, BCI cotton, RWS wool","Bhadohi, Uttar Pradesh","Champo Official Profile
https://champoofficial.com/",Not Stated,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Sustainable Raw Materials: Explicitly sources certified eco-friendly fibers, including Better Cotton Initiative (BCI) cotton, Responsible Wool Standard (RWS) certified wool, and 100% recycled polyester (PET) spun from post-consumer plastic bottles.   

Eco-Packaging Initiatives: Replaced single-use plastics across key packaging workflows with reusable cloth bags.   

Social Impact & DEI:
Implements strong Diversity, Equity, and Inclusion (DEI) standards—notably, 20% of their textile department and 100% of yarn-opening operations are managed by female workers.   

Partners with Project Baala to supply free, sustainable menstrual hygiene solutions to female employees.   

Engages in local environmental uplifting, planting roughly 5,000 tree saplings annually in partnership with the Ministry of Forest and Environment.

Certification logos on the company site (FSC C009732, OEKO-TEX 100, GOTS, OCS, BCI, ISO 9001, OHSAS 18001) are displayed as images only and are not verified against the issuing registries. Recorded as claims, not disclosures.","GoodWeave
GoodWeave is an internationally recognized certification system and non-profit organization (founded by Nobel laureate Kailash Satyarthi) dedicated to eliminating child, forced, and bonded labor from global supply chains—most notably in industries like handmade rugs, home textiles, and fashion accessories."
2,,Neokraft Global Pvt. Ltd.,,No,1,750,27.8,6-10 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Noida,Uttar Pr.,28.5355,77.391,2007,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,Yes,No,Not Disclosed,Not Disclosed,IKEA,Metal/LED,Noida SEZ,"csr_policy_neokraft.pdf

https://www.neokraft.in/sustainability.html",Not Stated,2026-09-12,Verified,Ankita D,"Noida-based; ISO 14001 certified with verified reporting on rooftop solar (0.35 MWp).

Certifying bodies (such as DQS) list ISO 14001 certification under the operational compliance scope for Neokraft Global Pvt. Ltd. (covering the manufacture of home lighting and home furnishings), demonstrating an institutional commitment to structured environmental management alongside internal initiatives like tree-planting drives, energy conservation, and workplace safety.
Google search indicates ISO14001 certification, but no disclosure on the company website to confirm

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser

Highlights operational initiatives focused on circular waste management, material reuse, and zero-waste process integration.","Even though they operate out of the Noida Special Economic Zone (NSEZ) and supply retail giants like IKEA and H&M Home, their exact scoring details remain confidential. Global brands use private third-party platforms to score their vendors, meaning Neokraft’s data is kept within secure business-to-business networks. H&M Supplier Sustainability Index: H&M evaluates its home and textile supply chain using the Higg Index or internal sustainability commitment metrics. These audits generate internal point-based scores that dictate vendor tiering (e.g., strategic vs. transactional supplier). rivate ESG Rating Networks: It is highly probable that Neokraft maintains a private scorecard on EcoVadis or Sedex (SMETA audits). These platforms allow private manufacturers to securely share their audited ESG data, labor practices, and safety scores directly with verified corporate buyers."
2,,Radium Creation Private Limited,,No,1,250,62,>10 Years,,"Manufacturing unit, Processing unit",Accessories,No / Not Reported,Navi Mumbai,Maharashtra,19.033,73.0297,1991,Private Ltd,"2,000",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Cleaner Fuel,Replaced with cleaner fuels,"Target, H&M",Raw metals (precious and base),Navi Mumbai and Gujarat,https://tracxn.com/d/legal-entities/india/radium-creation-private-limited/__mB2Va3E2xtGNfqhzDdlNb4C9XQ2UsVUuZPxSBwGtR5o,FY2024-25,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Tracxn. The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present.
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Radium Creation emphasizes several social and corporate responsibility initiatives as part of its organizational values:Women Empowerment: Actively enhances gender balance by promoting diversity, creating leadership opportunities for women internally, and supporting women economically across the supply chain.Employee Welfare: Prioritizes workforce well-being through continuous skill development, target-driven progression, corporate responsibility, and health and safety standards.Ethical Compliance: Focuses on adhering strictly to legal mandates, fair labor practices, and ethical training guidelines.

Indicates that energy consumption data is formally tracked through accounting-based carbon and utility tracking protocols rather than a direct green-energy percentage mix.
Specifies that water utilization and industrial wastewater management are tied directly to electroplating processes, requiring specialized chemical rinsing and treatment streams.

Search record: BRSR report, Sustainability Disclosure, Annual Report, CDP disclosure searched via google, no sustainability disclosure found; company registration confirmed via Tracxn.","Star Exp House
in Indian foreign trade and manufacturing, a Star Export House designation is an official status granted by the Directorate General of Foreign Trade (DGFT) to Indian businesses that have achieved specific export performance thresholds over preceding financial years."
2,,Rastogi Enterprises,,No,1,250,,>10 Years,,Processing unit,,No / Not Reported,Noida,Uttar Pr.,28.5355,77.391,2014,Sole Prop.,10,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,No,No,Not Disclosed,Not Disclosed,54 Countries,"DTF inks, hot melt powders",Noida and New Delhi,https://www.justdial.com/Noida/Rastogi-Enterprises/011PXX11-XX11-190814004553-Q2G8_BZDET,Not Stated,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Tracxn. The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present.No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Search record: No sustainability disclosure found; company registration confirmed via Justdial.

At least three same-family names exist - Rastogi Enterprises (Moradabad), Rastogi Export Products (Moradabad, est. 1970) and Rastogi Handicrafts (Jaipur, est. 1995). Do not merge.",Not Applicable - ESG Score not disclosed
1,,Paramount Products Pvt Ltd,,No,3,2250,37,6-10 Years,,"Manufacturing unit, Processing unit",Woven,No / Not Reported,Noida,Uttar Pradesh,28.5355,77.391,1973,Private,5000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,40% by 2025; signed a 25-year PPA to increase the RE share to approximately 60%; long-term goal of 90% by 2030.,On track to eliminate coal use across all plants by 2029. Has already installed a 20 TPH biomass-fired boiler to reduce dependence.,"H&M, Zara",Ready-made Garments,"Noida, Uttar Pradesh",https://paramountproducts.in/infrastructure.php,Not Stated,2026-09-11,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Employee count conflicts across sources (5,000+ vs 7,000) depending on how recent the source is — used the more recent OGTC figure but flagged for QA to confirm against a primary source. BSCI/ETI/ICS/SEDEX are social/labour-audit certifications, not environmental ones — do not treat as GOTS/ISO14001 equivalents. No Scope 1/2, energy, or water figures found; company is privately/family-held, not BRSR-mandated.


1. Environmental Initiatives
Clean Energy Integration: The company incorporates renewable energy solutions, including the installation of solar power rooftop panels across its production facilities to curb its reliance on conventional power.

Water Management: Facilities utilize rainwater harvesting mechanisms to support groundwater recharging and resource conservation.

Resource Optimization: Group-wide environmental management systems focus on tracking, minimizing, and efficiently regulating the carbon and ecological footprints of manufacturing units.

2. Certifications and Audits
Sustainable Standards: Operations align with key global standards and textile certifications—such as the Global Organic Textile Standard (GOTS), Global Recycled Standard (GRS), and the Better Cotton Initiative (BCI).

Performance Assessment Tools: The organization applies evaluation tools like the Higg Index and Social & Labor Convergence Program (SLCP) frameworks to systematically measure environmental impact and factory conditions.

Rigorous Auditing: Manufacturing units undergo periodic compliance evaluations conducted by independent third parties and major international buyers.

3. Social and Worker Welfare
Paramount Products carries out targeted programs centered on workforce well-being, community engagement, and skill development:

Healthcare & Empowerment Initiatives: Programs like the HER Project (focusing on worker health awareness) and the We Women Project are implemented to support female workforce empowerment and medical well-being.

Training & Productivity: Initiatives like the RAGS Project prioritize skill building and productivity growth, while programs like the SWAR Project drive awareness regarding energy conservation and sustainable habits among personnel.

Health and Safety: Strict adherence to health, safety, and labor regulations ensures a secure working environment across all production units.

Search record: No sustainability disclosure found; company registration confirmed via company's web page.

Paramount states rooftop solar saves ""10-15% of electricity purchased from State Electricity Boards"" - that is avoided grid purchase, not renewable share of energy, so it is not entered in the Renewable Energy % column. The reported 25-year renewable PPA could not be confirmed in any acceptable source; searches conflate this company with Paramount Textile Ltd (Bangladesh), a different company.","Higg/SLCP
It indicates the facility uses standardized, third-party verified assessments covering both environmental (Higg FEM) and social/labor (SLCP) pillars. H&M accepts these combined disclosures from Tier 1 and Tier 2 suppliers to track full ESG performance without requiring redundant internal"
2,,Axa Leather Group,,No,1,250,,6-10 Years,,Component unit,,No / Not Reported,Vaniyambadi,Tamil Nadu,12.6842,78.6186,2014,Leather Mfg,100,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,No,Not Disclosed,Yes,No,Not Disclosed,Not Disclosed,Primark Inc,"Raw bovine, sheep, and goat hide","Vaniyambadi, Tamil Nadu",https://www.axaleathergroup.com/,Not Stated,2026-09-12,Verified,Ankita D,"The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Environmental & Sustainability Practices at AXA Leather Group
AXA Leather Group maintains a strong commitment to balancing manufacturing operations with environmental responsibility. Their key sustainability initiatives and credentials include:

Environmental Policy: The company actively sets, monitors, and reviews specific targets and objectives focused on minimizing environmental impact and promoting sustainable industrial practices.

LWG Certification: Their tannery is audited and certified to Leather Working Group (LWG) standards, holding an LWG Gold Rated certification for responsible environmental manufacturing.

Recognized Standards & Compliance: They maintain international compliance across environmental, energy, safety, and social accountability frameworks:

ISO 14001:2015 (Environmental Management)

ISO 50001:2011 (Energy Management)

OHSAS 18001:2007 (Occupational Health and Safety)

SA 8000 (Social Accountability)

SEDEX (Empowering Responsible Supply Chains)

Search record: No sustainability disclosure found; company registration confirmed via company website and Leather Working Group

Leather Working Group certified, rating SILVER (URN AQS001), continuously certified since 22 Aug 2014, audit expiry 04 May 2028. Traceability: physical 0%, documented 0%, group 0%, regional 28.68%, not traceable 71.32%.",LWG Silver
2,,Radnik Auto Exports,,No,2,500,35.9,>10 Years,,"Manufacturing unit, Processing unit","Accessories, Bag&Belt, Footwear",No / Not Reported,Noida,Uttar Pradesh,28.5355,77.391,2017,Proprietorship,"2,200",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No Target,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"OGTC Members, H&M, Tommy Hilfiger, Target, Benetton","Woven Garments, Cotton, Viscose, Polyester","Noida, Uttar Pradesh","CITI Annual-Report 2024-2025; OGTC - Gateway to Apparel Manufacturing

https://radnikauto.com/sustainability",FY2025-26,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: the Radnik Exports group - note this is NOT a subsidiary of Radnik Exports Global Private Limited (CIN U46411DL2023PTC421714); the two are sibling businesses.

Relationship: SEPARATE PARTNERSHIP FIRM and group affiliate, not a division - no CIN exists for firms. LEI 3358004DMEMRKHDSBT13; addresses at NSEZ Phase-2 / Sector 85 and Ecotech-II, Greater Noida, Gautam Budh Nagar.

Unit-level disclosure: No disclosure of its own. The only renewable figures anywhere in the group are 366 kW of on-site rooftop solar and a claimed 55% renewable mix for 2024, published for ""Radnik Exports"" at group level. The 1.5% renewable and 4 MWp solar previously recorded here have no source at entity or group level - 4 MWp is roughly eleven times the only published solar figure - and have been removed rather than reconciled.",Not Applicable - ESG Score not disclosed
1,,Radnik Exports Global Pvt Limited,,No,5,7000,29.4,>10 Years,,"Manufacturing unit, Processing unit","Accessories, Home (textile), Jersey, Woven",No / Not Reported,New Delhi,Delhi,28.5491,77.2514,1973,Private,15000,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"OGTC Members, H&M, Tommy Hilfiger, Target, Benetton","Woven Garments, Cotton, Viscose, Polyester","Noida, Uttar Pradesh","https://radnikexports.com/sustainability
https://sciencebasedtargets.org/target-dashboard",FY2025-26,2026-09-11,Verified,Ankita D,"Private company — no BRSR/CDP disclosure. Holds European Flax certification (dyeing/embroidering/end-product manufacturing), not GOTS/ISO14001. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

SBTi: Two commitments dated 29/07/2021, both removed for expiry, never replaced by validated targets. Source: https://sciencebasedtargets.org/target-dashboard

The website markets SBTi alignment, ""Net Zero by 2040"" and ""Net Zero by 2050"" on the same page, while the SBTi register shows the commitment was removed for expiry in 2021. Verified actual: 366 kW rooftop solar installed. The ""55% renewable electricity"" figure sits inside a forward roadmap, not a disclosure.","CITI Winner
""CITI Winner"" refers to a recipient of the national CITI Textile Sustainability Awards & CITI-Birla Awards. Awarding Body: Organized annually by the Confederation of Indian Textile Industry (CITI) in partnership with the Ministry of Textiles.Scope of Recognition: Acknowledges Indian textile and apparel manufacturers for excellence in:Excellence in Carbon Emissions Reduction / Low Carbon FootprintBest Alternate Materials UseWater Management & ConservationRenewable Energy Integration & HR PracticesRadnik Exports Global Pvt Ltd (Row 7): Recognized as a CITI Winner for Excellence in Carbon Emissions Reduction / Achieving ESG Compliance through Innovations."
1,shahi-exports,Shahi Exports,SHAHI EXPORT PVT.LTD; SHAHI EXPORTS PRIVATE LIMITED,shahi-exports,22,43000,84.1,>10 Years,,"Component unit, Manufacturing unit, Processing unit","Denim, Jersey, Knitted, Woven",No / Not Reported,Faridabad,Haryana,28.4089,77.3178,1974,Private,104340,382577,57186,439763,65,4334.23,84,4828552,52614,101.4627742,67,Not a member,No,B,Yes,Yes,100% RE by FY27,100% coal-free in garmenting,"Walmart, Gap Inc., Target, H&M, Nike, Uniqlo, PVH, Abercrombie & Fitch, C&A, Calvin Klein, Columbia Sportswear, Inditex, Kohl's","Cotton Fabric, Polyester Fabric, Viscose, Denim, Trims","India, China, Bangladesh , Vietnam, Turkey","Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2023-24,2026-07-01,Live,Already live,"Already researched and shipped on the current dashboard — use as the reference example for depth/format.
",
2,,"Shahi Exports Pvt  Ltd, Shimoga",,No,1,750,,>10 Years,,Component unit,,No / Not Reported,Faridabad,Haryana,28.4089,77.3178,1974,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Committed,Not Disclosed,B,Yes,Yes,50% renewable electricity target by FY 2026–27 (base year FY 2018–19),100% coal phase-out achieved in garmenting units,"Global apparel brands and retailers across the USA, Europe, Asia, and","Cotton (organic, BCI, regenerative, and conventional)",Karnataka and Tamil Nadu,https://shahi.co.in/wp-content/uploads/2025/04/Shahi-Exports-Sustainability-Report-FY-2023-24-1.pdf,FY2023-24,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Shahi Exports Private Limited.

Relationship: Division of the parent - the Knits Processing Division (KPD), Door No. 156, KIADB Industrial Area, Nidige/Machenahalli, Shivamogga, Karnataka, established 2012. Same legal entity.

Unit-level disclosure: A unit-level disclosure DOES exist, as company claims rather than audited figures: the Shivamogga KPD unit is stated to run on 96% renewable ELECTRICITY, to have Zero Liquid Discharge, and to have reached YESS Foundational Level Conformance in 2024. These are undated website claims about electricity rather than total energy, so nothing is entered in the columns. Group figures (92.5 MW renewable capacity, 32 MW and 52 MW Karnataka solar plants, 100% renewable electricity by 2026) stay off this row.",Not Applicable - ESG Score not disclosed
2,,Kpm Processing Mill (P) Ltd,,No,1,250,,6-10 Years,,Component unit,,No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,2010,Private Ltd,230,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,Yes,Eff. Boilers,High-efficiency thermal boilers induced,H&M,Knitted fabrics (GOTS/OCS),"Tirupur, Tamil Nadu",https://www.kpmprocessingmill.com/#sustainability,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Minimal public ESG reporting; functions as an industrial processing unit.
Google search denotes CDP engagement but no disclosure via company website. Hence unable to confirm.
Sustainability Infrastructure & Initiatives
Zero Liquid Discharge (ZLD) Facility: Operates an effluent treatment capacity of 24 lakh liters/day utilizing a multi-stage Reverse Osmosis (RO), Multiple Effect Evaporator (MEE), and Agitated Thin Film Dryer (ATFD) system for maximum water recovery.

Low-Impact Production: Minimizes freshwater consumption through efficient process integration and water reuse, resulting in significantly lower water, salt, and chemical usage.

Environmental Compliance: Fully compliant with Tamil Nadu Pollution Control Board (TNPCB) regulations, backed by robust, continuous monitoring and control systems.
Eco-Certifications & Benchmarks
GOTS (Global Organic Textile Standard)
OEKO-TEX
Global Recycled Standard (GRS)
Higg Index
ISO 14001 (Environmental Management Systems Certification)

NOT related to K.P.R. Mill Limited despite the similar name - separate CIN (U17120TZ2010PTC016539), separate promoters, a job-work dyeing unit in Tirupur. The 7,800 TPA figure circulating in credit-rating coverage is installed dyeing capacity, not consumption, and a credit rating is not an ESG disclosure.",CRISIL BBB-
2,,Seet Kamal Private Limited,,No,1,250,64.1,6-10 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Jaipur,Rajasthan,26.9124,75.7873,1992,Private Ltd,"1,400",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Intl Apparel,"Katran, Musa, Circuleather","Jaipur, Rajasthan",https://www.seetkamal.com/sustainability.html,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Eco-Innovations & Sustainability:
Katran Paper: Upcycled, wood-free paper made from shredded cotton fabric waste.  Instead of using virgin wood pulp, Seet Kamal creates wood-free paper by processing shredded pre-consumer cotton fabric waste into rag pulp (Katran Paper line).The in-house pulp recycling process operates alongside a zero liquid discharge / wastewater recycling system that reclaims and reuses water in the papermaking process.
Musa & Circuleather: Eco-innovations including bio-leather made from banana fiber/sheep wool (Musa) and recycled leather waste (Circuleather).   

Optimized Paper Honeycomb & Pulp Processing: Uses energy-efficient hydraulic presses and low-energy mechanical repulping systems for paper waste processing.

Heat/Drying Recovery: Employs optimized air-drying and ambient moisture curing techniques for handmade paper decor products to minimize active energy load during manufacturing.

Certifications & Recognition: Uses FSC-certified paper, ISO 9001 quality standards, and holds the FORHEX Green Award for ecological practices. 
The current sources lack audited ESG metrics. These firms are largely associated with private regional clusters whose detailed reports are not present in the provided snippets. ","FORHEX Green Award
Organization Background: FORHEX refers to the Federation of Rajasthan Handicraft Exporters, a major trade body representing export manufacturers across Rajasthan.Award Purpose: The FORHEX Green Award is an industry recognition awarded to regional handicraft and export businesses that adopt responsible, eco-friendly manufacturing practices, sustainable material usage, and waste reduction methods."
2,,Shahi Exports Pvt. Ltd ( Unit Sarla),,No,1,750,,3-6 Years,,Component unit,,No / Not Reported,Faridabad,Haryana,28.4089,77.3178,1974,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Committed,Not Disclosed,B,No,Yes,50% renewable electricity target by FY 2026–27 (base year FY 2018–19),"Phased out entirely in one mill, with active transition progressing","Global apparel brands and retailers across the USA, Europe, Asia, and","Cotton (organic, BCI, regenerative, and conventional)",Karnataka and Tamil Nadu,https://shahi.co.in/wp-content/uploads/2025/04/Shahi-Exports-Sustainability-Report-FY-2023-24-1.pdf,FY2023-24,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Shahi Exports Private Limited.

Relationship: Division of the parent, located at 30/2 Loni Road, Mohan Nagar, GHAZIABAD, Uttar Pradesh - not Karnataka. It is the former Sarla Fabrics, Shahi's first mill (1996), doing weaving, printing, dyeing and finishing. The predecessor company Sarla Fabric Private Limited (CIN U18101DL1993PTC052263) now shows MCA status ""Amalgamated"", so the site trades as a unit of Shahi Exports.

Unit-level disclosure: No environmental disclosure of its own.",Not Applicable - ESG Score not disclosed
2,,Viswas Textile Processors / Azure,,No,1,250,,6-10 Years,,Component unit,,No / Not Reported,Bangalore,Karnataka,12.9716,77.5946,2004,Private Ltd,750,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,https://www.viswastextile.com/copy-of-infrastructure,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
The provided sources lack specific audited metrics or corporate profiles. These private firms are largely associated with regional clusters whose detailed reports have not yet been imported into the current dataset.

Spelled both Viswas and Vishwas; ""Azure"" is a trading name of the same firm, not a separate company. Located Bangalore (Mysore Road), not Erode - Erode ZLD cluster material does not apply.",Not Applicable - ESG Score not disclosed
2,,Shakthi Knitting Private Limited,,No,3,1750,75.4,6-10 Years,,"Manufacturing unit, Processing unit",Jersey,No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,1991,Unlisted Private,800,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,Not Disclosed,No,No,Integration of RE to support its organic cotton manufacturing cluster.,Not Disclosed,"Kesko (mywear), H&M, Walmart, HBI (Hanesbrands), J.C. Penney, and other global apparel brands.","Performance ThermalsCotton (Comprising conventional and certified organic cotton fibers, yarn, and textiles processed for knitwear and thermals).",TirupurTirupur and Perundurai,"Kesko Report

https://www.shakthiknitting.com/Social/Social.htm",FY2023-24,2026-09-12,Verified,Ankita D,"Uses BCI and organic cotton per a recent academic profile, but no GOTS/ISO14001 confirmed specifically for Shakthi Knitting Private Limited itself, and no Scope 1/2, energy, or water figures found. 
Environmental Infrastructure : Features an in-house Zero Liquid Discharge (ZLD) Site for wastewater treatment alongside ongoing Solar Capacity Pilot Expansion.

Shakthi Knitting remains a benchmark for ethical sourcing in the Tirupur cluster. It is the verified manufacturer for Kesko’s (mywear) organic T-shirts, with a supply chain that is fully traceable from Indian cotton farms to European retail shelves

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.


Colorsburg is one of India's most sophisticated facilities, specializing in the manufacture of high quality, weft-knitted, core and performance fabrics. Equipped with the latest technology to handle, growing needs of an ever changing fashion world.
Colorsburg is a major supplier to apparel manufacturers throughout Asia and apparel retailers. Amongst its customers are Marks & Spencer, Hennes & Mauritz, and JC Penny etc…
Infrastructure at the facility enables capacity to dye and finish up to one million meters a month.
As part of the company wide initiatives to adopt more environment friendly initiatives the company was awarded the prestigious Oeko-Tex Standard 100 Certification, an internationally recognized test for harmful substances present in textile manufacture, which is now the benchmark for quality and safety amongst the textile industry in Europe.
The utmost importance is attached to in particular all waste, emission and by products in the manufacture of weft knitted fabrics to promote environmental sustainability. Colorsburg aims to minimize the environmental impact of operations by compliance with all environmental legislation. This is augmented by reducing waste generation, contamination of water, air and land and raising awareness of this policy among all employees.
","WRAP Grade A
WRAP (Worldwide Responsible Accredited Production) certification.

Grade / Level: Grade A (Gold Certificate of Compliance).

Meaning: Awarded to facilities that demonstrate full compliance with all 12 WRAP principles for ethical manufacturing, human resources, labor rights, environmental standards, and customs compliance over consecutive audit cycles."
2,,Amit Exports,,No,1,250,,3-6 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,2013,Private Ltd,50,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,"Targets set (near-term, 1.5C)",Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Regional,Cotton Readymade,Tirupur,https://www.amitexports.com/,Not Stated,2026-09-12,Verified,Ankita D,"The provided sources lack specific audited metrics or corporate profiles. These private firms are largely associated with regional clusters whose detailed reports have not yet been imported into the current dataset. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Search record: No sustainability disclosure found; company registration confirmed via Company Website.

SBTi near-term target VALIDATED: 42% absolute reduction in Scope 1+2 by 2030 from a 2024 base year, plus a commitment to measure and reduce Scope 3. 1.5C aligned, validated via the SME streamlined route, published 02/04/2026 (SBTi ID 40025634). This is a TARGET - no actual emissions figure is disclosed. IDENTITY CAVEAT: the register carries the name ""AMIT EXPORTS"" with no CIN or city, and the name is common in Indian trade. Confirm against the address on H&M's supplier list before treating this as hard-linked.",Not Applicable - ESG Score not disclosed
2,,Creative Functional Art,,No,1,250,5.6,3-6 Years,,Manufacturing unit,Home (hardgoods),No / Not Reported,Moradabad,Uttar Pradesh,28.8386,78.7733,2009,CEO-Led,500,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Intl. Retail,Stainless Tableware,Moradabad,https://www.cfart.org/product-category/christmas/,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Sustainability Highlights:
Zero Waste - No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Hand Crafted : Rather than using fully automated mass-production lines, products (such as barware, serveware, candle holders, and decorative accent pieces) are individually shaped, hammered, assembled, and finished using traditional Indian handicraft techniques.","Ethical Craft
It refers to Ethical Craft / Artisanal Compliance Certification.Details:The supplier specializes in handcrafted metal products (barware, tableware, wall decor) produced by traditional Indian artisans in Moradabad, UP.""Ethical Craft"" indicates that the manufacturing process adheres to fair labor practices, safe working conditions, fair wages for craft artisans, and sustainable artisan-led production rather than exploited labor or unmonitored sub-contracting.This reference highlights social and human rights compliance for regional private handicraft clusters that lack formal corporate public BRSR/ESG filings."
2,,Shakthi Knitting Private Limited (Ms Coloursburg),,No,1,250,,6-10 Years,,Component unit,,No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,1991,Private Ltd,200,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,Not Disclosed,No,No,Integration of RE to support its organic cotton manufacturing cluster.,Not Disclosed,"Kesko (mywear), H&M, Walmart, HBI (Hanesbrands), J.C. Penney, and other global apparel brands.","Performance ThermalsCotton (Comprising conventional and certified organic cotton fibers, yarn, and textiles processed for knitwear and thermals).",TirupurTirupur and Perundurai,"Kesko Report

https://www.shakthiknitting.com/Social/Social.htm",FY2023-24,2026-10-03,Verified,Ankita D,"Not counted separately - figures roll up to the parent. Parent: Shakthi Knitting Private Limited (CIN U17301TN1991PTC020736).

Relationship: DIVISION of the same legal entity, not a subsidiary - Colorsburg is the wet-processing (knitting, dyeing, finishing) plant at 4/677 Shakthi Centre, Nochipalayam Road, Veerapandi, Tirupur 641605, on the same campus as the parent. No separate CIN exists; the company presents one vertically integrated entity with knitting, dyeing and garmenting divisions. This row is therefore a site-level row of the same company as row 83.

Unit-level disclosure: No disclosure of its own.",Not Applicable - ESG Score not disclosed
2,,Jain Cord Industries Pvt Ltd,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Gurugram,Haryana,28.4595,77.0266,1960,Vert. Integ.,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,40%,Not Disclosed,Global Retail,Corduroy/Premium,Gurgaon/Kosi,https://www.jaincord.com/sustainability/,Not Stated,2026-09-12,Verified,Ankita D,"Jain Cord Industries is a major participant in the PM MITRA Textile Park scheme, with a proposed investment of ₹2,515 crore in the Dhar (Madhya Pradesh) hub, signaling a significant expansion of its manufacturing capacity within an integrated textile ecosystem

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Renewable Energy % noted : 35-45% (average value taken)

Water Management & Conservation
Recycled Wastewater for Industry: Through the Aman Foundation (established in April 2018), textile processing industries on Behrampur Road in Gurugram coordinate with GMDA to use tertiary-treated recycled water from Sewage Treatment Plants (STPs) for industrial processes. This saves 6–7 million liters of fresh water daily.

Rainwater Harvesting: Rainwater harvesting systems are installed across all company facilities to recharge 100% of collected water into the ground and increase the water table. Additional reservoirs are planned for their new 187,000 sq. ft. facility at Kosi.

2. Energy and Emissions
Solar Energy Harvesting: A rooftop solar power unit with 1 MW capacity has been installed, estimated to cover 35% to 45% of the company's total electricity requirement (with an estimated investment of $1.25 million).

Biomass Energy & Emission Reductions: The company utilizes 100% biomass energy and green power, driving a reported reduction in overall facility carbon emissions (CO2e emissions reduced by up to 82%).

3. Community and Green Initiatives
Tree Plantation Project: In collaboration with the Aman Foundation, tree plantation drives are conducted on government-appointed green belts. These trees are cared for over three years until they become self-sustainable and are irrigated primarily using recycled water from STPs.

Student Workshops: Conducting educational workshops to involve school students across Gurgaon in tree plantation drives and foster environmental responsibility.

Material Sourcing & Transparency: Active promotion of certified organic and recycled cotton alternatives (such as participation in initiatives like the Trust US Cotton Protocol) to support sustainable supply chain traceability.

All environmental content on the company site is forward-looking: a planned 1 MW rooftop solar unit expected to cover 35-45% of electricity. Nothing is disclosed as achieved. The ""100% biomass energy"" and ""82% CO2e reduction"" claims circulating in search summaries do not appear on any company page.",Sedex Aud.
2,,M/S Link Up Textiles Private Limited,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,1995,Private Ltd,"2,700",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,UK Retail,Export Surplus Apparel,Chennai/Salem,"https://linkuptextiles.com/sustainability/
Sustainability | Linkup Textiles Private Limited",Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Linkup Textiles integrates sustainability into its manufacturing processes, raw material selection, and supply chain management. According to their Sustainability page, the company follows these key steps:

Cotton: Uses 100% BCI (Better Cotton Initiative) Cotton across all products, with organic cotton used based on specific requirements.

Viscose Fabrics: Sourced to be eco-friendly and meet sustainable standards.

Polyester Fabrics: Utilizes recycled polyester depending on the nature of the fabric.

Labels and Accessories: Care labels are crafted using recycled PET bottles and recycled polyester fibers upon request.

Packaging and Materials: Polybags and threads are made using recycled materials where required, and all cartons feature FSC certification.",SEDEX
2,,Saroj Leathers (India) Pvt. Ltd.,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Ranipet,Tamil Nadu,12.9271,79.3331,2004,Private Ltd,20,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Intl. Market,Leather Consultancy,Ranipet,https://tracxn.com/d/legal-entities/india/saroj-leathers-india-private-limited/__gMASGUVK7_ewKfxYV07VE3XsjEiYbOfMk9pAx0lmrds#about,Not Stated,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Traxcn. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Search record: No sustainability disclosure found; company registration confirmed via Company website.

Leather Working Group registry entry exists (URN SAR101) but its status is EXPIRED - no current rating and no traceability percentages published. This is ""registry entry, certification lapsed"", not ""certified"" and not ""no disclosure"". A separate member, Saroj Tanners (URN SAR102, certified since 2014), is a different site - do not attribute its status here.","LWG Exp.
It tracks the expiration status or date of a supplier’s Leather Working Group (LWG) environmental audit certification."
2,,Srg Apparels Pvt Ltd,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Avanashi,Tamil Nadu,11.1914,77.2689,1989,Private Ltd,"3,000",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Commitment removed (expired),Not Disclosed,Not Disclosed,No,No,100% (2026),Not Disclosed,Kids Brands,Knitted Garments/Yarn,Tirupur,https://www.srgapparels.com/sustainabilit,Not Stated,2026-09-12,Verified,Ankita D,"Srg Apparels Pvt Ltd has set an aggressive sustainability roadmap, including targets for 100% renewable energy by 2026, Zero Waste to Landfill by 2030, and Net-Zero status by 2045. The company is currently digitizing its emissions data using GreenStitch to move away from manual reporting.

Google search indicates  GOTS certification, but no disclosure on the company website to confirm

No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Planet-Centric Initiatives
Water Conservation:

Utilizes Zero Liquid Discharge (ZLD) systems achieving a 95% water recovery rate.

Reduced water use per kilogram of dyed garments from 63 liters down to 45 liters.

Target: A 10% freshwater reduction by 2030 (and a 50% reduction by 2035).

Energy Management:

Operates on 70% renewable energy (38% solar and 32% wind) alongside 30% grid power.

Features 11.30 MW of captive green power capacity.

Chemical Management:

Achieved 97.8% compliance with ZDHC MRSL standards for safe chemical use.

Scored 75% on the Higg Index for chemical management practices.

Waste Management:

Meticulously tracks all cutting waste to ensure circularity.

Responsibly disposes of hazardous waste and recycles non-hazardous waste.

Goal: Zero landfill waste by 203

Company claims an electricity mix of 70% renewable (38% solar, 32% wind) and 30% grid, with 11.30 MW of combined captive green capacity. Self-declared, unassured, no reporting period. SBTi: both commitments removed - the ""net zero by 2045"" line is the company's own aspiration.",ISO 9002
2,,Star Exports,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,1999,Partnership Firm,200,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Brands in Europe and Asia,Raw hide to finished leather,Chennai and Ranipet,https://www.leatherworkinggroup.com/get-involved/our-community/certified-suppliers/star-exports-b-tannery-sta103/,Not Stated,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via LWG website.
Lack audited ESG metrics in current sources. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Leather Working Group certified, rating GOLD at the A-Tannery site (URN FOR004, Kanchipuram), audit expiry 30 Jul 2026, protocol 7.2.4. Traceability: regional 50.11%, not traceable 49.89%, physical 0%, documented 0%, group 0%. CAUTION: Star Exports has THREE separate LWG sites - A-Tannery (FOR004), B-Tannery (STA103, Chromepet) and C-Tannery (STA109, Ranipet). These figures are A-Tannery only and must not be carried to the other two.",Not Applicable - ESG Score not disclosed
2,,Travancore Cocotuft Private Ltd,,No,1,250,12.5,3-6 Years,,"Component unit, Manufacturing unit",Home (textile),No / Not Reported,Cherthala,Kerala,9.6845,76.3316,2000,100% Export Oriented Unit,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"Target, Home Depot, Ross, Sodimac","Coir, jute, rubber","Cherthala, Kerala","https://www.cocotuft.com/
CARE Ratings, ICRA",Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Energy & Sustainability: Incorporates sustainable manufacturing practices, with nearly 50% of its energy requirements generated from renewable sources.
Water-Based Azo-Free Dyes:Refers to the non-toxic, eco-friendly water-based synthetic dyes used to print designs on their natural coir, jute, and floor covering products. Azo-free dyes eliminate harmful heavy metals and chemical compounds to comply with global environmental and consumer safety regulations.Biodegradable Discharges / Materials:Refers to both the 100% natural, biodegradable raw materials (e.g., natural coco fiber and latex) and the organic, biodegradable liquid waste discharged directly to local Common Effluent Treatment Plants (CETP)

Only quantified disclosure is a live homepage solar dashboard: 746 MWh cumulative renewable energy produced, 284,854 kg CO2 saved (undated, no denominator). Certifications: ISO 9001, OEKO-TEX, REACH, SA8000, Sedex SMETA.","SA 8000, SEDEX
SA8000 Certification:
An international social accountability standard developed by Social Accountability International (SAI). It certifies fair treatment of workers, evaluating key workplace areas such as prohibition of child/forced labor, health and safety practices, freedom of association, working hours, and fair compensation.

SEDEX (Supplier Ethical Data Exchange) / SMETA:
A globally recognized online platform where suppliers share ethical audit data regarding working conditions, health and safety, environmental practices, and business ethics. A SEDEX/SMETA audit verifies standard social and labor compliance across global supply chains."
2,,Vas Noorullah,,No,1,250,,3-6 Years,,Component unit,,No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,1950,Third-generation Manufacturer,400,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"Brands in USA, Europe, and Asia","Bovine, sheep, and goat hides","Vaniyambadi, Tirupattur","https://www.vasnoorullah.com/
LWG, TÜV SÜD",FY2023-24,2026-09-12,Verified,Ankita D,"Lack audited ESG metrics in current sources.No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Leather Working Group certified, rating SILVER (URN VAS002), audit expiry 11 Aug 2028, protocol 7.2.5. Traceability: documented 53.81%, regional 40.23%, not traceable 5.96%, physical 0%, group 0%. A second site (VAS101, B Tannery) is registered separately - these figures are VAS002 only.","LWG Silver Rated
Holds an LWG Silver Rated status under the Leather Working Group protocol, certifying strong environmental and chemical compliance in its tannery operations.
Social Compliance: Maintains SA8000 Certification, confirming compliance with international social accountability and workplace labor standards."
2,jindal-worldwide,Jindal Worldwide,,jindal-worldwide,1,250,,<3 Years,,Component unit,,No / Not Reported,Ahmedabad,Gujarat,23.0225,72.5714,1986,Private,1412,147113,1077,148190,0.71,181.46,Not Disclosed,99137,207.81,816.65,33,Not Committed,No,Not Disclosed,No,Yes,Not Disclosed,No formal phase-out date,Not Disclosed (B2B - end-use industries; no specific brand names disclosed),"Cotton, Yarn (BCI, Organic, GRS-certified on request)","India (16 states, GST registered in 1 state) + exports to 24 countries","Existing Hestiya dashboard (data.js) — originally sourced from BRSR/sustainability report, see platform data.csv for detail",FY2023-24,2026-07-01,Live,Already live,Already researched and shipped on the current dashboard — use as the reference example for depth/format.,
2,,Carlrima Impex Pvt Ltd,,No,1,250,,<3 Years,,Manufacturing unit,"Bag&Belt, Footwear",No / Not Reported,Kanpur,Uttar Pradesh,26.4499,80.3319,2020,Private Ltd,59,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Leather Goods,"Leather dressing, luggage components","Kanpur, Uttar Pradesh",https://tracxn.com/d/legal-entities/india/carlrima-impex-private-limited/__Vk0pcH1Y_jYk7LiavkZ2niF38tVGnRqmWAMOa0N9YII,FY2024-25,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser. No sustainability disclosure found; company registration confirmed via Tracxn.",Not Applicable - ESG Score not disclosed
2,,Fabtech International Hosieries  Pvt Ltd,,No,1,250,,<3 Years,,Component unit,,No / Not Reported,Tirupur,Tamil Nadu,11.1085,77.3411,2005,Private Ltd,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Recycled Yarn,Pre & Post-consumer textile waste,"Tirupur, Tamil Nadu",https://www.fabtechgroups.com/our-sustainablity/,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Power Generation & Renewable Energy
100% Green Power: The company generates 100% of its power requirements through its own captive renewable energy plants.

Wind Power: 80% of their total power needs are met using their own windmills (located in regions like Tirupur and Theni), producing substantial surplus clean energy.

Solar Power: Solar capacity not yet disclosed but the company claims that, 20% of their power requirement is generated through their in-house solar power plant.

2. Water Conservation & Treatment
Effluent Treatment Plant (ETP): They operate an in-house ETP plant that recycles 100% of their industrial wastewater.

Water Savings: the Company claims savings of 15,552,000+ KL (kiloliters) of water. This is the amount of water savings but not the amount of water used or recycled.

3. Waste Management & Circular Economy
Pre-Consumer Textile Waste: They convert cutting and pre-consumer textile waste into blended recycled yarn (producing roughly 8 tons daily).

PET Waste Reduction: Achieved savings and management of 2,880+ MT (metric tons) of PET waste.

Chemical Savings: Recorded savings of 64,800+ Kgs of chemicals through sustainable processing.

4. Overall Environmental Impact Metrics
Production Capacity: 7,200+ MT of sustainable production.

Carbon Footprint Savings: 7,200+ MT of carbon footprint reduction.

Company claims 100% of its POWER requirement from own windmills and solar (about 80% wind, 20% solar). Unassured, no period, no capacity, no MWh. ENTITY UNVERIFIED: the cited site is ""Fabtech Groups Pvt Ltd"", Veerapandi, Tirupur; the name ""Fabtech International Hosieries Pvt Ltd"" appears nowhere on it.",Wind Offset
2,,Yes Fashions Pvt. Ltd.,,No,1,250,,6-10 Years,,Component unit,,No / Not Reported,Surat,Gujarat,21.1702,72.8311,1989,Private Ltd,116,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,100% (2026),100% Bio-Fuel,"Guess, Walmart",Synthetic Wovens,Surat,https://yesfashions.com/sustainability/,Not Stated,2026-09-12,Verified,Ankita D,"The provided sources lack specific audited metrics or corporate profiles. These private firms are largely associated with regional clusters. 
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Google search indicates GOTS certification, but no disclosure on the company website to confirm

Establishes a 100% renewable energy procurement or generation target for the supplier facility to eliminate grid-associated carbon intensity.
Denotes a Zero Liquid Discharge facility configuration, meaning 100% of industrial wastewater is treated and recycled back into operations, preventing liquid waste discharge.

Indicates active collaboration under global brand sustainability initiatives (such as H&M Group's strategic supplier programs) focusing on circularity and waste reduction.

Key Sustainability Highlights
Pioneer in Recycled Polyester: Recognized as the largest manufacturer of recycled polyester wovens in India.

Strategic Partnerships: Collaborates strategically with Polygenta Technologies & Reliance Industries.

Water Management: Operates a Zero Liquid Discharge Water Jet Weaving Facility, with processed water being discharged at a government-approved Common Effluent Treatment Plant (CETP).

De-carbonization & Energy: Actively working on de-carbonization in boiler fuel, targeting a 100% switch from coal-fired boilers to bio-fuel by the end of 2026.

Certifications: Certified with OEKO-TEX Standard-100.

Core Sustainability Pillars & Focus Areas
Environmental Sustainability

Corporate Social Responsibility (CSR)

Skilling and Training

Employee Health and Wellbeing

Fair and Respectful Workplace",Higg Index
2,,Gtm Industries,,No,1,250,,<3 Years,,Component unit,,No / Not Reported,Gurugram,Haryana,28.4595,77.0266,2016,Private Ltd,39,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Fabric Dyeing,Cotton and Silk fabrics,"Mathura, Uttar Pradesh",https://www.indiamart.com/gt-m-industries/profile.html?srsltid=AfmBOooxnFUaoOSNv5LdNRv7O3eZFoSIC05HxHUGGF-nd9gHCF-TGhwE,FY2024-25,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Indiamart
Identified as a private industrial player; however, the provided sources lack specific audited ESG metrics or a corporate profile to verify its operational footprint. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.",Not Applicable - ESG Score not disclosed
2,,Hemla Embroidery Mills Pvt. Ltd.,,No,1,250,,<3 Years,,"Component unit, Processing unit",,No / Not Reported,Faridabad,Haryana,28.4089,77.3178,1958,Private Ltd,300,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Schiffli buyer,"Schiffli embroidery, crochet lace","Faridabad, Haryana",http://hemlaembroidery.com/,FY2023-24,2026-09-12,Verified,Ankita D,"No specific sustainability reports or regulatory filings are available to extract Scope 1/2 emissions or resource consumption data. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

1. Regulatory & Ethical Compliance
Global Audits and Standards: Leading production houses adhere to rigorous international compliance benchmarks to ensure fair labor practices, safe working conditions, and supply chain transparency. Common frameworks include platforms like Sedex and standard guidelines set by major global fashion brands (such as Inditex).

2. Sustainable Sourcing & Material Traceability
Certified Eco-Friendly Fibers: Production units increasingly utilize certified raw materials to minimize ecological footprints. This includes adhering to standards like the Global Recycled Standard (GRS) for recycled inputs and the Organic Content Standard (OCS) for responsibly grown natural fibers.

3. Resource Efficiency and Lean Manufacturing
Optimized Production: Modern computerized machinery (such as Swiss Lässer systems) maximizes thread efficiency and minimizes material waste during large-scale pattern runs.

In-House Processing Integration: Combining embroidery with localized dyeing and printing units helps streamline chemical management, water conservation, and energy recovery systems across the entire lifecycle of the fabric.

Ecocert certified-client registry entry covering recycled materials, recycled textiles, and organic and ecological textiles. Certification scope only - no quantified environmental figure. Operations are in Faridabad, Haryana (CIN U74999HR1958PTC002248).",Not Applicable - ESG Score not disclosed
2,,Kdh Textile Pvt Ltd,,No,1,250,,<3 Years,,"Component unit, Processing unit",,No / Not Reported,Sonipat,Haryana,28.9931,77.0151,2009,Private Ltd,110,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,"Zara, H&M",Design-based machine embroidery,"Sonipat, Haryana","https://www.kdhtextile.com/
CARE Ratings (July 2026)",FY2025-26,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.",CARE BB+; Stable (Reaffirmed)
2,,Maxima Solutions,,No,1,250,,<3 Years,,Manufacturing unit,Beauty,No / Not Reported,Rudrapur,Uttarakhand,28.9904,79.39,2007,Contract Mfg,500,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Cosmetic labels,Skincare & Personal Care ingredients,"Rudrapur, Uttarakhand","https://maximasolutions.co.in/
BeBee / Maxima Group",Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.
Maxima Solutions applies Total Productive Maintenance (TPM) to optimize its cosmetic and personal care manufacturing operations",Lean Mfg
2,,Nivin Leathers,,No,1,250,,<3 Years,,Component unit,,No / Not Reported,Chennai,Tamil Nadu,13.0827,80.2707,2017,Manufacturer,10,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Leather apparel,Buffalo and Sheepskin leather,"Chennai, Tamil Nadu","LWG Audit (URN: NIV101)
https://www.leatherworkinggroup.com/get-involved/our-community/certified-suppliers/nivin-leathers/",FY2024-25,2026-09-12,Verified,Ankita D,"Likely associated with a regional leather cluster; no verified water stewardship (KL) or waste management (MT) figures are present in the current dataset.  No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Nivin Leathers is a certified Gold-rated leather manufacturer and tannery located in Chennai, India

Leather Working Group certified, rating GOLD (URN NIV101), certified since 23 Jan 2025, audit expiry 23 Jan 2027, protocol 7.2.4. Traceability: regional 98.33%, not traceable 1.67%, physical 0%, documented 0%, group 0%.",Not Applicable - ESG Score not disclosed
2,,Rodiro Fabrica De Calcado Lda,,No,1,250,69.8,<3 Years,,Manufacturing unit,"Bag&Belt, Footwear",No / Not Reported,Penacova,Portugal,40.2677,8.2825,1994,Integrated,499,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Luxury brands,Luxury leather footwear,"Penacova, Portugal",https://www.rodiro.com/responsibility,Not Stated,2026-10-03,Verified,Ankita D,"ROW BELONGS IN THE PACK - resolved. H&M lists RODIRO FABRICA DE CALCADO LDA (Portugal) as the supplier of record on a CONTRACTUAL basis, against the Indian factory POTISSIMUS ARROW SHOES PVT LTD at Plot S-34, Phase III, SIPCOT Industrial Estate, Nellikuppam, Ranipet (formerly Vellore) district, Tamil Nadu - footwear, bags and belts, 1-500 workers. So this is a foreign supplier contracting an Indian manufacturer, not a misfiled foreign row.

Indian manufacturer: POTISSIMUS ARROW SHOES PRIVATE LIMITED, CIN U19129TN2010PTC113556, incorporated 1 January 2010, RoC Chennai, active; LEI 335800ERZOWEEQLQMW08. It is a separate legal entity, so no Rodiro group figure may be attributed to the Indian site.

No disclosure at either end. Potissimus is NOT Leather Working Group certified - the LWG directory returns no result for ""Potissimus"" or ""Arrow"". CAUTION: a similarly named but different Ranipet-area company, P.A. Footwear Pvt Ltd (URN PAF101), IS LWG-listed - do not confuse them. Both Rodiro and Potissimus are absent from the SBTi register.",RRP Member
2,,Precot Limited,,No,1,250,,<3 Years,Forest Stewardship Council Chain of Custody (FSC COC),Manufacturing unit,Beauty,No / Not Reported,Coimbatore,Tamil Nadu,11.0168,76.9558,1962,Public Ltd,"1,608",Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Yes,No,Green Power,Not Disclosed,Yarn Exports,Raw and Organic Cotton,"Kerala, Tamil Nadu, Karnataka",https://precot.com/sustainability/,FY2024-25,2026-09-12,Verified,Ankita D,"As a listed entity (NSE/BSE), Precot is likely subject to mandatory BRSR filings in India. But not accessable freely. Hence the data is noted from company's sustaiability portal.

Precot Sustainability Practices Overview
Precot's sustainability framework is built upon three core pillars: Raw Material Sourcing, Green Energy, and Waste Management.

Detailed Scope 1, 2, and 3 Emissions: Specific quantitative metrics for greenhouse gas emissions (such as precise metric tons of carbon dioxide equivalent) are not explicitly itemized or published in the standard Directors' Report or financial summaries of Precot Limited's Annual Report.

1. Raw Material Sourcing
Organic Cotton Commitment: 20% of the cotton utilized by Precot is organically grown.

Environmental Impact: Grown using fewer chemicals and optimized water usage, reducing ecological strain.

Soil & Ecosystem Health: Organic practices enhance soil quality, protect farming ecosystems, and support local farming communities.

2. Green Energy Utilization
Wind Power: Generates up to 12.25 MW of energy through 17 wind mills to power manufacturing and dyeing units.

Natural Gas: Utilizes roughly 7.5 MW of energy produced from natural gas.

Energy Conservation & Heat Recovery:

Dyeing plants are equipped with heat recovery systems that capture hot water from dye baths and recirculate it into boilers and dyeing machines to minimize heating energy requirements.

Integration of energy-efficient motors in ring frames, high-efficiency compressors, and humidification plants to cut down overall energy consumption.

3. Waste Management & Zero Discharge System
Effluent Treatment Plants (ETPs): Installed across all production units equipped with advanced evaporators and crystallizers for thorough wastewater treatment.

Advanced Treatment Processes: Employs ozone and reverse osmosis technologies as part of a comprehensive zero-discharge system.

Water Recycling: Treated wastewater is fully redirected toward landscape irrigation.


Green Energy and Carbon Footprint MitigationWhile aggregate emission metrics are limited, Precot actively offsets its carbon footprint through significant investments in renewable energy infrastructure:Wind Power: The company utilizes up to 12.25 MW of clean energy generated from its 17 windmills to power manufacturing and operational units.Cleaner Fossil Fuels: Utilizes approximately 7.5 MW of energy produced via natural gas.Energy Conservation Systems: Employs heat recovery systems in dyeing plants (re-circulating hot water to lower boiler/dyeing energy requirements), energy-efficient motors in ring frames, and optimized humidification plants.

Listed on NSE and BSE but NOT BRSR-obligated - the FY2024-25 Annual Report states plainly that the Business Responsibility Report ""is not applicable to the Company"", as it falls outside the SEBI top-1000 threshold. There is therefore no BRSR and no Scope 1/2, energy, water or waste table to draw on. Audited FY2024-25 filing discloses 5.50 MW of windmill capacity installed for captive consumption. The company website separately claims 12.25 MW across 17 windmills and about 7.5 MW from natural gas, but that page was last modified in 2022, is inconsistent with the audited filing, and phrases capacity as ""energy produced"". Installed capacity is not consumption - nothing is entered in the columns.","Precot Limited holds the following key quality and environmental ISO certifications:   

ISO 9001: Quality Management System certification.   

ISO 14001: Environmental Management System certification.   

Additional Compliance and Quality Standards
In addition to ISO, Precot maintains several other industry-standard credentials:

SA 8000 (Social Accountability)   

BRC Standards (Global standard for food safety and packaging materials)

OEKO-TEX (Certified safe for textiles tested for harmful substances)

GMP & FDA Certifications   

BCI (Better Cotton Initiative) standards compliance"
2,,Regi India Cosmetics Pvt. Ltd,,No,1,250,,<3 Years,,Manufacturing unit,Beauty,No / Not Reported,Haridwar,Uttarakhand,29.9457,78.1642,2009,Subsidiary,100,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Net Zero,Clean Energy,Skincare,Clean beauty textures & ingredients,"Haridwar, Uttarakhand",https://tracxn.com/d/legal-entities/india/regi-india-cosmetics-private-limited/__0bzQ6gUVwNDF58vh3oTa9lsF52uoWLJLwrU33XS6zRc#about,FY2024-25,2026-09-12,Verified,Ankita D,"No sustainability disclosure found; company registration confirmed via Tracxn.
No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Corporate Sustainability & Environmental CareClean Energy: Utilization of clean energy generated via high-efficiency photovoltaic systems.Resource & Emission Monitoring: Continuous tracking of CO2 emissions, water consumption, and electricity usage with yearly performance improvement targets.Circular Economy & Packaging: Implementation and active promotion of recycled and recyclable plastics in production.Facility Protection: Integration of innovative protection systems against environmental hazards like flooding at manufacturing sites.2. Social ComplianceStandards & Audits: Fully EcoVadis rated and audited in compliance with SMETA (Sedex Members Ethical Trade Audit) and broader Corporate Social Responsibility (CSR) requirements.Workplace Focus: Prioritizes social equality, fair labor practices, and workplace safety.3. Clean Beauty & R&DSustainable Ingredients: Increasing investments into the research and development of cosmetic textures formulated with socially and environmentally sustainable components.

The sustainability narrative found in search results belongs to the international Regi group and sits on an awards-entry profile, not the Indian entity. Advertorial-grade and group-level; deliberately not recorded.",Photovoltaic
2,,Stella Indusstries Limited,,No,1,250,,<3 Years,,Manufacturing unit,Beauty,No / Not Reported,Gurugram,Haryana,28.4595,77.0266,1983,Limited Co.,108,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Grooming,Grooming & toiletries (Fragrances),"Gurugram, Haryana",https://stella-indusstries.com/corporate-governance,Not Stated,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Environmental Protection & Sustainability Initiatives
Footprint Reduction: Implemented internal sustainability policies and initiatives aimed at minimizing the company's overall environmental impact.

Eco-Friendly Practices: Focuses on resource efficiency through waste reduction, efficient use of energy, and the adoption of green manufacturing and packaging practices.

Employee Awareness: Conducts regular training and awareness programs for employees centered on environmental conservation and sustainable operational habits.

Advanced Technology: Utilizes modern automated machinery and specialized production lines (such as Pamasol aerosol setups) to reduce environmental exposure and human intervention during manufacturing.

Individual facilities have begun adoption of solar solutions (such as a 100KW rooftop solar project commissioned via Vikram Solar at select plants

The double-s spelling ""Indusstries"" is the company's own registered name, not a typo. Unlisted public limited company (inc. 13 Dec 1983, Gurgaon); not on BSE or NSE and not BRSR-obligated. A grooming and toiletries manufacturer, consistent with an H&M Beauty supplier row.",Not Applicable - ESG Score not disclosed
2,,Tulip Apparels Pvt Ltd,,No,1,250,,<3 Years,,"Component unit, Processing unit",,No / Not Reported,New Delhi,Delhi,28.6139,77.209,1997,Private Ltd,500,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,Not Disclosed,Not Disclosed,Embroidery,"Embroidery machinery, designer laces","Delhi, Gurgaon, Sonipat",https://tulipapparels.com/,FY2024-25,2026-09-12,Verified,Ankita D,"A private limited apparel manufacturer for which no public BRSR or audited environmental data has been imported into the current project. No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Do not conflate with Tulip Clothing Pvt Ltd / Tulip Fashion of Tirupur - a different entity.",Not Applicable - ESG Score not disclosed
2,,Wfb Baird & Company (India) Pvt Ltd,,No,1,250,,<3 Years,,Component unit,,Yes,Kochi,Kerala,9.9312,76.2673,1912,Private Ltd,371,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,Not Disclosed,No,No,100% (2035),Not Disclosed,"M&S, Gap",European Flax (CELC certified),"Kochi, Kerala (Processing)",https://wfbbaird.com/awards-and-certifications.html,FY2024-25,2026-09-12,Verified,Ankita D,"No BRSR filing found (private company, not required to file); no sustainability report on company site; not a CDP discloser.

Based on corporate and operational policies of WFB Baird & Company (the parent group governing its manufacturing practices and operations in India), the company’s key sustainability initiatives and focus areas include:

1. Sustainable Products & Materials
Eco-Friendly Fibres: Specializes in manufacturing linen and linen-blend fabrics, which are naturally derived from eco-friendly flax fibres.   

Certifications: Operations and products are aligned with recognized standards, holding certifications from leading industry agencies such as OEKO-TEX and the Higgs Index.   

Chemical Compliance: Utilizes certified, biodegradable chemicals and sustainable materials across processing and packaging stages.   

2. Resource Optimization & Water Management
Water Conservation: Implements processes focused on minimizing freshwater footprints, including rainwater harvesting, as well as the reusing and recycling of wastewater.   

Energy Efficiency: Deploys heat recovery systems within manufacturing units to effectively conserve thermal energy during production cycles.   

3. Waste Reduction & Green Energy Goals
Waste Minimization: Focuses heavily on reducing waste generation at production units, alongside implementing responsible waste disposal and internal recycling frameworks.   

Renewable Energy Transition: Actively incorporates solar energy and other green power sources, with a strategic corporate roadmap aiming to transition toward 100% renewable energy usage.

Search record: No sustainability disclosure found; company registration confirmed via Tracxn & Company website

Higg FEM environmental scores published for the Indian units specifically: 89% (Cochin) and 90% (SIPCOT). Higg FSLM (social) 72.2% at Cochin. NO REPORTING YEAR IS STATED and the page is undated - treat the vintage as unknown. Registry certifications: GOTS v6.0, OCS 3.0, GRS 4.0, RCS 2.0 and OEKO-TEX STANDARD 100 at both units, OEKO-TEX STeP and amfori BSCI at Cochin, European Flax via Bureau Veritas at both. Indian subsidiary (est. 2005) of WFB Baird & Co Ltd, Lurgan, Northern Ireland. Solar is mentioned only qualitatively - no MW, kWh or percentage.",Not Applicable - ESG Score not disclosed
`;

// Parse CSV manually (very rough split by newline, handling quotes)
fs.writeFileSync('../scratch/all_companies.csv', rawData);
console.log('Saved raw data to ../scratch/all_companies.csv');
