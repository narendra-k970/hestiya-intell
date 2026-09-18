const CompanyProfile = require("../models/CompanyProfile");

// Helper to safely parse numbers, but preserve sentinel strings
const parseMixed = (val) => {
  if (val === undefined || val === null || val === "") return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (["Not Disclosed", "Not Stated", "Not Applicable"].includes(trimmed)) {
      return trimmed;
    }
  }
  const num = Number(val);
  return isNaN(num) ? val : num; // fallback to string if it's text, otherwise number
};

// Helper to safely parse arrays from comma separated strings
const parseArray = (val) => {
  if (!val || typeof val !== 'string' || ["Not Disclosed", "Not Stated", "Not Applicable"].includes(val)) return [];
  return val.split(',').map(item => item.trim()).filter(Boolean);
};

// Helper to parse Excel Serial Dates to JS Dates
const parseExcelDate = (excelDate) => {
  if (!excelDate) return null;
  if (typeof excelDate === 'number') {
    return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  }
  return new Date(excelDate);
};

exports.uploadCompanyProfiles = async (req, res) => {
  try {
    const rawData = req.body; // Expects an array of objects from excel

    if (!Array.isArray(rawData)) {
      return res.status(400).json({ success: false, message: "Data format must be an array of objects" });
    }

    const profiles = rawData.map(row => {
      return {
        dataStatus: row['Data Status'] || 'Pending QA',
        lastVerifiedDate: parseExcelDate(row['Last Verified Date']),
        dataSource: String(row['Data Source(s) / Citation'] || ''),
        notes: String(row['Notes'] || ''),
        basicInfo: {
          companyName: row['Company Name'] || row['Company'] || row['Factory Name'],
          yearFounded: parseMixed(row['Year Founded'] || row['Year Established']),
          ownershipType: row['Ownership Type'],
          numEmployees: parseMixed(row['Num Employees'] || row['Total Employees']),
          numFacilities: parseMixed(row['Num Facilities'] || row['Num Factories Supplying H&M (India)']),
        },
        location: {
          hqCity: row['HQ City'],
          hqState: row['HQ State'],
          coordinates: {
            latitude: parseMixed(row['Latitude']),
            longitude: parseMixed(row['Longitude']),
          },
        },
        workforce: {
          numMale: parseMixed(row['Num Male Workers']),
          malePercentage: parseMixed(row['Male %']),
          numFemale: parseMixed(row['Female']),
          femalePercentage: parseMixed(row['Female %']),
        },
        emissions: {
          scope1_tCO2e: parseMixed(row['Scope1 tCO2e'] || row['Scope 1 (tCO2e)']),
          scope2_LocationBased_tCO2e: parseMixed(row['Scope2 LocationBased tCO2e'] || row['Scope 2 (tCO2e)']),
          scope1_Plus_2_tCO2e: parseMixed(row['Scope1 Plus 2 tCO2e'] || row['Scope 1+2 (tCO2e)']),
          employeeCarbonIntensity: parseMixed(row['Employee Carbon Intensity (tCO₂e/employee/year)']) || parseMixed(row['Employee Carbon Intensity (tCO,,e/employee/year)']),
          energyCarbonIntensity: parseMixed(row['Energy Carbon Intensity (tCO₂e/TJ)']) || parseMixed(row['Energy Carbon Intensity (tCO,,e/TJ)']) || parseMixed(row['Energy Carbon Intensity (tCO2e/TJ)']),
        },
        resources: {
          rePercentage: parseMixed(row['RE Percentage'] || row['Renewable Energy %']),
          totalEnergy_TJ: parseMixed(row['Total Energy TJ'] || row['Total Energy (TJ)']),
          solarCapacity_MWp: parseMixed(row['Solar Capacity MWp'] || row['Solar Capacity (MWp)']),
          totalWater_KL: parseMixed(row['Total Water KL'] || row['Total Water (KL)']),
          zldCoveragePercentage: parseMixed(row['ZLD Coverage %']),
          waste: {
            totalGenerated_MT: parseMixed(row['Total Waste Generated (MT)'] || row['Total Waste (MT)']),
            hazardous_MT: parseMixed(row['Hazardous Waste (MT)']),
            plastic_MT: parseMixed(row['Plastic Waste (MT)']),
          },
        },
        certifications: {
          reportingStandard: row['Reporting Standard'],
          reportingFY: row['Reporting FY'],
          sbtiStatus: row['SBTi Status'],
          sbtiEngagementOpp: row['SBTi Engagement Opp'],
          cdpScore: String(row['CDP Score'] || ''),
          iso14001: String(row['ISO14001'] || row['ISO14001 (Y/N)'] || ''),
          gots: String(row['GOTS'] || row['GOTS (Y/N)'] || ''),
          re100Member: String(row['RE100 Member'] || ''),
        },
        scores: {
          disclosureQuality: parseMixed(row['Disclosure Quality']),
          reAmbitionScore: parseMixed(row['RE Ambition Score']),
          emissionsCompleteness: parseMixed(row['Emissions Completeness']),
          esgScore: parseMixed(row['ESG Score']),
          esgRating: row['ESG Rating'],
        },
        supplyChain: {
          sustainableMaterialsPercentage: parseMixed(row['Sustainable Materials / Inputs %']),
          farmersEngaged: parseMixed(row['Farmers Engaged']),
          majorBuyers: parseArray(row['Major Buyers']),
          primaryRawMaterial: parseArray(row['Primary Raw Material']),
          fabricSourcingGeography: row['Fabric Sourcing Geography'],
        },
        goalsAndActions: {
          recommendedAction: row['Recommended Action'],
          renewableEnergyTarget: row['Renewable Energy Target'],
          coalPhaseOutStatus: row['Coal Phase-Out Status'],
        },
      };
    });

    // Filter out rows that might be empty
    const validProfiles = profiles.filter(p => p.basicInfo.companyName);

    // Use bulkWrite with upsert to avoid duplicates and update existing records
    const bulkOps = validProfiles.map(profile => ({
      updateOne: {
        filter: { "basicInfo.companyName": profile.basicInfo.companyName },
        update: { $set: profile },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await CompanyProfile.bulkWrite(bulkOps);
    }

    res.status(200).json({ success: true, count: validProfiles.length, message: "Company profiles uploaded and synced successfully" });
  } catch (error) {
    console.error("Error uploading company profiles:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkVerifyProfiles = async (req, res) => {
  try {
    const { companyIds, newStatus } = req.body;
    if (!Array.isArray(companyIds) || !newStatus) {
      return res.status(400).json({ success: false, message: "Invalid request format" });
    }

    const updated = await CompanyProfile.updateMany(
      { _id: { $in: companyIds } },
      { $set: { dataStatus: newStatus } }
    );

    res.status(200).json({ success: true, count: updated.modifiedCount, message: `Successfully updated ${updated.modifiedCount} profiles to ${newStatus}` });
  } catch (error) {
    console.error("Error in bulk verification:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyProfiles = async (req, res) => {
  try {
    const profiles = await CompanyProfile.find({});
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
