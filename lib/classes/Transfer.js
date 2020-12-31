const http = require('../http/http.js');

function Transfer(merchant) {
    this.id = 0;
    this.manifestNumber = 0;
    this.name = "";
    this.createdDateTime = null;
    this.createdBy = "";
    this.lastModified = null;
    initAPIConfig(merchant);
    this.path = '/transfers/v1';

    function initAPIConfig(merchant) {
        let serverName = merchant.configuration.serverUrl.split('//')[1];
        this.licenseNo = merchant.configuration.licenseNo;
        http.setOptions(serverName, merchant.configuration.authorization);
    }
}

/**
 * Template for generating Vehicle object 
 *          manufacturer of vehicle ,   model of the vehicle , license plate no. assigned by the government body
 * @param { { string } VehicleMake, { string } VehicleModel, { string } VehicleLicensePlateNumber }
 */
function Vehicle({ VehicleMake, VehicleModel, VehicleLicensePlateNumber }) {
    this.make = VehicleMake;
    this.model = VehicleModel;
    this.licensePlateNo = VehicleLicensePlateNumber;
}

/**
 * Template for generating Driver object 
 *          driver's name ,                     driver's license no.,           vehicle license no 
 * @param { { string } DriverName, { string } DriverOccupationalLicenseNumber, { string } DriverVehicleLicenseNumber }
 */
function Driver({ DriverName, DriverOccupationalLicenseNumber, DriverVehicleLicenseNumber }) {
    this.name = DriverName;
    this.licenseNo = DriverOccupationalLicenseNumber;
    this.vehicleLicenseNo = DriverVehicleLicenseNumber;
}

/**
 * Template for generating Shipper (person/body/orgnization who ships) object 
 * @param { { string } ShipperFacilityLicenseNumber, { string } ShipperFacilityName }
 * ShipmentLicenseType - type of license of shipment ,
 * ShipperFacilityLicenseNumber - unique number of shipper's facility ,
 * ShipperFacilityName - name of shipper's facility
 */
function Shipper({ ShipperFacilityLicenseNumber, ShipperFacilityName }) {
    this.facilityLicenseNo = ShipperFacilityLicenseNumber;
    this.facilityName = ShipperFacilityName;
}

/**
 * Template for generating Shipment reciever (person/body/orgnization who recieves) object 
 * @param {{ string } RecipientFacilityLicenseNumber, { string } RecipientFacilityName }
 * RecipientFacilityLicenseNumber - unique number of recieient's facility  
 * RecipientFacilityName - name of reciepient's facility
 */
function ShipmentReciever({ RecipientFacilityLicenseNumber, RecipientFacilityName }) {
    this.facilityLicenseNo = RecipientFacilityLicenseNumber;
    this.facilityName = RecipientFacilityName;
}

/**
 * Template for generating Shipment transporter (person/body/orgnization who transports) object 
 * @param {{ string } TransporterFacilityLicenseNumber, { string } TransporterFacilityName }
 * TransporterFacilityLicenseNumber - unique number of transporter's facility  
 * TransporterFacilityName - name of transporter's facility
 */
function ShipmentTransporter({ TransporterFacilityLicenseNumber, TransporterFacilityName }) {
    this.facilityLicenseNo = TransporterFacilityLicenseNumber;
    this.facilityName = TransporterFacilityName;
}


/**
 * Template for generating Shipment  object 
 * @param {{ string } ShipmentTypeName, { string } ShipmentTransactionType, { string } ShipmentLicenseType}
 * ShipmentTypeName - type of shipment 
 * ShipmentTransactionType - type of transaction associated with the shipment
 * ShipmentLicenseType - tyepe of shipment license
 */
function Shipment({ ShipmentTypeName, ShipmentTransactionType, ShipmentLicenseType }) {
    this.type = ShipmentTypeName;
    this.transactionType = ShipmentTransactionType;
    this.licenseType = ShipmentLicenseType;
}


/**
 * Template for generating Shipper (person/body/orgnization who ships) object 
 * @param { { Date } EstimatedDepartureDateTime, { Date } ActualDepartureDateTime, { Date } EstimatedArrivalDateTime,
 * { Date } ActualArrivalDateTime , { Date } ReceivedDateTime, { Date } EstimatedReturnDepartureDateTime, { Date } ActualReturnDepartureDateTime, { Date } EstimatedReturnArrivalDateTime, { Date } ActualReturnArrivalDateTime,  }
 */
function ETA({ EstimatedDepartureDateTime = null, ActualDepartureDateTime = null, EstimatedArrivalDateTime = null, ActualArrivalDateTime = null, ReceivedDateTime = null, EstimatedReturnDepartureDateTime = null, ActualReturnDepartureDateTime = null, EstimatedReturnArrivalDateTime = null, ActualReturnArrivalDateTime = null }) {
    this.arrival = new transferActionTime(EstimatedArrivalDateTime, ActualArrivalDateTime);
    this.departure = new transferActionTime(EstimatedDepartureDateTime, ActualDepartureDateTime);
    this.returnTransfer = {
        arrival: new transferActionTime(EstimatedReturnArrivalDateTime, ActualReturnArrivalDateTime),
        departure: new transferActionTime(EstimatedReturnDepartureDateTime, ActualReturnDepartureDateTime)
    };
    this.recieved = ReceivedDateTime;
}

/**
 * transfer action i.e arrival and departure time 
 * @param { Date } eta estimatedtime
 * @param { Date } actual actualtime
 */
function transferActionTime(eta, actual) {
    this.eta = eta;
    this.actual = actual;
};

/**
 * template for generating delivery object with delivery ids and counts
 * @param { { number } DeliveryId, { number } DeliveryCount, { number } ReceivedDeliveryCount }
 */
function Delivery({ DeliveryId, DeliveryCount, ReceivedDeliveryCount }) {
    this.id = DeliveryId;
    this.count = DeliveryCount;
    this.recievedCount = ReceivedDeliveryCount;
}


/**
 * template for generating package object with delivery ids and counts
 * @param { { number } PackageCount, { number } ReceivedPackageCount
 */
function Package({ PackageCount, ReceivedPackageCount }) {
    this.count = PackageCount;
    this.receivedCount = ReceivedPackageCount;
    this.deliveryCount = DeliveryPackageCount;
    this.deliveryRecievedCount = DeliveryReceivedPackageCount;
}


/**
 * template for generating delivery package object
 * @param {{ number } DeliveryPackageCount, { number } DeliveryReceivedPackageCount }
 */
function DeliveryPackage({ DeliveryPackageCount, DeliveryReceivedPackageCount }) {
    this.deliveryCount = DeliveryPackageCount;
    this.deliveryRecievedCount = DeliveryReceivedPackageCount;
}


/** 
 * template to check contents of the transfer
 * @param { { boolean } ContainsPlantPackage, { boolean } ContainsProductPackage, { boolean } ContainsTradeSample, { boolean } ContainsDonation, { boolean }  ContainsTestingSample, { boolean } ContainsProductRequiresRemediation, { boolean } ContainsRemediatedProductPackage }
*/
function transferContent({ ContainsPlantPackage, ContainsProductPackage, ContainsTradeSample, ContainsDonation, ContainsTestingSample, ContainsProductRequiresRemediation, ContainsRemediatedProductPackage }) {
    this.plantPackage = ContainsPlantPackage;
    this.productPackage = ContainsProductPackage;
    this.tradeSample = ContainsTradeSample;
    this.donation = ContainsDonation;
    this.testingSample = ContainsTestingSample;
    this.requiresRemediation = ContainsProductRequiresRemediation;
    this.remdiationProductPackage = ContainsRemediatedProductPackage;
}


function getIncoming() {
  http.get(`${this.path}/incoming?licenseNumber=${this.licenseNo}`);
}

module.exports = Transfer;