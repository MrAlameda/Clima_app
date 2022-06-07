import axios from "axios"
import { useEffect, useState} from "react"

const BoxClima=()=>{

    const [city, setCity] = useState({
        "weather": [
          {
            "id": 800,
            "main": "",
            "description": "clear",
            "icon": "01d"
          }
        ],
        "base": "stations",
        "main": {
          "temp": 0,
          "feels_like": 281.86,
          "temp_min": 0,
          "temp_max": 0,
          "pressure": 1023,
          "humidity": 100
        },
      "sys": {
          "country": "US"
        },
        "timezone": -25200,
        "id": 420006353,
        "name": "Mountain View",
        
        } )

    const [userUbication, setUserUbication]=useState(
        {
          "weather": [
            {
              "id": 800,
              "main": "",
              "description": "",
              "icon": "01d"
            }
          ],
          "base": "stations",
          "main": {
            "temp": 0,
            "feels_like": 281.86,
            "temp_min": 0,
            "temp_max": 0,
            "pressure": 1023,
            "humidity": 100
          },
        "sys": {
            "country": "US"
          },
          "timezone": -25200,
          "id": 420006353,
          "name": "Mountain View",
          
          }                  
        )

    const [here, setHere] = useState("Search any city")

    const [cityExist, setCityExist] = useState(false)

    const [active, setActive] = useState(false)

    const [search, setSearch] = useState({
        lon:0,
        lat:0
    })

    const [temp, setTemp] =useState({
        tempMin:0,
        tempMax:0,
        type:"F"
    })

    const [text, setText] = useState("")

    const handleSubmit=(e)=>{
        e.preventDefault()
    }

    function success(pos) {
        let crd = pos.coords;
    
        const lat=crd.latitude;
        const lon=crd.longitude;
        
        return(
            geoLocation(lat,lon),
            setActive(true),
            setSearch({
                lon:lon,
                lat:lat
            })
        )
    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        setActive(false)
    };

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(success, error,options);
    },[])

    const cityGeoLocation=(a)=>{
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${a}&appid=93ad85c660dbccd5a0e37e8846eb804c`)
            .then(res=>{
                console.log(res.data)
                setCity(res.data)
                setCityExist(true)
                setTemp({
                    ...temp,
                    tempMax:parseInt(res?.data.main.temp_max),
                    tempMin:parseInt(res?.data.main.temp_min),
                    type:"-F"
                })
            })
            .catch(err=>{
                console.log(err)
                setCityExist()
                setHere("city not found")
            })
    }

    const geoLocation=(lat, lon)=>{
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=93ad85c660dbccd5a0e37e8846eb804c`)
            .then(res=>{
                console.log(res.data)
                let info=res.data
                setUserUbication(info)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    const cTok=(a,b)=>{
        let i=a+273;
        let j=b+273;

        setTemp({
            tempMax:i,
            tempMin:j,
            type:"F"
        })
    }
    const kToc=(a,b)=>{
        let i=a-273
        let j=b-273
        setTemp({
            tempMax:i,
            tempMin:j,
            type:"C"
        })
    }

        return(
        <section
            className={`box ${city?.weather[0].description}`}
        >
            <div>
            <div>
                {
                    active?
                        <div className="userCard">
                            <p>{userUbication?.sys.country}</p>
                            <p>{userUbication?.name}</p>
                            <p>{userUbication?.weather[0].description}</p>
                            <div>
                                <img src={`https://openweathermap.org/img/wn/${userUbication?.weather[0].icon}@2x.png`} alt="icon"/>
                            </div>
                            <p>{parseInt(userUbication?.main.temp_min)} K o {parseInt(userUbication?.main.temp_min)- 273} C</p>
                            <p>{parseInt(userUbication?.main.temp_max)} K o {parseInt(userUbication?.main.temp_max)- 273} C</p>
                        </div>
                    :
                        <div className="userCard notFound">
                            <h1>Location Not Found</h1>
                        </div>
                    }
            </div>
            <div>
                {
                    cityExist?
                        <div className="cityCard">
                            <p>{city?.sys?.country}</p>
                            <p>{city?.name}</p>
                            <p>{city?.weather[0].description}</p>
                            <div>
                                <img src={`https://openweathermap.org/img/wn/${city?.weather[0].icon}@2x.png`} alt="icon"/>
                            </div>
                            <div>
                                Temp.Max:{temp.tempMax} {temp.type}<br/>
                                Temp.Min:{temp.tempMin} {temp.type}
                            </div>
                            <button onClick={()=>{
                                (temp.tempMin<273.1)?cTok(temp.tempMax,temp.tempMin):kToc(temp.tempMax,temp.tempMin)
                            }}>Change</button>
                        </div>
                    :
                        <div className="cityCard notFound">
                            {here}
                        </div>

                }
            </div>
            <div className="searchSection">
                <form onSubmit={handleSubmit}>
                <input
                    value={text}
                    placeholder="City"
                    onChange={e=>setText(e.target.value)}
                />
                </form>
                <button onClick={()=>{
                    console.log("hola")
                    cityGeoLocation(text)
                }}>Search</button>
            </div>
            </div>
        </section>
    )
}

export { BoxClima }