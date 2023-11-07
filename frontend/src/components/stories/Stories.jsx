import React from 'react'
import "./stories.css"
let data = [
  {
    id: 1,
    name: "nikita_rawat147",
    img: ""
  },
  {
    id: 2,
    name: "shivamranakoti",
    img: ""
  },
  {
    id: 3,
    name: "rashmirana123",
    img: ""
  },
  {
    id: 4,
    name: "mahimapandey",
    img: ""
  },
  {
    id: 5,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 6,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 7,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 8,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 9,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 10,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 11,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 12,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 13,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 14,
    name: "jyotikalura",
    img: ""
  },
  {
    id: 15,
    name: "jyotikalura",
    img: ""
  },

]
const Stories = () => {
  return (
    <div className='storiesSection'>


      <div className='story'>
        <div className='storyImgNotSeen'>
          <img className='storyProfile' src="/images/nikki.jpg" />
        </div>
        <span className='storyHolderNameNotSeen'>{"shivamranakoti".substring(0, 9)}...</span>
      </div>
      {data.map(item => (
        <div className='story' key={item.id}>
          <div className='storyImgSeen'>
            <img className='storyHolderProfile' src="/images/nikki.jpg" />
          </div>
          <span className='storyHolderName'>{item.name.substring(0, 9)}...</span>
        </div>

      ))}


      <div className='arrowIcon'> <img src="/images/chevron-right.svg" /> </div>


    </div>

  )
}

export default Stories