import React, { Component } from 'react'
import { GoogleMap, LoadScript, DirectionsService } from '@react-google-maps/api'
import { DirectionsRenderer } from '@react-google-maps/api';
import { DistanceMatrixService } from '@react-google-maps/api';

/**
 * Renders the google map component and directions between the 
 * users start zipcode and end zipcode
 * Imports:
 * -Google Map: The actual google map and the wrapper over the maps api
 * -Directions render: Renders directions on the map
 * -DistanceMatrixServer: Gets commute time and distance to an event
 * -Directions Service: Gets the directions to an event
 */
class GMap extends Component {

	//The props passed in are the users start zip and end zip
	constructor(props) {
    	super(props);

    this.state = {
    	response: null,
      	travelMode: 'DRIVING',
      	origin: [props.startZip],
      	destination: [props.endZip],
      	submitted: false,
      	center: {
        lat: 0,
        lng: -180
      },
    	commuteTime: "",
      	commuteFlag: 0,
      	map: null,
      	drawn: 0,
      	setTime: props.setTime
    };

    this.directionsCallback = this.directionsCallback.bind(this)
    this.getOrigin = this.getOrigin.bind(this)
    this.getDestination = this.getDestination.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
    this.matrix = this.matrix.bind(this)
    this.centerChanged = this.centerChanged.bind(this);
  }

  /**
   * Callback executed when the google maps api returns the
   * directions to take to an event, we update the state
   * with this data so it can be rendered on the map
   * @param {Directions object from google maps} response 
   */
  directionsCallback(response) {
	if (response !== null) {
    	if (response.status === 'OK') {
        	this.setState(
          	() => ({
            	response
          	})
        	)
      	} else {
      
      	}
    }
  }

  /**
   * Callback executed when the distance matrix service returns the commute time
   * to an event
   * @param {data object from distance matric service} data 
   */
  matrix(data) {

	//If the location was not found do nothing, exit the method
    if (data.rows[0].elements[0].status === "NOT_FOUND") {
    	return;
    }

	//If the data was found and it hasn't already been queried update the state with
	//the data received
    if (this.state.commuteFlag === 0) {
    	this.setState({ commuteTime: data.rows[0].elements[0].duration.text });
    	this.setState({ commuteFlag: 1 });
      	this.state.setTime(data.rows[0].elements[0].duration.text)
    }
  }

  /**
   * Method executed when the user changes position on the map
   */
  updateCenter = () => {
	//If the map is rendered, get the new center and update state with it
	if (this.state.map && this.state.drawn === 0) {
    	const lat = this.state.map.getCenter().lat();
      	const lng = this.state.map.getCenter().lng();
      	this.setState({ center: { lat: lat, lng: lng } });
      	this.setState({ drawn: 1 });
    }
  }

  /**
   * Called on initial map load, updates the components state with the map reference
   * @param {reference to the map} ref 
   */
  centerChanged(ref) {
	this.setState({ map: ref })
  }

  /**
   * Updates state the origin refernce from the map, this is where the user started
   * @param {origin reference} ref 
   */
  getOrigin(ref) {
    this.setState({ origin: ref.target.value })
    this.setState({ submitted: false })
  }

  /**
   * Updates state with the destination reference from the map, this is where the user wants to go
   * @param {destination reference} ref 
   */
  getDestination(ref) {
    this.setState({ destination: ref.target.value })
    this.setState({ submitted: false })
  }

  /**
   * Executed when the user clicks on the map
   */
  onClick() {
    if (this.state.origin !== '' && this.state.destination !== '') {
      this.setState({ submitted: true });
    }
  }

  onMapClick(...args) {  }


  render() {
    return (
      <div>
        <LoadScript
          id="script-loader"
          googleMapsApiKey="AIzaSyD4Ub-e46ZN-fsHsomSd5S5QxepyCW2V-Q"
        >
          <GoogleMap
            id='example-map'
            mapContainerStyle={{
              height: '300px',
              width: '100%'
            }}
            zoom={2}
            options={{
              disableDefaultUI: true
            }}
            onLoad={map => this.centerChanged(map)}
            onCenterChanged={this.updateCenter}
          >

            {
              (
                this.state.destination !== '' &&
                this.state.origin !== ''
              ) && (
                <DirectionsService
                  options={{
                    destination: this.state.destination[0],
                    origin: this.state.origin[0],
                    travelMode: this.state.travelMode
                  }}
                  callback={this.directionsCallback}
                />
              )
            }

            {
              (
                this.state.destination !== '' &&
                this.state.origin !== ''
              ) && (
                <DistanceMatrixService
                  options={{
                    destinations: this.state.destination,
                    origins: this.state.origin,
                    travelMode: this.state.travelMode
                  }}
                  callback={this.matrix}
                />
              )
            }
            {
              this.state.response !== null && (
                <DirectionsRenderer
                  options={{
                    directions: this.state.response
                  }}
                />
              )
            }
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default GMap;