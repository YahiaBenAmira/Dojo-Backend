const router = require("express").Router();

const {InvitationToCompany, createCompany, getAllUsers} = require('../controllers/company')

router.post('/create-company',createCompany);
router.post('/invitation/:company_id',InvitationToCompany);
router.get('/get-all/:company_id',getAllUsers)
module.exports = router;
