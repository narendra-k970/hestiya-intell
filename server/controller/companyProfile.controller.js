const CompanyProfile = require("../models/CompanyProfile");

// Helper to safely parse numbers
const parseNumber = (val) => {
  if (val === undefined || val === null || val === "" || val === "Not Disclosed") return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// Helper to safely parse arrays from comma separated strings
const parseArray = (val) => {
  if (!val || typeof val !== 'string' || val === "Not Disclosed") return [];
  return val.split(',').map(item => item.trim()).filter(Boolean);
};

exports.uploadCompanyProfiles = async (req, res) => {
  try {
    const rawData = req.body; // Expects an array of objects from excel

    if (!Array.isArray(rawData)) {
      return res.status(400).json({ success: false, message: "Data format must be an array of objects" });
    }

    const profiles = rawData.map(row => {
      return {
        basicInfo: {
          companyName: row['Company Name'] || row['Company'],
          yearFounded: parseNumber(row['Year Founded']),
          ownershipType: row['Ownership Type'],
          numEmployees: parseNumber(row['Num Employees']),
          numFacilities: parseNumber(row['Num Facilities']),
        },
        location: {
          hqCity: row['HQ City'],
          hqState: row['HQ State'],
          coordinates: {
            latitude: parseNumber(row['Latitude']),
            longitude: parseNumber(row['Longitude']),
          },
        },
        workforce: {
          numMale: parseNumber(row['Num Male Workers']),
          malePercentage: parseNumber(row['Male %']),
          numFemale: parseNumber(row['Female']),
          femalePercentage: parseNumber(row['Female %']),
        },
        emissions: {
          scope1_tCO2e: parseNumber(row['Scope1 tCO2e']),
          scope2_LocationBased_tCO2e: parseNumber(row['Scope2 LocationBased tCO2e']),
          scope1_Plus_2_tCO2e: parseNumber(row['Scope1 Plus 2 tCO2e']),
          employeeCarbonIntensity: parseNumber(row['Employee Carbon Intensity (tCO₂e/employee/year)']),
          energyCarbonIntensity: parseNumber(row['Energy Carbon Intensity (tCO₂e/TJ)']),
        },
        resources: {
          rePercentage: parseNumber(row['RE Percentage']),
          totalEnergy_TJ: parseNumber(row['Total Energy TJ']),
          solarCapacity_MWp: parseNumber(row['Solar Capacity MWp']),
          totalWater_KL: parseNumber(row['Total Water KL']),
          zldCoveragePercentage: parseNumber(row['ZLD Coverage %']),
          waste: {
            totalGenerated_MT: parseNumber(row['Total Waste Generated (MT)']),
            hazardous_MT: parseNumber(row['Hazardous Waste (MT)']),
            plastic_MT: parseNumber(row['Plastic Waste (MT)']),
          },
        },
        certifications: {
          reportingStandard: row['Reporting Standard'],
          reportingFY: row['Reporting FY'],
          sbtiStatus: row['SBTi Status'],
          sbtiEngagementOpp: row['SBTi Engagement Opp'],
          cdpScore: String(row['CDP Score'] || ''),
          iso14001: String(row['ISO14001'] || ''),
          gots: String(row['GOTS'] || ''),
          re100Member: String(row['RE100 Member'] || ''),
        },
        scores: {
          disclosureQuality: parseNumber(row['Disclosure Quality']),
          reAmbitionScore: parseNumber(row['RE Ambition Score']),
          emissionsCompleteness: parseNumber(row['Emissions Completeness']),
          esgScore: parseNumber(row['ESG Score']),
          esgRating: row['ESG Rating'],
        },
        supplyChain: {
          sustainableMaterialsPercentage: parseNumber(row['Sustainable Materials / Inputs %']),
          farmersEngaged: parseNumber(row['Farmers Engaged']),
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

exports.getCompanyProfiles = async (req, res) => {
  try {
    const profiles = await CompanyProfile.find({});
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
