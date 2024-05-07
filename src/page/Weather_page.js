import React,{ Component } from "react";
import Logo from "../images/image4.jpg";
import axios from "axios";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { BsSun } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import seaLevel from "../images/seaLevel.png"
import pressure from "../images/pressure.png"

class Weather_page extends Component {
  constructor(props) {
    super(props);
    this.inputRef=React.createRef()
    let getLocalData=JSON.parse(localStorage.getItem("data"))

    this.state = {

      humidity:"",
      cityName: "",
      countryName: "",
      groundLevel:"",
      sunRise: "",
      sunSet: "",
      temp: "",
      windDeg: "",
      windSpeed: "",
      pressure: "",
      seaLevel: "",
      visibility: "",
      status: "",
      getInputValue:"",
      cityNotFound:false,
      severError:'',
      checkData:false,
      checkGro:false,
      checkEmptyInput:false

    };

  }
   
  Variable=()=>{

    let getData=JSON.parse(localStorage.getItem("data"));
    if (getData.main.grnd_level) {
      this.setState({groundLevel:getData.main.grnd_level})
    } 
    if (getData.main.sea_level) {
      this.setState({seaLevel:getData.main.sea_level})
    } 
    if (getData.main.humidity) {
      this.setState({humidity:getData.main.humidity})
    }
    if (getData.sys.sunrise) {
      this.setState({sunRise:getData.sys.sunrise})
    }
    if (getData.sys.sunset) {
      this.setState({sunSet:getData.sys.sunset})
    }
    if (getData.main.pressure) {
      this.setState({pressure:getData.main.pressure})
    }
    if (getData.visibility) {
      this.setState({visibility:getData.visibility})
    }
    if (getData.name) {
      this.setState({countryName:getData.name})
    }
    if (getData.main.temp) {
      this.setState({temp:getData.main.temp})
    }
    if (getData.wind.deg) {
      this.setState({windDeg:getData.wind.deg})
    }
    if (getData.wind.speed) {
      this.setState({windSpeed:getData.wind.speed})
    }
    
  }

  componentDidMount = () => {
    this.getLocation();
    let getLocalData=JSON.parse(localStorage.getItem("data"))
    if (!getLocalData) {

      if (JSON.parse(localStorage.getItem("latitude")) && JSON.parse(localStorage.getItem("longitude"))) {
        
        let getLat=JSON.parse(localStorage.getItem("latitude"))
        let getLon=JSON.parse(localStorage.getItem("longitude"))

        let Url =`https://api.openweathermap.org/data/2.5/weather?lat=${getLat}&lon=${getLon}&appid=b8567364034f3d3f7a6ce9ea18c14c69`;

        axios.get(Url).then((res) => {

          console.log(res.data);
          localStorage.setItem("data", JSON.stringify(res.data));
          this.Variable()
          this.setState({status:true})

        }).catch = (err) => {
          this.setState({status:false})
        };
      } else {

        let Url ="https://api.openweathermap.org/data/2.5/weather?lat=1.2897&lon=103.8501&appid=b8567364034f3d3f7a6ce9ea18c14c69";

        axios.get(Url).then((res) => {

          console.log(res.data);
          localStorage.setItem("latitude", JSON.stringify(1.2897));
          localStorage.setItem("longitude", JSON.stringify(103.8501));
          localStorage.setItem("data", JSON.stringify(res.data));
          this.Variable()
          this.setState({status:true})

        }).catch = (err) => {


          this.setState({status:false})
        };
      }
    } else {
      
      this.setState({status:true})
      this.Variable()
      
    }
  };

  findUrl=(e)=>{

    this.setState({cityNotFound:false})
    this.setState({checkEmptyInput:false})
    this.setState({severError:false})
    this.setState({getInputValue:e.target.value})
    console.log(this.state.getInputValue)

  }
  refHandler(){
    
  }
  searchCity=async()=>{
    this.inputRef.current.focus()

    if (this.state.getInputValue =="") {

      this.setState({checkEmptyInput:true})

    }

    else{

      this.setState({checkData:true})

      try {
        if (navigator) {
          if (navigator.onLine===false){
          this.setState({severError:true})
          }
        }
        const serverResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q= ${this.state.getInputValue}&appid=b8567364034f3d3f7a6ce9ea18c14c69&units=metric`)
        const parseData = await serverResponse.json()
      
        if(parseData.cod != 404){
          window.location.reload(true);
          localStorage.setItem("data", JSON.stringify(parseData));
          localStorage.setItem("latitude", JSON.stringify(parseData.coord.lat));
          localStorage.setItem("longitude", JSON.stringify(parseData.coord.lon));
          console.log(parseData);
          this.setState({checkData:false})
          this.setState({cityNotFound:false})
          this.setState({severError:false})
          this.setState({checkEmptyInput:false})

        }
        else{
          this.setState({cityNotFound:true})
          this.setState({checkData:false})

        }

      } catch (error) {

        this.setState({checkData:false})
        this.setState({severError:true})

      }
    }
  }
  
  getLocation = () => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition((res) => {
        console.log(res.coords.latitude);
        console.log(res.coords.longitude);
        localStorage.setItem("latitude", JSON.stringify(res.coords.latitude));
        localStorage.setItem("longitude", JSON.stringify(res.coords.longitude));
        console.log(navigator);
      });
    }
    if (navigator.onLine===false){
      this.setState({severError:true})
    }
    if (navigator.onLine===true) {
      this.setState({severError:false})
    }
  };
  render() {
    return (
      <>
        
        <div className="card mb-3 col-12 container mx-auto mt-lg-0 border border-0">
          {this.state.status == false?
          <div className="row">
            <div className="col-lg-7 col-12">
            <Skeleton height={500} ></Skeleton>
            <Skeleton height={50} ></Skeleton>
            </div>
            <div className="col-lg-5 col-12">
            <Skeleton height={50} ></Skeleton>
            <Skeleton height={50} ></Skeleton>
            <Skeleton height={300} ></Skeleton>
          
            </div>
          </div>
        :
        <div className="d-lg-flex row">
          <div className="col-lg-7 col-md-12 col-12 mt-lg-0 mt-3">
            <img src={Logo} className="img-fluid w-95 h-95" alt="..." />
            {/* displaying in large screen */}
            {/* checking if  access to  latitude is given  */}
            {JSON.parse(localStorage.getItem("longitude")) == null ?
            <div className=" d-none d-lg-block ">
              <div className="d-flex justify-content-between">
                <div className="fw-bold mt-3">Current Latitude</div>
                <em cla>need your access</em>
              </div>
            </div>
            :
            <div className=" d-none d-lg-block ">
              <div className="d-flex justify-content-between">
                <div className="fw-bold mt-3">Latitude</div>
                <h1>{JSON.parse(localStorage.getItem("latitude"))}</h1>
              </div>
            </div>
            }

          </div>

          {/* checking if  access to  longitude is given  */}
          <div className="col-lg-5 col-md-12 col-12">
            <div className="card-body">
              {JSON.parse(localStorage.getItem("longitude")) == null ?
                <div className="d-flex justify-content-between">
                <div className="fw-bold mt-1">Longtitude</div>
                <em className="mt-1"> need your access</em>
              </div>
              :
              <div className="d-flex justify-content-between">
                <div className="fw-bold mt-1">Longtitude</div>
                <h1>{JSON.parse(localStorage.getItem("longitude"))}</h1>
              </div>
              }
              
              {/* displaying in small screen */}
              {/* checking if  access to  latitude is given  */}
              {JSON.parse(localStorage.getItem("longitude")) == null ?
              <div className="d-flex justify-content-between d-lg-none">
              <div className="fw-bold mt-1">Latitude</div>
              <em className="mt-1">need your access</em>
            </div>
              :
              <div className="d-flex justify-content-between d-lg-none">
                <div className="fw-bold mt-1">Latitude</div>
                <h1>{JSON.parse(localStorage.getItem("latitude"))}</h1>
              </div>
              }

              {/* {this.state.status == true && <div className="alert alert-danger alert-sm">Check your internet connection</div>} */}
              {this.state.cityNotFound== true && <div className="alert alert-danger alert-sm fw-bold mt-lg-0 mb-lg-0 mb-3 mt-3">City Not Found</div>}
              {this.state.severError== true &&  this.state.cityNotFound== false && this.state.checkEmptyInput == false && <div className="alert alert-danger alert-sm fw-bold">Internet connection error</div>}
              {this.state.checkEmptyInput == true && this.state.cityNotFound== false  && <div className="alert alert-danger alert-sm fw-bold mt-lg-0 mb-lg-0 mb-3 mt-3">Enter the city of your choice</div>}
              
              
              {/* <form action="/index.html" method="get"> */}
                <div className="mb-3 mt-lg-0 mt-3">
                  <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" 
                  ref={this.inputRef}
                  onChange={this.findUrl}/>
                  <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.searchCity}>

                  
                    {this.state.checkData == true ?
                    <div className="spinner-border text-danger" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                    :"Search"}</button>
                  
                </div>
                </div>
              {/* </form> */}
              {!this.state.countryName && !this.state.groundLevel && !this.state.temp ?
              <div></div>
              :
              <div
                className="card text-dark bg-light mb-3 col-12"
                style={{ maxWidth: "28rem", minHeight: "12rem" }}
              >
                {this.state.countryName && 
                <h1 className="ms-2">{this.state.countryName}</h1>
                }
                <div className="card-body">
                  {this.state.groundLevel && <p className="card-text fw-bold">Ground Level: {this.state.groundLevel} </p>}
                  {this.state.temp && 
                  <p className="card-text fw-bold">Temperature :{this.state.temp}</p>
                  }
                </div>
              </div>

            }
            </div>
            

          </div>
            <hr className="bg-danger p-1" />
            <section className="row justify-content-evenly">
              {this.state.humidity && 
                <div
                  className="card text-dark bg-light col-lg-4 mb-3 col-md-6 col-12 ms-lg-0 ms-4"
                  style={{ maxWidth: "18rem", maxHeight: "12rem" }}
                >
                  <h1>Humidity</h1>
                  <div className="card-body">
                    <h4 className="card-title fw-bold text-end">{this.state.humidity}</h4>
                    <WiHumidity size={40} />
                  </div>
                </div>
              }
            {!this.state.sunRise && !this.state.sunSet ?
            <div></div>
            :
              <div
                className="card text-dark bg-light mb-3 col-lg-4 col-md-6 col-12 ms-lg-0 ms-4"
                style={{ maxWidth: "18rem", minHeight: "12rem" }}
              >
                <div className="d-flex justify-content-between">
                  <h1>Sun</h1>
                  <BsSun size={40} />
                </div>
                <div className="card-body">
                  <h4 className="card-title fw-bold text-end">
                    {/* {this.state.countryName} */}
                  </h4>
                  {this.state.sunRise && <p className="card-text fw-bold">Sunrise : {this.state.sunRise} </p>}
                  {this.state.sunSet && <p className="card-text fw-bold">Sunset : {this.state.sunSet}</p>}
                </div>
              </div>
            }
            {!this.state.windDeg && !this.state.windSpeed?
            <div></div>
            :
          <div
            className="card text-dark bg-light mb-3 col-lg-4 col-md-6 col-12 ms-lg-0 ms-4"
            style={{ maxWidth: "18rem", minHeight: "12rem" }}>
            <div className="d-flex justify-content-between">
              <h1>Wind</h1>
              <FaWind size={40} />
            </div>
            <div className="card-body">
              <h4 className="card-title fw-bold text-end">
              </h4>
              {this.state.windDeg && <p className="card-text fw-bold">Wind degree :{this.state.windDeg} </p>}
              {this.state.windSpeed && <p className="card-text fw-bold">Wind speed :{this.state.windSpeed}</p>}
            </div>
          </div>

            }
            {this.state.pressure && 
              <div
                className="card text-dark bg-light mb-3 col-lg-4 col-md-6 col-12 ms-lg-0 ms-4"
                style={{ maxWidth: "18rem", minHeight: "12rem" }}
              >
                <h1>Pressure</h1>
                <div className="card-body">
                  <h4 className="card-title fw-bold text-end">
                    {this.state.pressure}
                  </h4>
                  <img src={pressure} alt="" className="w-25"/>

                </div>
              </div>
            }

          {this.state.seaLevel && 
            <div className="card text-dark bg-light mb-3 col-lg-4 col-md-6 col-12 ms-lg-0 ms-4"
              style={{ maxWidth: "18rem", minHeight: "12rem" }}>
              <h1>Sea Level</h1>
              <div className="card-body">
                <h4 className="card-title fw-bold text-end">
                  {this.state.seaLevel}
                </h4>
                <img src={seaLevel} alt="" style={{maxWidth:"2rem"}}/>
              </div>
            </div>
          }

         
          {this.state.visibility &&
            <div
              className="card text-dark bg-light mb-3 col-lg-4 col-md-6 col-12 ms-lg-0 ms-4"
              style={{ maxWidth: "18rem", minHeight: "12rem" }}
            >
              <h1>Visibility</h1>
              <div className="card-body">
                <h4 className="card-title fw-bold text-end">
                  {this.state.visibility}
                </h4>
                <MdVisibility size={40} />
              </div>
            </div>
          }
        </section>
        </div>
      } 
      </div>

      
    </>
    );
  }
}

export default Weather_page;
