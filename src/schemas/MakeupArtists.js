const dynamoose = require("dynamoose");
const makeupArtistsSchema = new dynamoose.Schema(
  {
    businessId: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
    },
    contacts: {
      type: Array,
    },
    facebookLinks: {
      type: Array,
    },
    instagramLinks: {
      type: Array,
    },
    websiteLink: {
      type: String,
    },
    bookingEmail: {
      type: String,
    },
    description: {
      type: String,
    },
    serviceForGender: {
      type: String,
    },
    pricePackage: {
      type: Object,
      // package names
      // package prices
      // package services
    },
    places: {
      cities: {
        type: Array,
      },
      locations: {
        type: Array,
      },
      addresses: {
        type: Array,
      },
    },
    expertise: {
      type: String,
    },
    covidCompliant: {
      type: Boolean,
    },
    downPayment: {
      paymentType: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },
    cancelationPolicy: {
      type: String,
    },
    additionalInfo: {},
    serviceProviderAt: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    saveUnknown: true,
  }
);

module.exports = makeupArtistsSchema;
