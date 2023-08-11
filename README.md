# Dining Management System for RUET

**Streamlining Student Dining Experience**

## Introduction

The RUET Dining Management System is a comprehensive and efficient web-based platform designed to streamline and enhance the dining experience for the entire Rajshahi University of Engineering & Technology (RUET) community. This system is intended to address the challenges faced by students, faculty, and staff in managing their dining needs, ensuring a seamless and convenient process for meal planning, ordering, and serving.

## Dining Management System of RUET

In the present scenario, the dining system at Rajshahi University of Engineering & Technology (RUET) is primarily managed manually, which poses several challenges for the students and administrative authorities. Students are required to physically visit the dining facilities daily to purchase meal tokens, leading to time-consuming processes. Moreover, this manual token purchase system proves to be problematic for many students, particularly those residing off-campus, as they face difficulties in timely access to tokens. Furthermore, the absence of a reliable method to predict the precise quantity of each food item required for each meal poses a challenge for the dining facility's management.
The proposed RUET Dining Management System seeks to address these issues comprehensively. By leveraging modern technology, this system aims to streamline and optimize the dining experience for the entire RUET community. Through the implementation of an online token booking feature, students will have the convenience of reserving their meal tokens digitally. This enhancement is expected to significantly alleviate the inconvenience faced by students in obtaining tokens daily.
Furthermore, the system introduces a precise and data-driven approach to meal planning and inventory management. By allowing students to specify their meal preferences during the token booking process, the system will accumulate valuable data on individual item preferences. As a result, the administrative authorities will be empowered with accurate insights into the exact quantities of each food item required for every meal. This data-driven approach will enable the dining facility to efficiently plan and allocate resources, minimizing wastage and ensuring sufficient availability of preferred items.

### Landing Page

Anyone can visit the website by typing ‘https://ruetdining.web.app/’ and he will be redirected to the landing page provided below. From there he can select the ‘Order Now’ button to be redirected to the Log In page.

### Log In and Sign-Up Page

In the Log In page one can provide his email and password to log into his account or click the ‘Sign Up’ button to create a new account. One can toggle between the log in and sign-up page by clicking the sign up and log in button respectively. After anyone logs in, the system will automatically decide whether he has logged in as an admin or as a student and redirect to the desired page accordingly. 

## Log in as a student


If someone logs in as a student he will be displayed the following pages:

- **Order Meal Page**: After anyone logs in as a student, he will be redirected to the student dashboard (Order Meal) page, from where he can choose his desired hall and select lunch/dinner to see which items are available.Any hall can be selected by clicking the ‘Select Hall’ dropdown button.Selected hall name and available item for lunch/dinner for that hall on that particular date will be displayed in the order meal page.There is a ‘Add to Cart’ button in each item, if clicked, the item will be added to cart and the button will display ‘Added to Cart’. One can click the button multiple times to increase the amount of that item.
- **Order History Page**: In this page students will get a QR code containing their order id which they need to scan when the order is served. Order id will be different for each individual order.
- **Cart Page**: In the cart page, students will be able to see their selected item for lunch and dinner and can confirm the order by clicking the ‘Make Payment’ button. Any item can be removed by clicking the remove icon present beside any item.
- **Log Out Page**: Lastly students can log out from their account by clicking the ‘Log Out’ button.

## Log In as an Admin

If someone logs in as an admin he will be displayed the following pages:

- **Order Page**: If any admin logs in, he will be redirected to the ‘Order’ page where he can see the order status of lunch and dinner for that day such as how many orders are served so far and how many is pending, how many item is required for any particular item etc.Here he can also see the remaining order items, available items and unavailable items. He can edit any item such as change item’s name, price and availability by clicking the ‘Edit Item’ button. He can make any unavailable item available by clicking the ‘Make the Item Available’ button.Admin can add any new item by clicking the add icon present at the bottom right side of the order page. There he will need to provide the name of the item, price of the item, picture of that item. The item will be automatically considered as an lunch item if the lunch page is selected or vice versa. 
- **Scan QR Page**: In the scan QR page, the camera will open automatically and wait for the QR code to be scanned. There is button on the top which can be clicked and toggle between lunch and dinner.After the QR is scanned, the order id input form will be filled up automatically with the order id, then the admin needs to click the search button to search for the order.If the order id is valid, it will show the ordered items against that order id, otherwise it will show a message ‘Invalid Order Id’. If someone tries to scan the same order id twice, then it will also show the message ‘Invalid Order Id’. ‘Scan Another QR’ button can be clicked to scan another QR code.
- **Log Out Page**: The admin can log out by clicking the ‘Log Out’ button.

## Implemented Algorithms

These are the following algorithms that are implemented in this project:

- **User Identity Protection**: To safeguard user privacy, the system implements an algorithm that masks personal identities within the database. Even in the event of a data breach or compromise occurs, hackers cannot access specific user identities, ensuring the confidentiality of user information.
- **Order Validation and Security**: The system employs robust algorithms to validate orders and prevent unauthorized access. Each QR code is unique and serves as a secure verification token, ensuring that only valid orders are processed while maintaining the anonymity of the users.

## Development Tools

- **HTML**:Markup language for structuring web pages.
- **CSS**:Styling language for designing an intuitive and visually appealing interface.
- **javaScript**:Programming language for implementing interactive functionalities and improving user experience.
- **Bootstrap**:Front-end framework for creating responsive and mobile-friendly designs.
- **Firebase**:Backend service used for data storage, user authentication, and real-time database updates, with robust security measures to protect user data.

## Getting Started

- Firstly clone this repository from github
- Install Noje js in your local machine
- Install Visual Studio Code
- Go to the root directory of the project and open the terminal and run the command 'npx webpack'
- Install 'Live Server' extension 
- Go live with the installed 'Live Server' extension and the project will run




---

