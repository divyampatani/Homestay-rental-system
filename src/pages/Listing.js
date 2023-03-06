import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { getDoc, doc, query, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { useNavigate, Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import SwipeCore, { EffectCoverflow, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "../styles/listing.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
import {

  FaBed,
  FaBath,
  FaParking,
  FaHouseDamage,
  FaArrowCircleRight,
} from "react-icons/fa";


//config
import MetaMask from "../MetaMask";
// import {useState} from "react";
import CreateListing from './CreateListing';

const createlisting = require("./CreateListing");
SwipeCore.use([EffectCoverflow, Pagination]);

const Listing = () => {
  const [listing, setListing] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setuserBalance] = useState(null);
  const navigate = useNavigate(); //eslint-disable-line
  const params = useParams();
  const auth = getAuth(); //eslint-disable-line

  
  useEffect(() => {
   
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  const fetchListing = async () => {
    const docRef = doc(db, "listings", params.listingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      setListing(docSnap.data());
      setLoading(false);
    }
  };
 /////RAZORPAY////////////////////////////////////////////////////////////
  const loadScript = (src) =>{
    return new Promise((resolve) =>{

      const script = document.createElement('script')
      script.src = src

      script.onload = () => {
        resolve(true)
      }
      script.onload = () =>{
        resolve(true)
      }

      script.onerror = ()=> {
        resolve(false)
      }

      document.body.appendChild(script)
    })
  }
  
  const deleteConfirm = (rowId) => {
    confirmAlert({
      title: "Select Date",
      message: [
        <div>
        <label for="booking">From:</label>
        <input type="date" id="from" name="from"></input>
  
        <div>
        <label for="booking">To:</label>
        <input type="date" id="to" name="to"></input>
        </div>
        
        </div>
      ],
      buttons: [
        {
          label: "Yes",
          onClick: async() => {displayRazorpay(listing.offer ?listing.discountedPrice : listing.regularPrice, listing.useRef )
            console.log(document.getElementById("from").value).toString()
          //  display
          },
        },
        {
          label: "No",
        },
      ],
      // childrenElement: () => <div />,
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });
  
  };

 const displayRazorpay = async(amount,uid) =>{
  const from= document.getElementById("from").value
  const to= document.getElementById("to").value
  const docRef = doc(db, "users",uid);
  const docSnap = await getDoc(docRef);
  // if (docSnap.exists()) {
    // console.log(docSnap.data());
  //   // setListing(docSnap.data());
  //   // setLoading(false);
  // }

  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
  if(!res){
    alert('You are offline.... Failed to load Razorpay SDK');
    return 
  }
  const options = {
    key: "rzp_test_LocZdUYE2PuGjN",
    currency: "INR",
    amount: amount * 100,
    name: docSnap.data().name,
    description: "Thank you for booking",
    image: docSnap.data().hostimage,
    
    handler: function(response){
      alert(response.razorpay_payment_id);
      alert("Payment Successful");
      updateDoc(doc(db,"listings",params.listingId),{
        isBooked: true
      })
      const docRef = addDoc(collection(db, "bookings"),{
        From:from,
        Property_id:params.listingId,
        To:to,
        User_id:uid,
        amount:amount,
        cancelled:false,
        payment_id:response.razorpay_payment_id

      }).then(()=> {
        fetchListing()
      })

    },
    prefill: {
      name: ""
    }
  };

  const paymentObject = new window.Razorpay(options)
  paymentObject.open()
  

    
    
}


/////MetaMask////////////////////////////////////////////////////////////

  const connectWallet = () =>{
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'}).then(result => {
                accountChanged([result[0]])
            })
      //   if(defaultAccount != null){
      //     alert("Address "+{defaultAccount});
      //  }
        } else{
            setErrorMessage('Install MetaMask please')
        }
    }
    const accountChanged = (accountName) => {
        setDefaultAccount(accountName) 
       
        // getUserBalance(accountName);
    }
    async function sendTransaction(amount){
        let params = [{
            from:"0x3379209f60AC45438728fBEf28897f267BBf1059",
            to: "0xf53CD678e566585A10179b60187237aD5193C0De",
            gas: Number(21000).toString(16),
            gasPrice: Number(587228555).toString(16),
            // value: Number(50000000000000000).toString(16),
            value:Number(amount*100*0.0000075).toString(16),
        }]

        let result = await window.ethereum.request({method: "eth_sendTransaction", params}).catch((err) => {
            console.log(err)
        })
    }
    console.log("Address "+{defaultAccount});
  return (
    <Layout title={listing.name}>
      <div className="row listing-container">
        <div className="col-md-8 listing-container-col1">
          {listing.imgUrls === undefined ? (
            <Spinner />
          ) : (
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={true}
              className="mySwipe"
            >
              {listing.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img src={listing.imgUrls[index]} alt={listing.name} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="col-md-4 listing-container-col2">
          <h3>{listing.name}</h3>
          <h6>
            Price :{" "} ₹ {" "}
            {listing.offer ? listing.discountedPrice : listing.regularPrice}/-
            {/* {listing.offer ? listing.discountedPrice : listing.regularPrice} / */}
            
          </h6>
          <p>Property For : {listing.type === "rent" ? "Rent" : "Sale"}</p>
          <p>
            {listing.offer && (
              <span>
                {listing.regularPrice - listing.discountedPrice} Discount
              </span>
            )}
          </p>
          <p>
            <FaBed size={20} /> &nbsp;
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </p>
          <p>
            <FaBath size={20} /> &nbsp;
            {listing.bathrooms > 1
              ? `${listing.bathrooms} bathrooms`
              : "1 Bathroom"}
          </p>
          <p>
            <FaParking size={20} /> &nbsp;
            {listing.parking ? `Parking spot` : "no spot for parking"}
          </p>
          <p>
            <FaHouseDamage size={20} /> &nbsp;
            {listing.furnished ? `furnished house` : "not furnished"}
          </p>
          <Link
            className="btn btn-success"
            to={`/contact/${listing.useRef}?listingName=${listing.name}`}
          >
            Contact Landlord <FaArrowCircleRight size={20} />
          </Link>
          {/* <div >
            {listing.isBooked== true? <div>Property Booked</div> : <button type="button" class="btn btn-success  mt-2"
            onClick={() => displayRazorpay(listing.offer ?listing.discountedPrice : listing.regularPrice, listing.useRef )}
          >
            Book Now <FaArrowCircleRight size={20} />
          </button>}
             
          
          </div> */}
           <div>
              <button type="button" class="btn btn-success  mt-2" onClick={connectWallet}> Connect Wallet Button</button>
              <div>
              <Link to="/reactcalendar" className="btn btn-success mt-2">Book Now</Link>

              {/* <button type="button" class="btn btn-success  mt-2" onClick={deleteConfirm}> Book Now</button> */}
            </div>

           </div>
         <h3>Address: {defaultAccount}</h3>
         {errorMessage}
         <div>
              <button type="button" class="btn btn-success  mt-2" onClick={()=>sendTransaction(listing.offer ?listing.discountedPrice : listing.regularPrice, listing.useRef )}>Pay using your Crypto Wallet</button>
          </div>
        {/* <form onSubmit={sendTransaction} className="btn btn-success mt-2">
            <input type="submit" value="Submit" />
        </form> */}


        </div>
      </div>
      
    </Layout>
  );
};

export default Listing;
