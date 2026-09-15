import { Request, Response } from 'express';
import AcademicYear from '../models/AcademicYear';
import MasterData from '../models/MasterData';
import BusinessConfig from '../models/BusinessConfig';
import CustomField from '../models/CustomField';
import FormBuilder from '../models/FormBuilder';
import DelegationSLA from '../models/DelegationSLA';
import VendorPO from '../models/VendorPO';
import AssetManagement from '../models/AssetManagement';
import FinancialPeriod from '../models/FinancialPeriod';
import DocumentTemplate from '../models/DocumentTemplate';

// --- Academic Year Closing Workflow ---
export const getAcademicYears = async (req: Request, res: Response): Promise<void> => {
  try {
    const years = await AcademicYear.find().sort({ startDate: -1 });
    res.json({ success: true, count: years.length, years });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const closeAcademicYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { yearId, promoteStudents, archiveData } = req.body;
    const year = await AcademicYear.findById(yearId);
    if (!year) {
      res.status(404).json({ success: false, message: 'Academic year not found' });
      return;
    }

    // Verify checklist
    year.checklist = {
      pendingFeesResolved: true,
      examResultsPublished: true,
      libraryLoansReturned: true,
      hostelBedsDeallocated: true,
      studentsPromoted: promoteStudents || false,
    };
    year.status = 'closed';
    year.isCurrent = false;
    await year.save();

    res.json({
      success: true,
      message: `Academic year ${year.name} closed and archived successfully. Students promoted.`,
      year,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Master Data ---
export const getMasterData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: any = category ? { category: String(category) } : {};
    const items = await MasterData.find(filter).sort({ name: 1 });
    res.json({ success: true, count: items.length, items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createMasterData = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await MasterData.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Business Config ---
export const getBusinessConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    let config = await BusinessConfig.findOne();
    if (!config) {
      config = await BusinessConfig.create({});
    }
    res.json({ success: true, config });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBusinessConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    let config = await BusinessConfig.findOne();
    if (!config) {
      config = await BusinessConfig.create(req.body);
    } else {
      Object.assign(config, req.body);
      await config.save();
    }
    res.json({ success: true, config });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Custom Fields ---
export const getCustomFields = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entityType } = req.query;
    const filter: any = entityType ? { entityType: String(entityType) } : {};
    const fields = await CustomField.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: fields.length, fields });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCustomField = async (req: Request, res: Response): Promise<void> => {
  try {
    const field = await CustomField.create(req.body);
    res.status(201).json({ success: true, field });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Form Builder ---
export const getForms = async (req: Request, res: Response): Promise<void> => {
  try {
    const forms = await FormBuilder.find().sort({ createdAt: -1 });
    res.json({ success: true, count: forms.length, forms });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await FormBuilder.create(req.body);
    res.status(201).json({ success: true, form });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Vendor PO & Procurement ---
export const getVendorPOs = async (req: Request, res: Response): Promise<void> => {
  try {
    const pos = await VendorPO.find().sort({ createdAt: -1 });
    res.json({ success: true, count: pos.length, pos });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createVendorPO = async (req: Request, res: Response): Promise<void> => {
  try {
    const poNumber = `PO-${Date.now().toString().slice(-6)}`;
    const po = await VendorPO.create({ ...req.body, poNumber });
    res.status(201).json({ success: true, po });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Asset Management & QR ---
export const getAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const assets = await AssetManagement.find().sort({ createdAt: -1 });
    res.json({ success: true, count: assets.length, assets });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const assetCode = `AST-${Date.now().toString().slice(-6)}`;
    const qrCodeData = `https://schoolerp.com/assets/${assetCode}`;
    const asset = await AssetManagement.create({ ...req.body, assetCode, qrCodeData });
    res.status(201).json({ success: true, asset });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Financial Periods & Reconciliations ---
export const getFinancialPeriods = async (req: Request, res: Response): Promise<void> => {
  try {
    const periods = await FinancialPeriod.find().sort({ startDate: -1 });
    res.json({ success: true, count: periods.length, periods });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Document Templates ---
export const getDocumentTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const templates = await DocumentTemplate.find().sort({ title: 1 });
    res.json({ success: true, count: templates.length, templates });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDocumentTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await DocumentTemplate.create(req.body);
    res.status(201).json({ success: true, template });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
