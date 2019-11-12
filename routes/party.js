const express = require('express');

const router = express.Router();
let fetch = require('node-fetch')
const User = require('../models/user');
const Point = require('../models/mappoints')
const Party = require('../models/party');
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

    if (e === req.session.user.userName) {
      guestChecker.push(e)
    }
  });
  console.log(guestChecker[0]);

  if (guestChecker[0] !== '') {
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

  const resp = await fetch(encodeURI(`https://geocode-maps.yandex.ru/1.x/?apikey=f82c443d-9424-4634-8393-c3707368bee7&format=json&geocode=${req.body.city}+${req.body.street}+${req.body.num}`));
  let json = await resp.json();
  const coord = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos

  const a = coord.split(' ').reverse()
  console.log(a);


  const point = await Point.findOne({})
  console.log(point);
  point.event_id.push(party.id)
  point.location.push(a)
  point.host.push(req.session.user)

  await point.save()

  res.redirect('/')
});

router.get('/points', async (req, res) => {
  const points = await Point.findOne({});
  res.json(points)
})



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
  const point = await Point.findOne();
  let index = Number;
  for (let i = 0; i < point.event_id.length; i += 1) {
    if (point.event_id[i] == req.params.id) {
      index = i
    }
  }
  point.event_id.splice(index, 1);
  point.location.splice(index,1);
  point.host.splice(index,1);

  await point.save()
  

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