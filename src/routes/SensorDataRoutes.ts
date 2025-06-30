import express from "express";
import {createRecord,getLastRecord,getAllRecords,getLastFew} from "../controllers/SensorDataController";

const router = express.Router();

router.post('/',createRecord);
router.get('/all',getAllRecords);
router.get('/few',getLastFew);
router.get('/latest',getLastRecord);

export default router;
