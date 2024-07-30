import React from "react";
import Layout from "./../components/Layout/Mylayout";
import { BiMailSend, BiPhoneCall } from "react-icons/bi";
import contact from "../images/contact.jpeg"
const ContactPage = () => {
  return (
    <Layout title={"Contact us - Cloud Store"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src={contact}
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : elsayednassef2021@gmail.com
          </p>
          <p className="mt-3">
            <BiMailSend /> : fathynassef2028@gmail.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : +201023243977
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : +201021773963
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : +201096180475
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
