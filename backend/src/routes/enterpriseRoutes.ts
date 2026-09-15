import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import {
  getAcademicYears,
  closeAcademicYear,
  getMasterData,
  createMasterData,
  getBusinessConfig,
  updateBusinessConfig,
  getCustomFields,
  createCustomField,
  getForms,
  createForm,
  getVendorPOs,
  createVendorPO,
  getAssets,
  createAsset,
  getFinancialPeriods,
  getDocumentTemplates,
  createDocumentTemplate,
} from '../controllers/enterpriseController';

const router = Router();

router.use(protect);

// Academic Years & Closing Workflow
router.get('/academic-years', getAcademicYears);
router.post('/academic-years/close', adminOnly, closeAcademicYear);

// Master Data Management
router.get('/master-data', getMasterData);
router.post('/master-data', adminOnly, createMasterData);

// Business Config
router.get('/business-config', getBusinessConfig);
router.put('/business-config', adminOnly, updateBusinessConfig);

// Custom Fields
router.get('/custom-fields', getCustomFields);
router.post('/custom-fields', adminOnly, createCustomField);

// Form Builder
router.get('/forms', getForms);
router.post('/forms', adminOnly, createForm);

// Vendor PO & Procurement
router.get('/vendor-po', getVendorPOs);
router.post('/vendor-po', adminOnly, createVendorPO);

// Asset Management & QR
router.get('/assets', getAssets);
router.post('/assets', adminOnly, createAsset);

// Financial Periods
router.get('/financial-periods', getFinancialPeriods);

// Document Templates
router.get('/document-templates', getDocumentTemplates);
router.post('/document-templates', adminOnly, createDocumentTemplate);

export default router;
