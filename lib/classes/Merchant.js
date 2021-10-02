const http = require('../utils/http.js');

const Delivery = require('./Delivery.js');
const Transfer = require('./Transfer.js');
const DeliveryPackage = require('./DeliveryPackage.js');
const { Sale, DayTransaction, Transaction } = require('./Sale.js');
const Plant = require('./Plant.js');
const WholesaleDeliveryPackage = require('./WholesaleDeliveryPackage.js');
const Facility = require('./Facility.js');
const LabTestBatch = require('./LabTestBatch');

function Merchant({ vendorkey, userkey, licenseNo='' }) {
  this.licenseNo = licenseNo;
  this.vendorkey = vendorkey;
  this.userkey = userkey;
  this.transferPath = '/transfers/v1';
  this.salesPath = '/sales/v1';
  this.plantPath = '/plants/v1';
  this.packagePath = '/packages/v1';
  this.facilityPath = '/facilities/v1';
  this.itemsPath = '/items/v1'
}

/**
 * Method to get all incoming transfers
 * @param { Object }  { lastModifiedEnd, lastModifiedStart }
 * @param { Function } callback
 */

 Merchant.prototype.updateLicenseNo =async function({licenseNo}){
  this.licenseNo = licenseNo
 }

Merchant.prototype.getIncomingTransfers = async function ({ lastModifiedEnd, lastModifiedStart }) {
  return new Promise((resolve, reject) => {
    const path = `${this.transferPath}/incoming`;
    // TODO http request return await variable
    const merchantRef = this;
    const { licenseNo } = merchantRef;
    const url = `${path}?licenseNumber=${licenseNo}&lastModifiedStart=${lastModifiedStart}&lastModifiedEnd=${lastModifiedEnd}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        /** Transforming the output into structured templates */
        response.data.map((transferData) => {
          return new Transfer(transferData);
        });
        console.log("Response data from metrc", response.data)
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Method to get all outging transfers
 * @param { Object }  { lastModifiedEnd, lastModifiedStart }
 * @param { Function } callback
 */
Merchant.prototype.getOutgoingTransfers = async function ({ lastModifiedStart, lastModifiedEnd }) {
  return new Promise((resolve, reject) => {
    const path = `${this.transferPath}/outgoing`;
    const url = `${path}?licenseNumber=${this.licenseNo}&lastModifiedStart=${lastModifiedStart}&lastModifiedEnd=${lastModifiedEnd}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        response.data.map((transfer) => {
          return new Transfer(transfer);
        });
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * Method to get all rejected transfers
 * @param { Function } callback
 */
Merchant.prototype.getRejectedTransfers = async function () {
  return new Promise((resolve, reject) => {
    const path = `${this.transferPath}/rejected`;
    const url = `${path}?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        response.data.map((transfer) => {
          return new Transfer(transfer);
        });
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * Method to get all facilities
 * @param { Function } callback
 */
Merchant.prototype.getFacilities = async function () {
  return new Promise((resolve, reject) => {
    http
      .get(this.facilityPath, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        response.data.map((facility) => {
          return new Facility(facility);
        });
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * Method to get transfer template
 * @param { number } transferId
 */
Merchant.prototype.getTransfer = function (transferId) {
  const transfer = new Transfer({ Id: transferId });
  return transfer;
};

/**
 * Method to get all deliveries in a transfer
 * @param { Transfer } transfer
 * @param { Function } callback
 */
Merchant.prototype.getDeliveries = async function (transfer) {
  return new Promise((resolve, reject) => {
    const url = `${this.transferPath}/${transfer.id}/deliveries`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        resolve(
          response.data.map((delivery) => {
            return new Delivery(delivery);
          })
        );
      })
      .catch((error) => reject(error));
  });
};

/**
 * Methode to get delivery template
 * @param { number } deliveryId
 */
Merchant.prototype.getDelivery = function (deliveryId) {
  const delivery = new Delivery({ Id: deliveryId });
  delivery.id = deliveryId;
  return delivery;
};

/**
 * Method to get all packages in a transfer
 * @param { Delivery } delivery
 * @param { Function } callback
 */
Merchant.prototype.getTransferPackages = async function (delivery) {
  return new Promise((resolve, reject) => {
    const url = `${this.transferPath}/delivery/${delivery.id}/packages`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then(response => {
        resolve(
          response.data.map(pkg => {
            return new DeliveryPackage(pkg)
          }),
        )
      })
      .catch((error) => reject(error));
  });
};

/**
 * Method to get all deliveries in a transfer
 * @param { Transfer } transfer
 * @param { fucntion } callback
 */
Merchant.prototype.getWholesalePackages = async function (delivery) {
  return new Promise((resolve, reject) => {
    const url = `${this.transferPath}/delivery/${delivery.id}/packages/wholesale`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        const packages = response.data.map((pkg) => {
          return new WholesaleDeliveryPackage(pkg);
        });
        resolve(packages);
      })
      .catch((error) => reject(error));
  });
};
/**
 * function for geting package template
 * @param { number } packageId
 */
Merchant.prototype.getTransferPackage = function (packageId) {
  return new DeliveryPackage({ PackageId: packageId });
};

/**
 * function to get required lab test batches
 * @param { Package } package
 * @param { function } callback
 */
Merchant.prototype.getRequiredLabTestBatches = async function (pkg) {
  return new Promise((resolve, reject) => {
    const url = `${this.transferPath}/delivery/package/${pkg.id}/requiredlabtestbatches`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        const labtestBatches = response.data.map((labTestBatch) => {
          return new LabTestBatch(labTestBatch);
        });
        resolve(labtestBatches);
      })
      .catch((error) => reject(error));
  });
};

/**
 * Method to create a transfer PUT req
 * @param { Object } shipper
 * @param { Array } destinations
 */
Merchant.prototype.createTransfer = function (shipper, destinations) {
  /** Temperory redundant data in the POST call which is usually null */
  const tempData = {
    TransporterFacilityLicenseNumber: null,
    DriverOccupationalLicenseNumber: null,
    DriverName: null,
    DriverLicenseNumber: null,
    PhoneNumberForQuestions: null,
    VehicleMake: null,
    VehicleModel: null,
    VehicleLicensePlateNumber: null,
  };
  const transferData = { ...shipper, ...tempData, Destinations: destinations };
  /** Final request data for a single transfer */
  return transferData;
};

/**
 * POST transfer array
 * @param { Array } transfers
 * @param { Function } callback
 */
Merchant.prototype.postTransfers = async function (transfers) {
  this.sendTransfersData(transfers, true, true);
};

/**
 * PUT transfer array
 * @param { Array } transfers
 * @param { Function } callback
 */
Merchant.prototype.putTransfers = async function (transfers) {
  this.sendTransfersData(transfers, true, false);
};

/**
 * POST templates array
 * @param { Array } transfers
 * @param { Function } callback
 */
Merchant.prototype.postTemplates = async function (templates) {
  this.sendTransfersData(templates, false, true);
};

/**
 * PUT templates array
 * @param { Array } transfers
 * @param { Function } callback
 */
Merchant.prototype.putTemplates = async function (templates) {
  this.sendTransfersData(templates, false, false);
};

/**
 * PUT / POST method for template and transfer
 * @param { Array } data (transfersArray or templatesArray)
 * @param { Boolean } isTransfer (templates || transfers)
 * @param { Function } callback
 */
Merchant.prototype.sendTransfersData = async function (data, isTransfer, isPost) {
  return new Promise((resolve, reject) => {
    const path = isTransfer ? 'external/incoming' : 'templates';
    const url = `${this.transferPath}/${path}?licenseNumber=${this.licenseNo}`;
    // check if method is put or post
    if (isPost) {
      http
        .post(url, data, {
          username: this.vendorkey,
          password: this.userkey,
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    } else {
      http
        .put(url, data, {
          username: this.vendorkey,
          password: this.userkey,
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    }
  });
};

/**
 * get template from destinations data
 * @param { Array } destinations
 */
Merchant.prototype.createTemplate = function (destinations) {
  return this.createTransfer({}, destinations);
};

/**
 * delete the extrnal incoming transfer by its id
 * @param { Number } transferId
 * @param { Function } callback
 */
Merchant.prototype.deleteIncomingTransfer = async function (transferId) {
  return new Promise((resolve, reject) => {
    const path = `${this.transferPath}/external/incoming/${transferId}`;
    http
      .delete(path, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * delete a template by id
 * @param { Number } templateId
 * @param { Function } callback
 */
Merchant.prototype.deleteTemplate = async function (templateId) {
  return new Promise((resolve, reject) => {
    const path = `${this.transferPath}/templates/${templateId}`;
    http
      .delete(path, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * Method to get templates for a transfer
 * @param { Object } { lastModifiedEnd ,lastModifiedStart }
 * @param { Function } callback
 */
Merchant.prototype.getTemplates = async function ({ lastModifiedEnd, lastModifiedStart }) {
  return new Promise((resolve, reject) => {
    const path = `${this.transferPath}/templates`;
    const url = `${path}?licenseNumber=${this.licenseNo}&lastModifiedStart=${lastModifiedStart}&lastModifiedEnd=${lastModifiedEnd}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        /** Mapping the data with templates */
        response.data.map(function (template) {
          return new Transfer(template);
        });
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * create a class template of Transfertemplate
 * @param { number } templateId
 */
Merchant.prototype.getTransferTemplate = function (templateId) {
  return new Transfer({ Id: templateId });
};

/**
 * Method to get the transfer template deliveries
 * @param { Transfer } transferTemplate
 * @param { Function } callback
 */
Merchant.prototype.getTransferTemplateDeliveries = async function (transferTemplate) {
  return new Promise((resolve, reject) => {
    const url = `${this.transferPath}/${transferTemplate.id}/deliveries`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        let deliveries = [];
        deliveries = response.data.map((delivery) => {
          return new Delivery(delivery);
        });
        resolve(deliveries);
      })
      .catch((error) => reject(error));
  });
};

/**
 * method to get sales receipts
 * @param { Object } { lastModifiedEnd, lastModifiedStart, salesDateEnd, salesDateStart}
 * @param { Boolean } isActive
 * @param { Function } callback
 */
Merchant.prototype.getSalesReceipts = async function (
  { lastModifiedEnd, lastModifiedStart, salesDateStart, salesDateEnd },
  isActive
) {
  const path = `${this.salesPath}/receipts/${isActive ? 'active' : 'inactive'}`;
  const url = `${path}?licenseNumber=${this.licenseNo}&lastModifiedStart=${lastModifiedStart}&lastModifiedEnd=${lastModifiedEnd}&salesDateStart=${salesDateStart}&salesDateEnd=${salesDateEnd}`;
  try {
    const response = await http.get(url, {
      username: this.vendorkey,
      password: this.userkey,
    });
    const receipts = response.data.map((receipt) => {
      return new Sale(receipt);
    });
    return receipts;
  } catch (error) {
    return error;
  }
};

/**
 * delete a receipt by id
 * @param { Number } receiptId
 * @param { Function } callback
 */
Merchant.prototype.deleteReceipt = async function (receiptId) {
  return new Promise((resolve, reject) => {
    const path = `${this.salesPath}/receipts/${receiptId}`;
    http
      .delete(path, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * get Sale template
 * @param {number} receiptId
 */
Merchant.prototype.getSale = function (receiptId) {
  return new Sale({ Id: receiptId });
};

/**
 * method to get sales receipts by Id
 * @param { Sale } sale
 * @param { Function } callback
 */
Merchant.prototype.getSalesRecieptById = async function (sale) {
  return new Promise((resolve, reject) => {
    const path = `${this.salesPath}/receipts`;
    const url = `${path}/${sale.receipt.id}/?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to get sales transactions
 * @param { Function } callback
 */
Merchant.prototype.getSalesTransactions = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.salesPath}/transactions?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        response.data.map((transaction) => {
          return new DayTransaction(transaction);
        });
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * method to create sales receipts
 * @param { Array } sales
 * @param { Function } callback
 */
Merchant.prototype.postSalesReceipt = async function (sales) {
  return new Promise((resolve, reject) => {
    const url = `${this.salesPath}/receipts?licenseNumber=${this.licenseNo}`;
    http
      .post(url, sales, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to put sales receipts
 * @param { Array } sales
 * @param { Function } callback
 */
Merchant.prototype.putSalesReceipt = async function (sales) {
  return new Promise((resolve, reject) => {
    const url = `${this.salesPath}/receipts?licenseNumber=${this.licenseNo}`;
    http
      .put(url, sales, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to get sales transactions by range
 * @param { Object } { salesDateStart, salesDateEnd }
 * @param { Function } callback
 */
Merchant.prototype.getSalesTransactionsByRange = async function ({ salesDateStart, salesDateEnd }) {
  return new Promise((resolve, reject) => {
    const path = `${this.salesPath}/transactions`;
    const url = `${path}/${salesDateStart}/${salesDateEnd}?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        response.data.map((transaction) => {
          return new Transaction(transaction);
        });
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
};

/**
 * method to create transaction
 * @param { Array } transactions
 * @param { Function } callback
 */
Merchant.prototype.sendSalesTransaction = async function (transactions, salesDate, isPost) {
  return new Promise((resolve, reject) => {
    const url = `${this.salesPath}/transactions/${salesDate}?licenseNumber=${this.licenseNo}`;
    if (isPost) {
      http
        .post(url, transactions, {
          username: this.vendorkey,
          password: this.userkey,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    } else {
      http
        .put(url, transactions, {
          username: this.vendorkey,
          password: this.userkey,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    }
  });
};

/**
 * method to get single plant details by key
 * key can be Id or label
 * @param { Any } key
 * @param { Function } callback
 */
Merchant.prototype.getPlant = async function (key) {
  return new Promise((resolve, reject) => {
    const url = `${this.plantPath}/${key}?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to get plants details by key
 * key can be a state (onhold, inactive) or type (flowering, vegitative, additives)
 * @param { Any } key
 * @param { Function } callback
 */
Merchant.prototype.getPlants = async function ({ lastModifiedEnd, lastModifiedStart }, key) {
  return new Promise((resolve, reject) => {
    const path = `${this.plantPath}/${key}`;
    const url = `${path}?licenseNumber=${this.licenseNo}&lastModifiedStart=${lastModifiedStart}&lastModifiedEnd=${lastModifiedEnd}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        const plants = response.data.map((plant) => new Plant(plant));
        resolve(plants);
      })
      .catch((error) => reject(error));
  });
};

/**
 * method to get plant growthphases
 * @param { Function } callback
 */
Merchant.prototype.getPlantGrowthPhases = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.plantPath}/growthphases?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to get plant additives type
 * @param { Function } callback
 */
Merchant.prototype.getPlantAdditiveTypes = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.plantPath}/additives/types`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to get plant waste methods
 * @param { Function } callback
 */
Merchant.prototype.getPlantWasteMethods = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.plantPath}/waste/methods`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * method to get plant waste reasons
 * @param { Function } callback
 */
Merchant.prototype.getPlantWasteReasons = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.plantPath}/waste/reasons?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * Get a package by using key, key can be Id or Label
 * @param { Any } key
 * @param { Function } callback
 */
Merchant.prototype.getPackage = async function (key) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/${key}?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(new DeliveryPackage(response.data)))
      .catch((error) => reject(error));
  });
};

/**
 * Get a package by using key, key can be Id or Label
 * @param { Object } { lastModifiedEnd, lastModifiedStart }
 * @param { string } key
 * @param { Function } callback
 */
Merchant.prototype.getPackages = async function ({ lastModifiedEnd, lastModifiedStart }, key) {
  return new Promise((resolve, reject) => {
    const path = `${this.packagePath}/${key}`;
    const url = `${path}?licenseNumber=${this.licenseNo}&lastModifiedStart=${lastModifiedStart}&lastModifiedEnd=${lastModifiedEnd}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => {
        const res = response.data.map((pkg) => {
          return new DeliveryPackage(pkg);
        });
        resolve(res);
      })
      .catch((error) => reject(error));
  });
};
/**
 * Get package types
 * @param { Function } callback
 */
Merchant.prototype.getPackageTypes = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/types`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * Get package types
 * @param { Function } callback
 */
Merchant.prototype.getPackageTypes = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/types`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * Get package adjustment reasons
 * @param { Function } callback
 */
Merchant.prototype.getPackageAdjustmentReasons = async function () {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/adjust/reasons?licenseNumber=${this.licenseNo}`;
    http
      .get(url, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * Method to create a package
 * @param { Array } package
 * @param { Function } callback
 */
Merchant.prototype.createPackage = async function (packages, isTestPackage) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/create${isTestPackage ? '/testing' : ''}?licenseNumber=${this.licenseNo}`;
    http
      .post(url, packages, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

/**
 * Method to create planting package
 * @param { Array } plantingsData
 * @param { Function } callback
 */
Merchant.prototype.createPlantingPackage = async function (plantingsData) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/create/plantings?licenseNumber=${this.licenseNo}`;
    http
      .post(url, plantingsData, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to change items in package
 * @param { Array } items
 * @param { Function } callback
 */
Merchant.prototype.changePackageItem = async function (items) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/change/item?licenseNumber=${this.licenseNo}`;
    http
      .post(url, items, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to change notes in package
 * @param { Array } notes
 * @param { Function } callback
 */
Merchant.prototype.changePackageNote = async function (notes) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/change/note?licenseNumber=${this.licenseNo}`;
    http
      .put(url, notes, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to change location of package
 * @param { Array } locations
 * @param { Function } callback
 */
Merchant.prototype.changePackageLocation = async function (locations) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/change/locations?licenseNumber=${this.licenseNo}`;
    http
      .post(url, locations, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to adjustment of package
 * @param { Array } adjustments
 * @param { Function } callback
 */
Merchant.prototype.adjustPackage = async function (adjustments) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/adjust?licenseNumber=${this.licenseNo}`;
    http
      .post(url, adjustments, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to remediation of package
 * @param { Array } remediateData
 * @param { Function } callback
 */
Merchant.prototype.remediatePackage = async function (remediateData) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/remediate?licenseNumber=${this.licenseNo}`;
    http
      .post(url, remediateData, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to set finished package data
 * @param { Array } finishedPackages
 * @param { Function } callback
 */
Merchant.prototype.setFinishedPackage = async function (finishedPackages) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/finish?licenseNumber=${this.licenseNo}`;
    http
      .post(url, finishedPackages, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

/**
 * Method to set unfinished package data
 * @param { Array } unFinishedPackages
 * @param { Function } callback
 */
Merchant.prototype.setUnFinishedPackage = async function (unFinishedPackages) {
  return new Promise((resolve, reject) => {
    const url = `${this.packagePath}/unfinish?licenseNumber=${this.licenseNo}`;
    http
      .post(url, unFinishedPackages, {
        username: this.vendorkey,
        password: this.userkey,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

Merchant.prototype.getActiveItems = async function(){
  return new Promise((resolve,reject)=>{
    const url = `${this.itemsPath}/active?licenseNumber=${this.licenseNo}`;
    http.get(url, {
      username: this.vendorkey,
      password: this.userkey,
    }).then((response)=>resolve(response.data))
    .catch(reject);
  })
}

module.exports = Merchant;
