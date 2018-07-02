import React from 'react';

class MapComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'Loading...',
      coordinates: [0, 0],
    };
  }
  componentDidMount() {
  
    this.map = null;
	this.nearest = 0;
	
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then((json) => {
        const { properties, geometry } = json;
        this.setState({
          name: properties.name,
          coordinates: geometry.coordinates,
        });
		
		
		if(this.state.coordinates.length > 0 && this.map != null)
		{
			this.map.setView(new L.LatLng(this.state.coordinates[1],this.state.coordinates[0]), 9);
			let gas_marker = L.marker([this.state.coordinates[1],this.state.coordinates[0]]).addTo(this.map);
		}
		
	
    });
	
	this.map = new L.Map('mapid');
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution,
    });
    this.map.setView(new L.LatLng(52.51, 13.40), 9);
    this.map.addLayer(osm);
	var that = this;
	this.map.on("click",function(e)
    {
		let latlng = e.latlng;
		let url = 'http://localhost:3000?lat='+latlng.lat+"&lng="+latlng.lng;
		
		fetch(url)
        .then(response => response.json())
        .then((json) => {
           that.nearest = json.nearest;
		   that.forceUpdate();
        });
					 
    });
	
    
  }
  render() {
    return (
        <div>
          Name: {this.state.name}<br />
          {this.state.coordinates[1]} {this.state.coordinates[0]}<br />
		  Nearest gas Station Distance: <span id="red_color">{this.nearest} Meter</span>
          <div id="mapid"></div>
        </div>);
  }
};

export default MapComponent;
