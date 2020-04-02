import React, { Component } from 'react'
import { GoogleMap, LoadScript, DirectionsService } from '@react-google-maps/api'
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
      submitted: false
    }
    this.directionsCallback = this.directionsCallback.bind(this)
    this.getOrigin = this.getOrigin.bind(this)
    this.getDestination = this.getDestination.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
  }

  directionsCallback(response) {
    if (response !== null) {
      console.log(response.code)
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
    console.log(callback)
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
      // this.setState(
      //     () => ({
      //         origin: this.origin.value,
      //         destination: this.destination.value
      //     })
      // )
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
            center={{
              lat: 0,
              lng: -180
            }}
            options={{
              disableDefaultUI: true
            }}
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