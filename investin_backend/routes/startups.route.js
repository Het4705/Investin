const express = require('express');
const {
    checkAuthentication,
    checkRoleStartup
} = require('../middlewares/auth')
const router = express.Router();
const {
    upload
} = require('../middlewares/multer');

const {
    addStartup,
    updateStartup,
    getStartupById,
    getAllStartup,
    getStartupFromAdminId
} = require("../controllers/startup.controller");

router.post("/",
        checkAuthentication,
        checkRoleStartup,
        upload.fields([{
                name: 'logo',
                maxCount: 1
            },
            {
                name: 'keyPeopleImages',
                maxCount: 10
            },
            {
                name: 'clientImages',
                maxCount: 10
            }
        ]),
        addStartup)

    .put("/:id", checkAuthentication, checkRoleStartup, upload.fields([{
            name: 'logo',
            maxCount: 1
        },
        {
            name: 'keyPeopleImages',
            maxCount: 10
        },
        {
            name: 'clientImages',
            maxCount: 10
        }
    ]), updateStartup)
    .get("/:id", getStartupById)
    .get("/", getAllStartup)
    .get('/startupOf/:admin_id',checkAuthentication,checkRoleStartup,getStartupFromAdminId);

module.exports = router;