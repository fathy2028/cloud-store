import React from "react";
import Layout from "./../components/Layout/Mylayout";
import policy from "../images/policy.jpeg";

const PolicyPage = () => {
  return (
    <Layout title={"Policy - Cloud Pharmacy"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
          height={"300px"}
            src={policy}
            alt="policy"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>We value your privacy and are committed to protecting your personal data.</p>
          <p>We collect personal identification information, payment information, health information, technical data, and usage data.</p>
          <p>We use your data to process your orders, manage your account, provide and improve our products and services, communicate with you, and comply with legal obligations.</p>
          <p>We may share your data with service providers, legal authorities, and health professionals with your consent.</p>
          <p>We implement a variety of security measures to maintain the safety of your personal data.</p>
          <p>We use cookies and similar tracking technologies to enhance your experience on our website.</p>
          <p>You have the right to access, correct, delete, restrict, and object to the processing of your data, as well as data portability.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PolicyPage;
