import KimMatinSupportNav from "../components/KimMatinSupportNav";
import "./scss/Privacy.scss";
import "./scss/KimMatinSupport.scss";

const usageRows = [
  ["Identity and profile information", "We use this information to create an account on our Services for you."],
  ["Contact and transaction information", "We use this information to process your orders/purchases on our Services for you."],
  [
    "Device, usage, and other technical information.",
    "We use your device information to improve our services, including the functionality of our Services on different devices.",
  ],
  [
    "Marketing and communications information.",
    "We use this information to send you marketing and communications in relation to our various promotions and offerings.",
  ],
];

const retentionRows = [
  ["Identify information", "Stored for the lifetime of your use of the Services (i.e. until account deletion in accordance with your request)."],
  ["Contact information", "Stored for the lifetime of your use of the Services (i.e. until account deletion in accordance with your request)."],
  [
    "Transaction information",
    "Stored for the lifetime of your use of the Services (i.e. until account deletion in accordance with your request) and for at least 10 years from the date of the transaction.",
  ],
  [
    "Device and other technical information/Usage information",
    "Stored for the lifetime of your use of the Services (i.e. until account deletion in accordance with your request) and then for seven years from the date of account deletion.",
  ],
  [
    "Marketing and communications information",
    "Stored for the lifetime of your use of the Services (i.e. until account deletion in accordance with your request) and then for seven years from the date of account deletion.",
  ],
];

function PolicyList({ items, className = "" }) {
  return (
    <ul className={`km-policy-list ${className}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function MarkerList({ items, className = "" }) {
  return (
    <ul className={`km-marker-list ${className}`}>
      {items.map((item, index) => (
        <li key={index}>
          <span className="km-marker">{item.marker}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function PolicyTable({ headers, rows }) {
  return (
    <table className="km-policy-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, text]) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function KimMatinPrivacy() {
  return (
    <section className="sub-section km-support-page">
      <div className="inner qna-page">
        <div>
          <div className="qna-inner privacy-inner">
            <KimMatinSupportNav />

            <div className="qna-content privacy-content km-policy-content">
              <h2>Privacy Policy</h2>

              <div className="policy-block">
                <h3>1. INTRODUCTION</h3>
                <PolicyList
                  items={[
                    "This Privacy Policy informs you of your rights and our practices regarding any personal data you provide to us. Your use of our websites, mobile applications, and services (collectively, the \"Services\") involves the collection and use of your personal data. It is important for you to understand how this happens and how you may control it.",
                    "This Privacy Policy explains how we handle personal data collected, received, and processed in the course of your use of our Services. It also governs the collection, use and disclosure of your personal data.",
                    "When you use our Services, you expressly consent to us collecting, processing, using, providing to third parties, and storing your personal information, and you accept our rules and policies regarding your personal data as described in this Privacy Policy.",
                    "You acknowledge that you have read and understood this Privacy Policy. If you do not agree with this Privacy Policy, you must not use our Services. If you change your mind in the future, you may withdraw your consent to our use of your personal data in accordance with this policy by deleting your account, subject to certain data retention periods under Section 6 of this Privacy Policy.",
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>2. INFORMATION WE COLLECT AND RECEIVE</h3>
                <PolicyList
                  items={[
                    "During the course of your use of our Services, we may collect personal data from you, which includes, but is not limited to:",
                  ]}
                />
                <MarkerList
                  className="is-nested"
                  items={[
                    { marker: "(a)", text: "Identity information, such as your name, gender, and date of birth;" },
                    { marker: "(b)", text: "Profile information, such as your username and password;" },
                    { marker: "(c)", text: "Contact information, such as billing address, delivery address, email address and phone numbers;" },
                    {
                      marker: "(d)",
                      text: "Transaction information, such as bank account or payment details and other details of products that you have purchased or obtained through our Services;",
                    },
                    {
                      marker: "(e)",
                      text: "Device and other technical information, such as internet protocol (IP) address, your login data, browser type and version, location, operating system and platform, device identifier, and other similar and/or related information on the devices you use to access the our Services;",
                    },
                    { marker: "(f)", text: "Usage information, such as information on how you use our Services or view any content on our Services;" },
                    {
                      marker: "(g)",
                      text: "Marketing and communications information, such as your preferences in receiving marketing from us and our third parties, your interests, preferences, reviews, and survey responses and your communication preferences.",
                    },
                  ]}
                />
                <PolicyList
                  items={[
                    "You are under no obligation to provide the information enumerated above to us; however, if you choose to withhold the information or to revoke permission for us to receive the information, we may be unable to provide certain aspects of our Services to you.",
                    "During the course of your use of our Services, we may receive personal data from you in the following situations:",
                  ]}
                />
                <MarkerList
                  className="is-nested"
                  items={[
                    { marker: "(a)", text: "When you create an account with us (\"Account\");" },
                    { marker: "(b)", text: "When you log in to your account;" },
                    { marker: "(c)", text: "When you submit any offer to purchase any products available on our Services;" },
                    { marker: "(d)", text: "When you use any of the features or functions available on our Services;" },
                    { marker: "(e)", text: "When you record any user-generated content which is uploaded on the website or app (e.g. review of products purchased from our site);" },
                    { marker: "(f)", text: "When you use the chat function on the website or app;" },
                    { marker: "(g)", text: "When you subscribe to our publications or marketing collaterals;" },
                    { marker: "(h)", text: "When you enter a competition, promotion, or survey;" },
                    { marker: "(i)", text: "When you interact with us offline, including when you interact with our outsourced customer service agents." },
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>3. HOW WE USE PERSONAL YOUR PERSONAL DATA</h3>
                <PolicyTable headers={["Personal Information", "Use"]} rows={usageRows} />
              </div>

              <div className="policy-block">
                <h3>4. HOW WE STORE AND SHARE YOUR PERSONAL DATA</h3>
                <PolicyList
                  items={[
                    "In order to for us to provide you with our Services, your personal data will be accessible from and will be processed on our servers. Our servers may be located outside your jurisdiction.",
                    "We share your personal data with selected third parties in and outside your country, including:",
                  ]}
                />
                <MarkerList
                  className="is-nested"
                  items={[
                    {
                      marker: "(a)",
                      text: "third parties that provide services in support of our Services, including but not limited to providers of cloud services, shopping mall platform services and courier and delivery services, that process information identified in this policy on their servers for the purpose of providing the Services. All such third-party service providers are prohibited from using your personal information for any purpose other than providing us with their services. Further, this sharing of personal information to outsourced services providers shall be covered by an Outsourcing Agreement that is compliant with data privacy laws, rules, and regulations.",
                    },
                    {
                      marker: "(b)",
                      text: "related group companies with whom we share your personal information to operate the Services. All related group companies may only use your personal information in accordance with this privacy policy. Further, sharing of personal information with related group companies shall be covered by a Data Sharing Agreement that is compliant with data privacy laws, rules, and regulations.",
                    },
                    {
                      marker: "(c)",
                      text: "social media platforms and networks, such as Facebook and Twitter that offer functionalities, plugins, widgets, or tools in connection with our website or mobile application (e.g., to log into an account, or to share content with your friends and followers on social media). If you choose to use these functionalities, plugins, widgets, or tools, certain information may be shared with or collected by those social media companies - for more information about what information is shared or collected, and how it is used, see the applicable social media company's privacy policy.",
                    },
                    {
                      marker: "(d)",
                      text: "law enforcement agencies, public authorities, or other judicial bodies and organizations. We disclose information when legally required to do so, or if we believe in good faith that such use is reasonably necessary to:",
                    },
                  ]}
                />
                <MarkerList
                  className="is-deep"
                  items={[
                    { marker: "i.", text: "comply with a legal obligation, process, or request;" },
                    { marker: "ii.", text: "enforce our terms of service and other agreements, policies, and standards, including investigation of any potential violation thereof;" },
                    { marker: "iii.", text: "detect, prevent or otherwise address security, fraud or technical issues; or" },
                    {
                      marker: "iv.",
                      text: "protect the rights, property or safety of us, our users, a third party or the public as required or permitted by law (including exchanging information with other companies and organizations for the purposes of fraud protection); and",
                    },
                  ]}
                />
                <MarkerList
                  className="is-nested"
                  items={[
                    {
                      marker: "(e)",
                      text: "parties to business transactions. We will disclose information to a third party if we sell, buy, merge, or partner with other companies or businesses; sell some or all of our assets; or undergo a reorganization, bankruptcy, or liquidation; or otherwise undertake a business transaction. As part of these transactions, user information may be shared, or transferred, and it may be subsequently used by a third part.",
                    },
                  ]}
                />
                <PolicyList
                  items={[
                    "We respect your privacy and we will not transfer or convey your personal data to any third party, unless as part of a legitimate business transaction as described in this Section 4. We may disclose data and aggregate statistics about users of our Services and sales to prospective partners, advertisers, sponsors and other reputable third parties in order to describe our Services, deliver targeted advertisements or for other lawful purposes, but these data and statistics will be anonymized and shall not include information which can be used to identify you.",
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>5. THE SECURITY OF YOUR PERSONAL DATA</h3>
                <PolicyList
                  items={[
                    "We are committed to maintaining the privacy and integrity of your personal data no matter where it is stored. We have information security and access policies that limit access to our systems and technology. We also protect data through the use of technological protection measures such as encryption. Your personal data will remain subject to our technical and organizational controls and our policies and procedures (including this Privacy Policy). We also follow generally accepted industry standards to protect the information transmitted to us over the Internet, both during transmission and once we receive it. Sensitive information (such as credit card numbers) may be encrypted using secure socket layer technology (SSL).",
                    "Despite our best efforts, you should note that no method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.",
                    "It is important that you also protect yourself against unauthorized access of your Account and information by choosing your password carefully (in accordance with our requirements for nominating a password such as minimum number of characters, special characters, and capitalizations.) and keeping your password and Account secure (e.g. by signing out after using our Services).",
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>6. DATA RETENTION</h3>
                <PolicyList items={["We may retain your personal data as described below (except if otherwise required to be retained by applicable law)."]} />
                <PolicyTable headers={["Personal Information", "Retention Policy"]} rows={retentionRows} />
                <PolicyList
                  items={[
                    "Your personal data will be stored with us until the end of its life cycle (as set out in the retention policy above). When destroying personal data, measures will be taken to make the personal data irrecoverable or irreproducible, and electronic files which contain personal data will be deleted permanently using a technical method which makes the files irreproducible.",
                    "In the event that the processing and retention period have terminated, but personal data is required to be retained continuously for other reasons including for the purposes as prescribed under applicable laws, the relevant personal data will be stored and maintained separately from other types of personal data.",
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>7. YOUR RIGHTS</h3>
                <PolicyList items={["Under the pertinent data privacy laws, rules, and regulations, you have the following rights:"]} />
                <MarkerList
                  className="is-nested"
                  items={[
                    {
                      marker: "(a)",
                      text: "Right to be informed. You shall have the right to be notified and furnished with information indicated in this Privacy Policy before the entry of your personal data into our data processing system or at the next practical opportunity.",
                    },
                    {
                      marker: "(b)",
                      text: "Right to object. You shall have the right to object to the processing of your personal information. When you object or withhold consent, we shall no longer process your personal data, unless:",
                    },
                  ]}
                />
                <MarkerList
                  className="is-deep"
                  items={[
                    { marker: "i.", text: "the personal data is needed pursuant to a legal process (such as a subpoena);" },
                    { marker: "ii.", text: "the collection and processing are for obvious purposes, including, when it is necessary for the performance of or in relation to a contract or service to which you have bound yourself; or" },
                    { marker: "iii.", text: "your personal information is being collected and processed as a result of a legal obligation." },
                  ]}
                />
                <MarkerList
                  className="is-nested"
                  items={[
                    {
                      marker: "(c)",
                      text: "Right to access. You have the right to reasonable access to, upon demand, the following:",
                    },
                  ]}
                />
                <MarkerList
                  className="is-deep"
                  items={[
                    { marker: "i.", text: "contents of your personal information that were processed;" },
                    { marker: "ii.", text: "sources from which your personal information were obtained;" },
                    { marker: "iii.", text: "names and addresses of recipients of your personal information;" },
                    { marker: "iv.", text: "manner by which such data were processed;" },
                    { marker: "v.", text: "reasons for the disclosure of the personal data to recipients, if any;" },
                    { marker: "vi.", text: "information on automated processes where the data will, or is likely to, be made as the sole basis for any decision that significantly affects or will affect the data subject;" },
                    { marker: "vii.", text: "date when his or her personal information concerning the data subject were last accessed and modified; and" },
                    { marker: "viii.", text: "the designation, name or identity, and address of the personal information controller." },
                  ]}
                />
                <MarkerList
                  className="is-nested"
                  items={[
                    {
                      marker: "(d)",
                      text: "Right to rectification. You have the right to dispute the inaccuracy or error in the personal information and have us correct it within a reasonable period, unless the request is vexatious or otherwise unreasonable. If the personal information has been corrected, we shall ensure the accessibility of both the new and the retracted information and the simultaneous receipt of the new and the retracted information by the intended recipients thereof. Provided, that recipients or third parties who have previously received such processed personal data shall be informed of its inaccuracy and its rectification, upon your reasonable request.",
                    },
                    {
                      marker: "(e)",
                      text: "Right to erasure or blocking. You shall have the right to suspend, withdraw or order the blocking, removal or destruction of your personal information from our filing system.",
                    },
                  ]}
                />
                <MarkerList
                  className="is-deep"
                  items={[
                    { marker: "i.", text: "This right may be exercised upon your discovery and substantial proof of any of the following:" },
                    { marker: "ii.", text: "your personal data is incomplete, outdated, false, or unlawfully obtained;" },
                    { marker: "iii.", text: "your personal data is being used for purpose not authorized by you;" },
                    { marker: "iv.", text: "your personal data is no longer necessary for the purposes for which they were collected;" },
                    { marker: "v.", text: "you withdraw consent or object to the processing, and there is no other legal ground or overriding legitimate interest for the processing;" },
                    { marker: "vi.", text: "your personal data concerns private information that is prejudicial to you, unless justified by freedom of speech, of expression, or of the press or otherwise authorized;" },
                    { marker: "vii.", text: "the processing is unlawful; or" },
                    { marker: "viii.", text: "we violated your rights." },
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>8. THIRD PARTY SITES AND RESOURCES</h3>
                <p>
                  Our Services may, from time to time, contain links to external sites or resources which are operated by third parties. We have no control over the content and privacy practices of such sites or resources. You are advised to review the privacy policies of these sites and resources operated by third parties and understand how your information may be used by those third parties.
                </p>
              </div>

              <div className="policy-block">
                <h3>9. CONTACT US</h3>
                <PolicyList items={["If you have any questions, complaints, concerns, or comments on our Privacy Policy, we welcome you to contact us through the following details:"]} />
                <PolicyList
                  className="is-nested-contact"
                  items={[
                    "[insert address of company]",
                    "Email: [insert email address]",
                    "Telephone No: [insert phone number]",
                    "Attention: Data Protection Officer",
                  ]}
                />
              </div>

              <div className="policy-block">
                <h3>10. CHANGES TO THIS PRIVACY POLICY</h3>
                <PolicyList
                  items={[
                    "We may update this Privacy Policy from time to time and all changes will be posted here. If we believe that the changes are material, we will notify you of the changes by posting a notice on our Services or by email.",
                    "You are responsible for reviewing the changes which we make this Privacy Policy. Your continued use of our Services constitutes your acceptance of the updated Privacy Policy.",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
