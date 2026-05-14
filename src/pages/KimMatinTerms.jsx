import KimMatinSupportNav from "../components/KimMatinSupportNav";
import "./scss/Agreement.scss";
import "./scss/KimMatinSupport.scss";

const terms = [
  {
    title: "The following template is the standard terms and conditions provided by the Korea Fair Trade Commission and may be subject to change depending on your store operations.",
    content: [
      "Please check the specificities of your store operations and apply the necessary changes, while keeping in mind relevant laws and regulations, before using these terms.",
    ],
  },
  {
    title: "Article 1 (Purpose)",
    content: [
      "These terms and conditions set out the rights, obligations, and responsibilities of MatinKim(\"online store\", \"we\", \"us\"), an online store operated by [MatinKim] (e-commerce operator), and its users (\"you\"), in relation to the use of the internet-related services offered through the online store (\"services\").",
      "※ These terms and conditions also apply to your e-commerce transactions on PC and wireless operations.",
    ],
  },
  {
    title: "Article 2 (Definitions)",
    content: [
      "1. \"Online store\" refers to a virtual marketplace created by [MatinKim] that allows users to trade products and services (\"goods and services\") through IT systems. In these terms, \"online store\" also refers to the operator of the store.",
      "2. \"Users\" refers anyone (customer accounts or guests) who accesses the \"online store\" and uses our services in accordance with its terms and conditions.",
      "3. \"Customer accounts\" refers to users who have registered an account on the \"online store\" and who, therefore, have continuous access to the services offered through the \"online store.\"",
      "4. \"Guests\" refers to users who use the services offered through the \"online store\" without registering an account.",
    ],
  },
  {
    title: "Article 3 (Effects and Modifications of the Terms and Conditions)",
    content: [
      "1. We will publish on the launch screen of the online store, a link to the full content of these terms and conditions, as well as the name of the business owner, the physical address of the sales office (including the address of customer service centers), phone number, fax number, e-mail address, business registration number, website registration/notification badge and name of the privacy officer. We will ensure that the full content of the terms and conditions are made available so that you can view them by following a link.",
      "2. We shall display on a separate link or a pop-up screen, important and relevant information in these terms and conditions that govern our cancellation policy, shipping policy, refund policy, and others. By doing so, we ensure that you have a clear understanding of these terms and conditions before you give your consent.",
      "3. We may amend the terms and conditions within the scope of applicable laws and regulations, including the Act on the Consumer Protection in Electronic Commerce, etc., Act on the Regulation of Terms and Conditions, Framework Act on Electronic Documents and Transactions, Electronic Financial Transactions Act, Digital Signature Act, Act on Promotion of Information and Communications Network Utilization and Information Protection, Act on Door-to-Door Sales, and the Framework Act on Consumers.",
      "4. We shall publicize any amendments to these terms and conditions on the launch screen of the online store, seven (7) days before the enforcement date until the day before the amendments become effective, along with the reasons for the planned revisions. When the terms and conditions are being amended in a way that is disadvantageous to you, we shall notify you in advance with a minimum grace period of thirty (30) days. In this case, we will show you a clear before and after comparison of the amended terms and conditions in a way that is easy for you to understand.",
      "5. Amendments to these terms and conditions will only apply to contracts coming into effect after the enforcement date, with the preceding terms and conditions applying to existing contracts. For those of you who wish to make the transition, please let us know within the 30-day grace period specified in Paragraph 3. If we agree to such a transition, the new terms and conditions may also apply to you.",
      "6. Matters that are not specified in these terms and conditions and their interpretations are subject to the Act on the Consumer Protection in Electronic Commerce etc., Act on the Regulation of Terms and Conditions, and other consumer protection guidelines and regulations on e-commerce provided by the Korea Fair Trade Commission as well as commercial practices.",
    ],
  },
  {
    title: "Article 4 (Provision of Services and Amendments)",
    content: [
      "1. We carry out the following tasks:",
      "  Provide information on goods and services, and conclude purchase contracts",
      "  Fulfill delivery of contracted goods and services",
      "  Other tasks determined by us",
      "2. In the event of unavailability or changes in technical specifications, the goods and services that we provide in future contracts may be subject to changes. In this case, we shall publicize the details and provision date of the modified goods and services on the web pages where they have been uploaded.",
      "3. In the event of changes to the content of the services we provide under this contract, either due to the unavailability of goods or changes in technical specifications, we must immediately notify you through a means of contact where you can be reached.",
      "4. We are liable to compensate for any damages incurred to you as a result of events outlined in Paragraph 3. However, this does not apply if it can be proven that the damage was not caused by us either intentionally or due to negligence on our part.",
    ],
  },
  {
    title: "Article 5 (Service Suspension)",
    content: [
      "1. We may temporarily suspend our services due to reasons stemming from repairs, inspections, replacement or failure of parts, and network disruptions.",
      "2. We will compensate you or third parties for any damages incurred by temporary service suspensions due to the reasons specified in Paragraph 1. However, this does not apply if it can be proven that the damage was not caused by us either intentionally or due to negligence on our part.",
      "3. In cases where we are unable to provide our services as a result of changes in our line of business, forfeiture of business, or mergers, we will inform you in the manner specified in Article 8 and compensate you based on the conditions presented in advance. However, if we have not publicized any compensation criteria, we shall compensate you for your mileage and points either in cash or cash equivalents that are equal in monetary value to currencies used in our online store.",
    ],
  },
  {
    title: "Article 6 (Account Registration)",
    content: [
      "1. You can create a customer account on the online store after entering your personal information on the registration form that we have provided and by agreeing to the outlined terms and conditions.",
      "2. We will accept your account registration request once you create an account, as described in Paragraph 1, unless one of the following conditions apply:",
      "  Your account was previously deleted under Article 7, Paragraph 3 of these terms and conditions. In this case, exceptions will be made if three (3) years have elapsed since the account termination and we accept your new registration request.",
      "  If the application submitted contains false information, omissions, and errors",
      "  If accepting your registration request poses significant technical challenges for the online store",
      "3. Account registration is deemed complete once you have received our approval notice.",
      "4. You shall let us know of any changes you wish to make to the personal information submitted with your application within a suitable period of time.",
    ],
  },
  {
    title: "Article 7 (Account Deletion and Loss of Eligibility)",
    content: [
      "1. You may ask that your customer account be deleted at any time and we will process your request immediately.",
      "2. We may limit or suspend your account privileges if any of the following conditions apply:",
      "  If you submitted false information during the application",
      "  If you fail to pay for the goods and services purchased through the online store or other cost associated with the use of the online store",
      "  If you interfere with the use of the online store by other users or threaten the e-commerce environment by stealing personal information, etc.",
      "  If you exploit the online store to engage in activities that are either illegal, violate these terms and conditions, or disrupt public order",
      "3. If you engage in similar violations on two (2) occasions or more or fail to rectify the behavior within thirty (30) days following the limit/suspension on account privileges, we may terminate your account.",
      "4. Your registration is canceled when we revoke your eligibility as an account holder. In this case, we will notify you and grant you at least thirty (30) days so that you can state your case before the cancellation is finalized.",
    ],
  },
  {
    title: "Article 8 (Account Notifications)",
    content: [
      "1. We may send you notifications through the e-mail address you provided in advance.",
      "2. We may stick general notices on our message board for one (1) week or more for announcements pertaining to multiple accounts and groups. However, we must send individual notifications on matters of significant consequence for you in your personal transactions.",
    ],
  },
  {
    title: "Article 9 (Purchase Requests and Personal Information Collection Agreements)",
    content: [
      "1. You may request orders through procedures outlined in the following list, or by using other similar methods. We must assist by providing relevant information in a way that is easy for you to understand.",
      "  Search and selection of goods and services",
      "  Entry of the recipient's name, address, phone number, e-mail address (or mobile number), and other information",
      "  Confirmation of terms and conditions, services with limited cancellation rights, details on expenses related to delivery, installation, etc.",
      "  Final verification of consent to the terms and services, and conditions outlined in Paragraph 3 (Click \"Yes\" button)",
      "  Confirmation and submission of the purchase order, and our approval of the confirmation",
      "  Selection of payment method",
      "2. We shall notify you and obtain your consent before providing your personal information to a third party as a requirement to fulfill a purchase order. In this case, we provide you with information, including 1) The recipient of your personal information, 2) The purpose regarding the use of your personal information, 3) The nature of the personal information that is to be provided, 4) The duration of storage and use of your personal information (These also apply when changes have been made to user consent).",
      "3. When we consign tasks to a third party to handle your personal information, we shall obtain your consent and provide you with information, including 1) The consigned party that will have access to your information, 2) Details on the tasks that require the use of your personal information (These also apply when changes have been made to user consent). However, a prior notification on the use of personal information may be used as a substitute for individual notice and consent on each transaction if it is necessary for the fulfillment of service contracts and if it is more convenient for you. Such action must comply with the Act on Promotion of Information and Communications Network Utilization and Information Protection.",
    ],
  },
  {
    title: "Article 10 (Terms of Contract Delivery)",
    content: [
      "1. We reserve the right to turn down any purchase request outlined in Article 9 that does not meet the following requirements. In cases where minors enter into a contract, we are required to provide notification that the purchase may be canceled by the minors in question or their legal representatives in the absence of the latter's consent.",
      "  The purchase request does not contain false information, omissions, and errors.",
      "  Goods and services including alcohol and tobacco must not be sold to minors in accordance with the Youth Protection Act.",
      "  Approval of the purchase request does not pose extraordinary technical challenges for us.",
      "2. The contract is deemed valid when you receive our approval notice in the form of a receipt confirmation notice as specified in Article 12, Paragraph 1.",
      "3. Our approval notice shall include information including a confirmation of your purchase request, the availability of the requested goods and services, and the possibility of changes/cancellations in the purchase order.",
    ],
  },
  {
    title: "Article 11 (Payment Method)",
    content: [
      "Methods of payment for goods and services purchased on the online store may include one of the following. We are prohibited from charging and collecting any additional fees regarding your choice in payment methods for the goods and services purchased.",
      "  Phone banking, internet banking, mail banking, and other forms of account transfers",
      "  Prepaid cards, debit cards, credit cards, and other card payments",
      "  Online bank deposits",
      "  Cryptocurrency payments",
      "  Payment upon delivery",
      "  Points and credits issued by the online store",
      "  Vouchers issued or accepted by the online store",
      "  Other electronic payment methods",
    ],
  },
  {
    title: "Article 12 (Receipt Confirmation Notice, Changes and Cancellations of Purchase Request)",
    content: [
      "1. We send you a receipt confirmation notice upon receiving a purchase request.",
      "2. After you receive the notice, you may request to either change or cancel your order request in cases where there are any discrepancies, which we must fulfill without delay if the order has not yet been shipped. However, if the payment has already been made, cancellation policies outlined in Article 15 will apply.",
    ],
  },
  {
    title: "Article 13 (Delivery of Goods and Services)",
    content: [
      "1. Except for cases where we have made a separate agreement with you regarding the time of delivery, we will take the necessary steps, including production orders and packaging, to deliver the goods within seven (7) days of the contract. If we have already received partial or full payment for the order in question, we shall take action within three (3) business days of receiving the payment. We will take appropriate measures in allowing you to check the procedures and progress of delivery.",
      "2. We must clearly outline the delivery method, who pays the shipping charge depending on the method, and delivery time on goods that you purchased. We are liable to pay any damages incurred to you due to late deliveries. However, this does not apply if it can be proven that the delay was not caused by us either intentionally or due to negligence on our part.",
    ],
  },
  {
    title: "Article 14 (Refunds)",
    content: [
      "We shall immediately notify you of orders that cannot be fulfilled due to stock unavailability or other reasons. If we have received payment for the order, we shall either provide a refund or take related steps within three (3) business days of the receipt of payment.",
    ],
  },
  {
    title: "Article 15 (Cancellations)",
    content: [
      "1. After you have entered into a contract with us, you may request to cancel your order within seven (7) days of receiving your contract details (or at the start of the shipping date in case the delivery is delayed after the contract is established) in accordance with Article 13, Section 2 of the Act on the Consumer Protection in Electronic Commerce, etc. These procedures apply unless otherwise stipulated in the legislation regarding order cancellations.",
      "2. You are not eligible for refunds or exchanges after you have received the goods if one of the following conditions apply:",
      "  If the goods have been damaged or destroyed due to causes attributable to you (However, you are eligible to cancel your order if you had opened the packaging to examine the contents).",
      "  If the value of the goods has depreciated significantly due to partial or heavy use",
      "  If the value of the goods has depreciated significantly because a long period of time has elapsed, making it difficult to resell the goods",
      "  If the packaging has been damaged for goods that can be reproduced as identical counterfeits",
      "3. No restrictions apply to your cancellations request unless we have clearly outlined it in our cancellation policies in a way that is easy for you to understand under Subparagraphs 2 to 4 in Paragraph 2.",
      "4. You may cancel an order within three (3) months after receiving your order or within thirty (30) days of becoming aware that the goods and services were delivered in specifications that are different from how they were advertised or promised, regardless of the conditions outlined in Paragraphs 1 and 2.",
    ],
  },
  {
    title: "Article 16 (Effect of Cancellations)",
    content: [
      "1. We will provide refunds on payments already received within three (3) business days of the goods being returned by you. In case refunds are delayed, we are liable for late payment interest rates as set in Article 21, Section 2 of the Act on the Consumer Protection in Electronic Commerce, etc.",
      "2. We shall immediately contact relevant service operators to suspend or cancel the billing if you used credit cards, cryptocurrency, or others as your method of payment.",
      "3. In the event of a cancellation, you understand that you bear the burden of costs needed to return the goods already delivered. We do not charge cancellation fees nor claim damage compensation for canceled orders. However, we are liable for the costs of returning the goods if they were delivered in specifications that were different from how they were advertised or promised.",
      "4. We will clearly indicate which party bears the cost burden of canceled orders in case you paid the shipping fees when the goods were delivered.",
    ],
  },
  {
    title: "Article 17 (Protection of Personal Information)",
    content: [
      "1. We collect the minimum personal information required to render our services.",
      "2. We do not collect any information in advance for the fulfillment of purchase requests, upon account registration. However, this is not the case when collecting specific information that is necessary to verify your identity prior to accepting an order, in compliance with related laws and regulations.",
      "3. We must provide notice of our reasons when collecting and using your personal information and must obtain your consent.",
      "4. We are prohibited from using the collected personal information aside from the reasons stated here within, and we must notify you if any new needs arise that require the use of your personal information or if it needs to be shared with a third party. However, exceptions apply if stipulated in related laws and regulations.",
      "5. We shall clearly outline and notify you of the terms stipulated in Article 22, Section 2 of the Act on Promotion of Information and Communications Network Utilization and Information Protection when obtaining your consent regarding the conditions defined in Paragraphs 2 and 3. This includes information on the personal information manager (affiliation, name, phone number, other contacts), the purpose of information collection and use, and details on sharing the information with a third party (recipient, purpose of information-sharing, scope of information provided). You may withdraw your consent at any time.",
      "6. You may view or request to rectify errors in your personal information we hold at any time. We will comply with these requests without delay, and we will not use any personal information that has been asked to be corrected until the fixes have been applied.",
      "7. We will limit the number of people handling your personal information to a bare minimum to protect your privacy. We take full responsibility for all damages caused by the loss, theft, leak, unauthorized third-party access, and falsification of personal information, including credit card and bank account data.",
      "8. We and any third parties shall destroy all personal information without delay once we have fulfilled the purpose of their collection.",
      "9. We do not have pre-ticked checkboxes in our consent forms for the collection, use, and sharing of personal information. We will also clearly define the service limitations that apply to you in case you do not agree to our terms on the collection, use, and sharing of personal information. We do not reject account creation requests or restrict our services to you if you do not provide consent to our terms on the collection, use, and sharing of personal information that are not deemed essential.",
    ],
  },
  {
    title: "Article 18 (Obligations of the \"Online Store\")",
    content: [
      "1. We will not engage in any activities that are illegal, in violation of these terms and conditions, or disrupt public order. We shall be fully committed to providing continuous and reliable services as outlined in these terms and conditions.",
      "2. We shall have in place a security network to protect your personal information (including your financial data), and to ensure you can safely use of our internet services.",
      "3. We are liable to compensate you for any damages incurred through false labeling and advertising on goods and services, in accordance with Article 3 in the Act on Fair Labeling and Advertising.",
      "4. We will not send e-mail advertisements for the purpose of generating profits unless you have provided consent.",
    ],
  },
  {
    title: "Article 19 (ID and Password Obligations)",
    content: [
      "1. Aside from the exceptions defined in Article 17, account holders are responsible for managing the IDs and passwords to their customer accounts.",
      "2. Account holders should not allow any third parties to use their IDs and passwords.",
      "3. Account holder shall notify us and follow our instructions if their ID and password have either been stolen or if they are aware that a third party knows them.",
    ],
  },
  {
    title: "Article 20 (User Obligations)",
    content: [
      "You may not engage in the following actions:",
      "  Uploading false information upon registration or profile editing",
      "  Unauthorized the use of information belonging to others",
      "  Altering information posted on the online store",
      "  Uploading or posting other files and information (software and executables) aside from those designated by us",
      "  Violating our copyrights and patents or those of third parties",
      "  Defamation and obstruction of business against us or third parties",
      "  (vii) Uploading and publishing information that is obscene, violent, and otherwise disruptive to public order",
    ],
  },
  {
    title: "Article 21 (Relationship Between the \"Online Store\" and Affiliated Marketplaces)",
    content: [
      "1. When we are connected to affiliated marketplaces via hyperlink (e.g., hyperlinks containing text, stills, or moving images), we are classified as the main site and the latter is the subordinated page.",
      "2. We assume no responsibility for the transaction of goods and services that are offered independently on the affiliated marketplace, as long as we state these terms through a pop-up window notice when connecting to the linked site.",
    ],
  },
  {
    title: "Article 22 (Copyright Ownership and Restrictions on Its Use)",
    content: [
      "1. We retain all copyrights and patents concerning all works we created.",
      "2. You may not utilize any information obtained from using our online store that is subject to copyright protection. You may not copy, send, publish, distribute, and broadcast information belonging to us without our consent, for commercial purposes or for sharing with a third party.",
      "3. We must notify you in case of unauthorized use of your copyrighted content, in accordance with these terms and conditions.",
    ],
  },
  {
    title: "Article 23 (Settlement of Disputes)",
    content: [
      "1. We will establish and operate a damage compensation settlement body to handle your legitimate suggestions and complaints and provide compensation for damages if necessary.",
      "2. We will prioritize addressing your complaints and suggestions, but in case of difficulties processing them in an expedient manner, we will inform you of the reasons and the processing schedule.",
      "3. When you request compensation for damages stemming from an e-commerce dispute with our online store, settlements may be subject to mediation by the Korea Fair Trade Commission or other arbitration bodies on the municipal/provincial level.",
    ],
  },
  {
    title: "Article 24 (Jurisdictions and Governing Law)",
    content: [
      "1. Litigation resulting from an e-commerce dispute between our online store and yourself should be filed in the jurisdiction that applies to your home address. If you have no permanent address, it should be filed in the jurisdiction of your current residence. If your address and living arrangements are unclear, or if you are a foreign resident, jurisdiction will be determined in accordance with the Civil Procedure Act.",
      "2. The laws of the Republic of Korea apply to e-commerce lawsuits between the online store and users.",
    ],
  },
];

export default function KimMatinTerms() {
  return (
    <section className="sub-section km-support-page">
      <div className="inner qna-page">
        <div>
          <div className="qna-inner">
            <KimMatinSupportNav />

            <div className="qna-content km-terms-content">
              <h2>T&amp;C</h2>

              <div className="terms-box">
                {terms.map((item) => (
                  <div className="term-item" key={item.title}>
                    <h3>{item.title}</h3>

                    {item.content.map((text, index) => (
                      <p className={text.startsWith("  ") ? "is-indent" : ""} key={`${item.title}-${index}`}>
                        {text.trim()}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
