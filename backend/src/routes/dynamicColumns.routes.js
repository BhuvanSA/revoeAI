import express from 'express';
import {
    getDynamicColumns,
    addDynamicColumn,
    getDynamicColumnData,
    saveDynamicColumnData,
    debugDynamicColumns
} from '../controllers/dynamicColumns.controller.js';

const router = express.Router();

router.get("/:sheetId", getDynamicColumns);
router.post("/:sheetId", addDynamicColumn);
router.get("/:sheetId/data", getDynamicColumnData);
router.post("/:sheetId/data", saveDynamicColumnData);
router.get("/:sheetId/debug", debugDynamicColumns);

export default router;