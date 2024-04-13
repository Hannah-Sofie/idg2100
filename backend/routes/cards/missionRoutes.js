// Parts of this code is from Sebastian Haugen oblig 2
const express = require('express');
const router = express.Router();
const {getAllCards,getCard,createCard,updateCard,deleteCard} = 
require('../../controllers/cards/missionController.js'); 

// We would use , auth and authRole(["admin"]) to protect the route
// but we dont have the cookies set up yet 
router.get('/', getAllCards) 

router.get('/:cardId', getCard) 

router.post('/', createCard) 

router.put('/:cardId', updateCard)

router.delete('/:cardId', deleteCard) 

module.exports = router