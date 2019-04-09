var express = require("express");
var router = express.Router();
const passport = require("../auth/local");
const { loginRequired } = require("../auth/helpers");
const {
getAllUsers,
getAllVendors,
getAllClients,
updateUser,
deleteUser,
getSingleUser,
logoutUser,
loginUser,
isLoggedIn
} = require("../db/queries/usersQueries.js");


router.post("/login", passport.authenticate("local", {}), loginUser);
router.post("/isLoggedIn", isLoggedIn);
router.post("/logout", loginRequired, logoutUser);


router.get('/', getAllUsers)
router.get('/vendors', getAllVendors)
router.get('/clients', getAllClients)
router.get('/:id', getSingleUser)
router.post('/new', createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)


module.exports = router
