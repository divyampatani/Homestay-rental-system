import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { getDoc, doc, query } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { useNavigate, Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import SwipeCore, { EffectCoverflow, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "../styles/listing.css";
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
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

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

 const displayRazorpay = async(amount,uid) =>{
  
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
    async function sendTransaction(){
        let params = [{
            from:"0x0A17dFDf1c7a3E9a1d933F459d399383d2150fe5",
            to: "0x7e070b6EECeB705ba99E13a8bd83938a95a91C4B",
            gas: Number(21000).toString(16),
            gasPrice: Number(587228555).toString(16),
            value: Number(50000000000000000).toString(16),
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
          <div >
            <button type="button" class="btn btn-success  mt-2"
            onClick={() => displayRazorpay(listing.offer ?listing.discountedPrice : listing.regularPrice, listing.useRef )}
          >
            Book Now <FaArrowCircleRight size={20} />
          </button> 
          
          </div>
           <div>
              <button type="button" class="btn btn-success  mt-2" onClick={connectWallet}> Connect Wallet Button</button>
           </div>
         <h3>Address: {defaultAccount}</h3>
         {errorMessage}
         <div>
              <button type="button" class="btn btn-success  mt-2" onClick={sendTransaction}>Pay using your Crypto Wallet</button>
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
