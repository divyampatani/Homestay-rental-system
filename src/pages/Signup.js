import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./../components/Layout/Layout";
import { toast } from "react-toastify";
import { BsFillEyeFill } from "react-icons/bs";
import {CFormInput} from "@coreui/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
// import { firebase } from "../firebase.config";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import OAuth from "../components/OAuth";
import "../styles/signup.css";
import { async } from "@firebase/util";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    hostimage:"" ,
  });
  const { name, email, password } = formData;
  const[image,setimage]= useState([]);
  const[url,seturl]= useState([]);


  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitHndler = async (e) => {
    e.preventDefault();
    console.log(image);
//     var storage = firebase.storage();
// var storageRef = storage.ref();
// var uploadTask = storageRef.child("offerImage/" + Date.now()).put(image);
// uploadTask.on(
//   firebase.storage.TaskEvent.STATE_CHANGED,
//   (snapshot) => {
//     // console.log(snapshot);
//     var progress =
//       Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     // setProgress(progress);
//   },
//   (error) => {
//     // console.log(error);
//     alert(error);
//   },
//   () => {
//     uploadTask.snapshot.ref.getDownloadURL().then(async (imageurl) => {
//       formData.hostimage=imageurl   
//       try {
//         const auth = getAuth();
//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );
//         const user = userCredential.user;
//         updateProfile(auth.currentUser, { displayName: name });
//         const formDataCopy = { ...formData };
//         delete formDataCopy.password;
//         formDataCopy.timestamp = serverTimestamp();
//         await setDoc(doc(db, "users", user.uid), formDataCopy);
//         toast.success("Signup Successfully !");
//         navigate("/");
//       } catch (error) {
//         console.log(error);
//         toast.error("Something Went Wrong");
//       }
//       // history.push("/coupon");
//       setimage([]);
//       // setSubmitLoading(false);
//     });
//   }
// );
const storage = getStorage();
        // const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + Date.now());
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("uplloas is" + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("upload is paused");
                break;
              case "running":
                console.log("upload is runnning");
            }
          },
          (error) => {
            // reject(error);
          },
          //success
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
               formData.hostimage=downloadURL 
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        updateProfile(auth.currentUser, { displayName: name });
        const formDataCopy = { ...formData };
        delete formDataCopy.password;
        formDataCopy.timestamp = serverTimestamp();
        await setDoc(doc(db, "users", user.uid), formDataCopy);
        toast.success("Signup Successfully !");
        navigate("/");
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
      }
//       // history.push("/coupon");
//       setimage([]);
//       // setSubmitLoading(false);
//     });
            });
          }
        );
  };
  return (
    <Layout title="signup - house marketplace">
      <div className="row signup-container">
        <div className="col-md-6 signup-container-col-1">
          <img src="./assets/signup.svg" alt="welcome" />
        </div>
        <div className="col-md-6 signup-container-col-2">
          <form onSubmit={onSubmitHndler}>
            <h3 className=" mt-2 text-center ">Sign Up </h3>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                className="form-control"
                id="name"
                onChange={onChange}
                aria-describedby="nameHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={onChange}
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={onChange}
                className="form-control"
                id="password"
              />
            </div>
            <div className="mb-3">
              show password
              <BsFillEyeFill
                className="text-danger ms-2  "
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowPassword((prevState) => !prevState);
                }}
              />
            </div>
            <div>
            <CFormInput type="file" id="formFile" label="Default file input example" onChange={(e) =>
                          setimage(e.target.files[0])}/>


            </div>
            <button type="submit" className="btn signup-button">
              Sign up
            </button>
            <span className="ms-4">Already User</span>{" "}
            <Link to="/signin">Login</Link>
            <div className="mt-3">
              <OAuth />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
