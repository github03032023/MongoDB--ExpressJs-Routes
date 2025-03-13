const router = require('express').Router();
const {
    addState,
    getStatePopulation,
    getTotalPopulation,
    getAveragePopulationDensity,
    getAllStates
} = require('./controllers/stateController');

const { 
    addDistrict,
    updateDistrictPopulation,
    deleteDistrictData,
    groupAndSortDistrictsByState,
    getDistrictsWithStates,
    getAllDistricts
} = require('./controllers/districtController');

const authMiddleware = require('./middlewares/authMiddleware');

// State Routes
router.post('/addState', authMiddleware, addState);

router.get('/states/:name/population',authMiddleware,  getStatePopulation);

router.get('/states/total-population', authMiddleware, getTotalPopulation);


router.get('/states/average-density', authMiddleware, getAveragePopulationDensity);

router.get('/states', authMiddleware, getAllStates);



// District Routes
router.post('/addDistrict', authMiddleware, addDistrict);

router.put('/districts/:name/population', authMiddleware, updateDistrictPopulation);

router.delete('/districts/:name', authMiddleware, deleteDistrictData);

router.get('/districts/group-by-state', authMiddleware, groupAndSortDistrictsByState);

router.get('/districts/with-states', authMiddleware, getDistrictsWithStates);

router.get('/districts', authMiddleware,  getAllDistricts);


module.exports = router;