import React from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from '../components/Layout/Layout';

// import Layout from "../components/Layout/Layout";
// import {db} from "../firebase.config";
// import { collection, getDocs, getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { useEffect } from 'react';

const ReactCalender = () => {
// const bookingRef = collection(db, "bookings");
// const date1 = new Date('March 19, 2023 23:15:30');
// const date2 = new Date('March 10, 2023 23:15:30');
// const date1=disableDates.getDate();

 const [value, onChange] = useState(new Date());

const tileDisabled = ({date}) => {
   return   date > new Date(2023, 3, 10) && date < new Date(2023, 3, 19)
}
  return (
   <Layout>
      <div className="row listing-container">
      <center>
        <div>
        <Calendar value={value} tileDisabled={tileDisabled} selectRange minDate={new Date()} onChange={onChange}  />
        {value.length > 0 ? (
         <p className='text-center'>
           <span className='bold'>Start:</span>{' '}
           {value[0].toDateString()}
          &nbsp;|&nbsp;
          <span className='bold'>End:</span> {value[1].toDateString()}
         </p>
          ) : (
         <p className='text-center'>
           <span className='bold'>Default selected date:</span>{' '}
           {value.toDateString()}
         </p>
          )
        }
     </div>
     </center>
     </div>

   </Layout>

     
  );
};

export default ReactCalender;
