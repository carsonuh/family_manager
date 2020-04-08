import React, { Component } from 'react'
import { GoogleMap, LoadScript, DirectionsService, InfoBox } from '@react-google-maps/api'
import { DirectionsRenderer } from '@react-google-maps/api';
import { DistanceMatrixService } from '@react-google-maps/api';
import { timePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';

class GMap extends Component {

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
      drawn: 0
    }
    this.directionsCallback = this.directionsCallback.bind(this)
    this.getOrigin = this.getOrigin.bind(this)
    this.getDestination = this.getDestination.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
    this.matrix = this.matrix.bind(this)
    this.centerChanged = this.centerChanged.bind(this);
  }

  componentDidMount() {
    this.setState({response: null, travelMode: 'DRIVING', map: null, drawn: 0, commuteFlag: 0, submitted: false})
  }

  directionsCallback(response) {
    if (response !== null) {
      if (response.status === 'OK') {
        this.setState(
          () => ({
            response
          })
        )
      } else {
        setTimeout(() => { }, 2000)
      }
    }
  }

  matrix(callback) {
    if(this.state.commuteFlag == 0) {
      console.log(callback.rows[0].elements[0].duration.text)
      this.setState({commuteTime: callback.rows[0].elements[0].duration.text});
      this.setState({commuteFlag: 1});
      this.setState({drawn: 0})
    }
  }

  onTest = () => {
    if (this.state.map && this.state.drawn == 0) {
      const lat = this.state.map.getCenter().lat();
      const lng = this.state.map.getCenter().lng();
      this.setState({center: {lat: lat, lng: lng}})
      this.setState({drawn: 1})
    }
  }

  centerChanged(ref) {
    this.setState({map: ref})
  }

  getOrigin(ref) {
    this.setState({ origin: ref.target.value })
    this.setState({ submitted: false })
  }

  getDestination(ref) {
    this.setState({ destination: ref.target.value })
    this.setState({ submitted: false })
  }

  onClick() {
    if (this.state.origin !== '' && this.state.destination !== '') {
          this.setState({ submitted: true });
    }
  }

  onMapClick(...args) {
  }


  render() {
    return (
      <div>
        <LoadScript
          id="script-loader"
          googleMapsApiKey=""
        >
          <GoogleMap
            id='example-map'
            mapContainerStyle={{
              height: '300px',
              width: '100%'
            }}
            zoom={2}
            // center={this.state.center}
            options={{
              disableDefaultUI: true
            }}
            onLoad={map=> this.centerChanged(map)}
            onCenterChanged={this.onTest}
          >

            {
              (
                this.state.destination !== '' &&
                this.state.origin !== ''
              ) && (
                <DirectionsService
                  // required
                  options={{
                    destination: this.state.destination[0],
                    origin: this.state.origin[0],
                    travelMode: this.state.travelMode
                  }}
                  // required
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
                  // required
                  options={{
                    destinations: this.state.destination,
                    origins: this.state.origin,
                    travelMode: this.state.travelMode
                  }}
                  // required
                  callback={this.matrix}
                />
              )
            }

            {
              (
                this.state.commuteFlag !== 0 &&
                this.state.commuteTime !== null
              ) && (
                <InfoBox
                options={{closeBoxURL: '', enableEventPropagation: true}}
                position={this.state.center}
              >

                <div style={{ backgroundColor: 'yellow', opacity: 0.75, padding: 12 }}>
                  <div style={{ fontSize: 16, fontColor: `#08233B` }}>
                    {this.state.commuteTime}
                  </div>
                </div>
              </InfoBox>
           
              )
            }

            {
              this.state.response !== null && (
                <DirectionsRenderer
                  // required
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