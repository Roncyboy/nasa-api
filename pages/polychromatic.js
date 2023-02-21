import axios from 'axios'
import { handleSmoothScroll } from 'next/dist/shared/lib/router/router'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Polychromatic() {

    const [image, setImage] = useState([])
    const [images, setImages] = useState([])
    const [time, setTime] = useState('loading')
    const [date, setDate] = useState('')
    const [coords, setCoords] = useState({})

  const apiKey = process.env.API_KEY
  const url = `https://epic.gsfc.nasa.gov/api/natural?api_key=${apiKey}`

    const getPolychromaticData = async () => {
        const res = await axios.get(url)
        const data = res.data
        console.log(data)

        const caption = data[0].caption;
        const date = data[0].date.split(' ')[0];
        const date_formatted = date.replaceAll("-","/");

        let times = [];
        let images = [];

        for(let i = 0; i < data.length; i++) {
            let time = data[i].date.split(' ')[1];
            let coords = data[i].centroid_coordinates;
            let imageGrabbed = data[i].image;
            let image = `https://epic.gsfc.nasa.gov/archive/natural/${date_formatted}/png/${imageGrabbed}.png`;

            times.push(time);
            images.push({
                image: image,
                time: time,
                coords: coords
            });
        }

        setDate(date);
        setImages(images);

        setImage(images[0].image);
        setTime(times[0]);
        setCoords([images[0].coords.lat, images[0].coords.lon])

        console.log(image);
    }

    useEffect(() => {
        getPolychromaticData()
    }, [])


  return (
    <div className='polydiv'>
      <h1>Polychromatic</h1>
        <Link className='HomeButton' href={"/"}>Home</Link>
      <div className='polyMain'>
        <Image src={image} alt={image} width={300} height={300} />
        <div className='polyMainInfo'>
        <p>Time: {time}</p>
        <p>Date: {date}</p>
        <p>Latitude: {coords[0]}, Longitute: {coords[1]}</p>
        </div>
    </div>
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Latitude</th>
                    <th>Longitute</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {images.map((e, i) => {
                    return (
                        <tr key={i}>
                            <td>{e.time}</td>
                            <td>{e.coords.lat}</td>
                            <td>{e.coords.lon}</td>
                            <td><Image src={e.image} alt={e.image} width={100} height={100} /></td>
                            <td>
                                <button onClick={() => {
                                    setImage(e.image);
                                    setTime(e.time);
                                    setCoords([e.coords.lat, e.coords.lon])
                                    console.log(images[i].image)
                                    document.body.scrollIntoView({behavior: 'smooth'})
                                }}>View</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}