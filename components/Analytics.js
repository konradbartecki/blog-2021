import React, { Component } from 'react'

export default class Analytics extends Component {
  componentDidMount() {
    if (
      !sessionStorage.getItem('_swa') &&
      document.referrer.indexOf(location.protocol + '//' + location.host) !== 0
    ) {
      fetch(
        'https://counter.dev/track?' +
          new URLSearchParams({
            referrer: document.referrer,
            screen: screen.width + 'x' + screen.height,
            user: 'konradbartecki',
            utcoffset: '1',
          })
      )
    }
    sessionStorage.setItem('_swa', '1')
  }

  render() {
    return null
    // return <script id="counterdev"></script>
  }
}
