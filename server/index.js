const express = require('express')
const app = express()

const fuelStations = require('./fuelstations.json').features;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var getDistance = function(lat1, lng1, lat2, lng2)
{
    var R = 6371; 
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
var toRad = function(Value)
{
    return Value * Math.PI / 180;
}


app.get('/', (req, res) => {
  // TODO implement first server.
  if(req.query.lat && req.query.lng)
  {
     console.log('nearest',req.query.lat,req.query.lng);
	 var distances = [];
	 var station_coordinates = null;
	 var distance_between_point = 0;
	 for(var i=0;i<fuelStations.length;i++)
	 {
	    station_coordinates = fuelStations[i].geometry.coordinates;
	    distance_between_point = getDistance(req.query.lat,req.query.lng,station_coordinates[1],station_coordinates[0]);
		distances.push(distance_between_point * 1000);
	 }
	 distances.sort(); 
	 console.log('nearest point ',distances[0]);
	 res.send({nearest:distances[0]});
  }
  else
  {
    console.log('sending');
    res.send(fuelStations[0])
  }
  
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
