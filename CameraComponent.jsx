class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWebCamAvailable: false,
      videoConstraint: {facingMode: "user"},
      isFront: true,
      videoRef: null,
    };
    this.setVideoRef = this.setVideoRef.bind(this);
    this.changeCamera = this.changeCamera.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    // Checking for device information
    this.detectWebcam();
  }

  detectWebcam() {
    let isWebCamAvailable = false;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices){
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const dev = devices.some(device => 'videoinput' === device.kind);
        if (dev) {
          isWebCamAvailable = true;
        }
        this.setState({isWebCamAvailable: isWebCamAvailable});
      });
    }
  }

  changeCamera() {
    console.log("CHANGE CAMERA");
    if (!this.state.isFront) {
      this.setState({
        videoConstraint: {facingMode: "user"},
        isFront: true,
      });
    } else {
      this.setState({
        videoConstraint: { facingMode: { exact: "environment" } } ,
        isFront: false,
      });
    }
  }

  renderVideo() {
    console.log("videoRef", this.state.videoRef);
    const videoRef = this.state.videoRef;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoRef) {
      navigator.mediaDevices.getUserMedia({ video: this.state.videoConstraint, audio:false })
        .then(function(stream) {
          videoRef.srcObject = stream;
          videoRef.play();
        })
        .catch((error) => console.error("Error>>>", error));
    } else {
      console.error("No navigator object found");
      return (<div>No navigator object found</div>);
    }
  }

  setVideoRef(element) {
    console.log("set video ref");
    console.log("setVideoRef", element);
    if (!this.state.videoRef) {
      this.setState({
        videoRef: element,
      });
    }
  };

  render() {
    console.log("RENDER", this.state);
    let title = '';
    let isMobile = false;
    if (!this.state.isWebCamAvailable) {
      return (<div>No web cam available</div>);
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
    }
    let videoRef = null;

    return (
      <div>
        <h1>{isMobile ? 'Mobile' : 'Desktop'}</h1>
        <video ref={this.setVideoRef} width="640" height="480"autoPlay></video>
        { isMobile ? (<button onClick={this.changeCamera}>{this.state.isFront ? 'Back' : 'Front'}</button>) : null }
        {this.renderVideo(videoRef)}
        <button onClick={this.changeCamera}>{this.state.isFront ? 'Back' : 'Front'}</button>
      </div>
    );
  }
}
ReactDOM.render(<Camera/>, document.getElementById("root"));
