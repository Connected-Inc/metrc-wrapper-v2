const Item = require('./Item.js');

/**
 * template for Recieved package
 * @param { { Date } ReceivedDateTime, { number } ReceivedFromManifestNumber,  { number } ReceivedFromFacilityLicenseNumber, { string } ReceivedFromFacilityName}
 */
function Recieved({
  ReceivedDateTime,
  ReceivedFromManifestNumber,
  ReceivedFromFacilityLicenseNumber,
  ReceivedFromFacilityName,
}) {
  this.dateTime = ReceivedDateTime;
  this.shipperManifestNumber = ReceivedFromManifestNumber;
  this.shipperFacilityLicenseNumber = ReceivedFromFacilityLicenseNumber;
  this.shippeFarcilityName = ReceivedFromFacilityName;
}

/**
 * template for generating product
 * @param { { number } ProductId, { string } ProductName, { string } ProductCategoryName}
 */
function Product({ ProductId, ProductName, ProductCategoryName }) {
  this.productId = ProductId;
  this.productName = ProductName;
  this.productCategoryName = ProductCategoryName;
}

/**
 * template for adjustment of package
 */
function AdjustmentPackage(packageAdjustmentData) {
  this.Label = packageAdjustmentData.Label;
  this.Quantity = packageAdjustmentData.Quantity;
  this.UnitOfMeasure = packageAdjustmentData.UnitOfMeasure;
  this.AdjustmentReason = packageAdjustmentData.AdjustmentReason;
  this.AdjustmentDate = packageAdjustmentData.AdjustmentDate;
  this.ReasonNote = packageAdjustmentData.ReasonNote;
}

function DeliveryPackage(pkg) {
  const {
    ProductId,
    ProductName,
    ProductCategoryName,
    ReceivedDateTime,
    ReceivedFromManifestNumber,
    ReceivedFromFacilityLicenseNumber,
    ReceivedFromFacilityName,
  } = pkg;
  this.id = pkg.PackageId || pkg.Id;
  this.label = pkg.PackageLabel || pkg.Label;
  this.type = pkg.PackageType;
  this.shipmentPackageState = pkg.ShipmentPackageState;
  this.sourceHarvestNames = pkg.SourceHarvestNames;
  this.sourcePackageLabels = pkg.SourcePackageLabels;
  this.quantity = pkg.Quantity;
  this.unitOfMeasureName = pkg.UnitOfMeasureName;
  this.unitOfMeasureAbbreviation = pkg.UnitOfMeasureAbbreviation;
  this.patientLicenseNumber = pkg.PatientLicenseNumber;
  this.itemFromFacilityLicenseNumber = pkg.ItemFromFacilityLicenseNumber;
  this.itemFromFacilityName = pkg.ItemFromFacilityName;
  this.itemStrainName = pkg.ItemStrainName;
  this.note = pkg.Note;
  this.packagedDate = pkg.PackagedDate;
  this.initialLabTestingState = pkg.InitialLabTestingState;
  this.labTestingState = pkg.LabTestingState;
  this.labTestingStateDate = pkg.LabTestingStateDate;
  this.isProductionBatch = pkg.IsProductionBatch;
  this.productionBatchNumber = pkg.ProductionBatchNumber;
  this.isTradeSample = pkg.IsTradeSample;
  this.isDonation = pkg.IsDonation;
  this.isDonationPersistent = pkg.IsDonationPersistent;
  this.sourcePackageIsDonation = pkg.SourcePackageIsDonation;
  this.isTestingSample = pkg.IsTestingSample;
  this.isProcessValidationTestingSample = pkg.IsProcessValidationTestingSample;
  this.productRequiresRemediation = pkg.ProductRequiresRemediation;
  this.containsRemediatedProduct = pkg.ContainsRemediatedProduct;
  this.remediationDate = pkg.RemediationDate;
  this.remediationMethodName = pkg.RemediationMethodName;
  this.RemediationSteps = pkg.RemediationSteps;
  this.isOnHold = pkg.IsOnHold;
  this.archivedDate = pkg.ArchivedDate;
  this.finishedDate = pkg.FinishedDate;
  this.lastModified = pkg.LastModified;
  this.itemTitle = pkg.Item;
  this.weight = pkg.GrossWeight;
  this.receivedWeightUnit = pkg.GrossUnitOfWeightName;
  this.wholesalePrice = pkg.WholesalePrice;
  this.itemName = pkg.ItemName;
  this.tag = pkg.Tag;
  this.location = pkg.Location;
  this.unitOfMeasure = pkg.UnitOfMeasure;
  this.useSameItem = pkg.UseSameItem;
  this.actualDate = pkg.ActualDate;
  this.ingredients = pkg.Ingredients;
  this.moveDate = pkg.MoveDate;
  this.adjustment = new AdjustmentPackage(pkg);
  this.recieved = new Recieved({
    ReceivedDateTime,
    ReceivedFromManifestNumber,
    ReceivedFromFacilityLicenseNumber,
    ReceivedFromFacilityName,
  });
  this.product = new Product({ ProductId, ProductName, ProductCategoryName });
  this.item = new Item(pkg);
  this.shippedQuantity = pkg.ShippedQuantity;
  this.shippedUnitOfMeasureName = pkg.ShippedUnitOfMeasureName;
  this.receivedQuantity = pkg.ReceivedQuantity;
  this.receivedUnitOfMeasureName = pkg.ReceivedUnitOfMeasureName;
}

/**
 * Method to get POST data for a package in transfer
 */
DeliveryPackage.prototype.getTransferFormData = function () {
  return {
    ItemName: this.itemName,
    Quantity: this.quantity,
    UnitOfMeasureName: this.unitOfMeasureName,
    PackagedDate: this.packagedDate,
    GrossWeight: this.weight,
    GrossUnitOfWeightName: this.receivedWeightUnit,
    WholesalePrice: this.wholesalePrice,
  };
};

/* Method to get POST data for package
 */
DeliveryPackage.prototype.getFormData = function () {
  return {
    Tag: this.tag,
    Location: this.location,
    Item: this.itemText,
    Quantity: this.quantity,
    UnitOfMeasure: this.unitOfMeasure,
    PatientLicenseNumber: this.patientLicenseNumber,
    Note: this.note,
    IsProductionBatch: this.isProductionBatch,
    ProductionBatchNumber: this.productionBatchNumber,
    IsDonation: this.isDonation,
    ProductRequiresRemediation: this.productRequiresRemediation,
    UseSameItem: this.useSameItem,
    ActualDate: this.actualDate,
    Ingredients: this.ingredients,
  };
};

/**
 * method to get item data for change item
 */
DeliveryPackage.prototype.getItemFormData = function () {
  return {
    Label: this.label,
    Item: this.itemTitle,
  };
};

/**
 * method to get notes data for change note
 */
DeliveryPackage.prototype.getNoteFormData = function () {
  return {
    PackageLabel: this.packageLabel,
    Note: this.note,
  };
};

/**
 * method to get location data for change location
 */
DeliveryPackage.prototype.getLocationFormData = function () {
  return {
    Label: this.label,
    Location: this.location,
    MoveDate: this.moveDate,
  };
};

/**
 * method to get adjustment data
 */
DeliveryPackage.prototype.getAdjustmentData = function () {
  return { ...this.adjustment };
};

/**
 * method to get remediation data
 */
DeliveryPackage.prototype.getRemediationData = function () {
  return {
    PackageLabel: 'ABCDEF012345670000020201',
    RemediationMethodName: 'Further Drying',
    RemediationDate: '2016-10-17',
    RemediationSteps: 'Used hair dryer',
  };
};

/**
 * method to get Finished packages data
 */
DeliveryPackage.prototype.getFinishedPackageData = function () {
  return {
    Label: this.label,
    ActualDate: this.actualDate,
  };
};

/**
 * method to get unFinished packages data
 */
DeliveryPackage.prototype.getUnFinishedPackageData = function () {
  return {
    Label: this.label,
  };
};

module.exports = DeliveryPackage;
