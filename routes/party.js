const express = require('express');

const router = express.Router();
const handlebars = require('express-handlebars');
const path = require('path');
const User = require('../models/user');
const Party = require('../models/party');
const { sessionChecker } = require('../middleware/auth');
/* GET home page. */

router.get('/new', async (req, res) => {
  res.render('newpartyform', { user: req.session.user });
});

router.post('/join/:id', async (req, res) => {
  const party = await Party.findById(req.params.id);
  let guestChecker = [];
  console.log(party.guests);
  
  party.guests.forEach((e) => {
    console.log(e);
    
    if(e === req.session.user.userName){
      guestChecker.push(e)
    }
  });
  console.log(guestChecker[0]);
  
  if(guestChecker[0] !== ''){
    res.redirect('/')
  }

  party.guests.push(req.session.user.userName);
  await party.save()
  res.redirect('/')
})

router.post('/new', async (req, res) => {
  const party = new Party({
    location: req.body.location,
    host: req.session.user,
    details: req.body.details,
    date: req.body.date,
  });
  await party.save();
  res.redirect('/')
});

router.get('/update/:id', async (req, res) => {
  const party = await Party.findById(req.params.id);
  console.log(party.host._id);
  console.log(req.session.user._id);
  
  
  if (party.host._id === req.session.user._id) {
    res.render('editpatyform', { party: party, user: req.session.user })
  } else {
    res.redirect('/')
  }
})

router.post('/update/:id', async (req, res) => {
  console.log(req.body.details);
  const party = await Party.findByIdAndUpdate(req.params.id, {
    location: req.body.location,
    details: req.body.details,
    date: req.body.date,
  });
  console.log(party);
  res.redirect('/')

});


router.delete('/delete/:id', async (req, res, next) => {
  const party = await Party.findById(req.params.id);
  console.log(party.host._id);
  console.log(req.session.user._id);  
  if (party.host._id === req.session.user._id) {
    await Party.deleteOne({ id: req.params.partyID });
    const parties = await Party.find();
    res.send(parties)
  } else {
    const parties = await Party.find();
    res.send(parties)
  }
});



module.exports = router;