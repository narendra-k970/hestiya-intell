const mongoose = require("mongoose");

const CompanyProfileSchema = new mongoose.Schema(
  {
    basicInfo: {
      companyName: { type: String, required: true },
      yearFounded: { type: Number },
      ownershipType: { type: String },
      numEmployees: { type: Number },
      numFacilities: { type: Number },
    },
    location: {
      hqCity: { type: String },
      hqState: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    workforce: {
      numMale: { type: Number },
      malePercentage: { type: Number },
      numFemale: { type: Number },
      femalePercentage: { type: Number },
    },
    emissions: {
      scope1_tCO2e: { type: Number },
      scope2_LocationBased_tCO2e: { type: Number },
      scope1_Plus_2_tCO2e: { type: Number },
      employeeCarbonIntensity: { type: Number },
      energyCarbonIntensity: { type: Number },
    },
    resources: {
      rePercentage: { type: Number },
      totalEnergy_TJ: { type: Number },
      solarCapacity_MWp: { type: Number },
      totalWater_KL: { type: Number },
      zldCoveragePercentage: { type: Number },
      waste: {
        totalGenerated_MT: { type: Number },
        hazardous_MT: { type: Number },
        plastic_MT: { type: Number },
      },
    },
    certifications: {
      reportingStandard: { type: String },
      reportingFY: { type: String },
      sbtiStatus: { type: String },
      sbtiEngagementOpp: { type: String },
      cdpScore: { type: String },
      iso14001: { type: String },
      gots: { type: String },
      re100Member: { type: String },
    },
    scores: {
      disclosureQuality: { type: Number },
      reAmbitionScore: { type: Number },
      emissionsCompleteness: { type: Number },
      esgScore: { type: Number },
      esgRating: { type: String },
    },
    supplyChain: {
      sustainableMaterialsPercentage: { type: Number },
      farmersEngaged: { type: Number },
      majorBuyers: [{ type: String }],
      primaryRawMaterial: [{ type: String }],
      fabricSourcingGeography: { type: String },
    },
    goalsAndActions: {
      recommendedAction: { type: String },
      renewableEnergyTarget: { type: String },
      coalPhaseOutStatus: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyProfile", CompanyProfileSchema);
