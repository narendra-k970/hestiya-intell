const mongoose = require("mongoose");

const CompanyProfileSchema = new mongoose.Schema(
  {
    dataStatus: { type: String, default: 'Pending QA' },
    lastVerifiedDate: { type: Date },
    dataSource: { type: String },
    notes: { type: String },
    basicInfo: {
      companyName: { type: String, required: true },
      yearFounded: { type: mongoose.Schema.Types.Mixed },
      ownershipType: { type: String },
      numEmployees: { type: mongoose.Schema.Types.Mixed },
      numFacilities: { type: mongoose.Schema.Types.Mixed },
    },
    location: {
      hqCity: { type: String },
      hqState: { type: String },
      coordinates: {
        latitude: { type: mongoose.Schema.Types.Mixed },
        longitude: { type: mongoose.Schema.Types.Mixed },
      },
    },
    workforce: {
      numMale: { type: mongoose.Schema.Types.Mixed },
      malePercentage: { type: mongoose.Schema.Types.Mixed },
      numFemale: { type: mongoose.Schema.Types.Mixed },
      femalePercentage: { type: mongoose.Schema.Types.Mixed },
    },
    emissions: {
      scope1_tCO2e: { type: mongoose.Schema.Types.Mixed },
      scope2_LocationBased_tCO2e: { type: mongoose.Schema.Types.Mixed },
      scope1_Plus_2_tCO2e: { type: mongoose.Schema.Types.Mixed },
      employeeCarbonIntensity: { type: mongoose.Schema.Types.Mixed },
      energyCarbonIntensity: { type: mongoose.Schema.Types.Mixed },
    },
    resources: {
      rePercentage: { type: mongoose.Schema.Types.Mixed },
      totalEnergy_TJ: { type: mongoose.Schema.Types.Mixed },
      solarCapacity_MWp: { type: mongoose.Schema.Types.Mixed },
      totalWater_KL: { type: mongoose.Schema.Types.Mixed },
      zldCoveragePercentage: { type: mongoose.Schema.Types.Mixed },
      waste: {
        totalGenerated_MT: { type: mongoose.Schema.Types.Mixed },
        hazardous_MT: { type: mongoose.Schema.Types.Mixed },
        plastic_MT: { type: mongoose.Schema.Types.Mixed },
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
      disclosureQuality: { type: mongoose.Schema.Types.Mixed },
      reAmbitionScore: { type: mongoose.Schema.Types.Mixed },
      emissionsCompleteness: { type: mongoose.Schema.Types.Mixed },
      esgScore: { type: mongoose.Schema.Types.Mixed },
      esgRating: { type: String },
    },
    supplyChain: {
      sustainableMaterialsPercentage: { type: mongoose.Schema.Types.Mixed },
      farmersEngaged: { type: mongoose.Schema.Types.Mixed },
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
