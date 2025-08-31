<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  <b>Property Management System - Backend</b><br/>
  A scalable, modular, and secure backend system for managing real estate properties, built with <a href="http://nestjs.com/" target="_blank">NestJS</a> following Clean Architecture principles.
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank">
  <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
</a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank">
  <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
</a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank">
  <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
</a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank">
  <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
</a>
<a href="https://discord.gg/G7Qnnhy" target="_blank">
  <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
</a>
</p>

---

## 📌 About the Project  

The **Property Management System (PMS)** is a complete solution for **real estate and property management** that includes:  
- **3 Web Dashboards**:  
  - **Admin & Supervisors Dashboard** for managing system operations, approvals, financials, complaints, and monitoring statistics  
  - **Brokers / Office Managers Dashboard** for managing offices, properties, bookings, payments, and advertisements  
  - **Service Providers Dashboard** for managing and offering property-related services (maintenance, furnishing, cleaning, etc.)  
- **Mobile Application** for end-users to explore, book, and manage properties and tourist places  
- **Role-based permissions** with secure authentication  
- **Payment and invoicing system** supporting online and manual payments  
- **Real-time notifications, support requests, and reporting system**  
- **Service providers management** for additional services related to properties 

### 🏠 Entry Point (Landing Single Page)  
When accessing the platform for the first time, users are welcomed with a **landing single page** that showcases:  
- **Top 5 Brokers/Offices**  
- **Top 5 Service Providers**  
- **Contributors/Developers** who worked on the project  

From this entry page, the user can decide to either:  
- **Visit the Mobile Application** to explore properties and tourist places as an end-user  
- **Join as a Broker (Office Manager) or Service Provider** by submitting office/service details along with a verification document.  
  - The request is then sent to the **Admin Dashboard** for review and can be **approved or rejected**.  

The system is built using **Domain-Driven Design (DDD)** and **Clean Architecture** for scalability and maintainability.  

---

## 🔺 Features  

### Users (Mobile App)
- Browse **brokers/offices**  
- Browse **tourist places**  
- Browse **residential and tourist properties**  
- **Filter and search**  
- **Compare two properties or tourist places**  
- **Book a property or tourist place**  
- **Notifications**  
- **My Bookings**  
- **Profile management**  
- **Explore and Trending properties**  
- **Ads display**  
- Browse **service providers** and **book services**  
- **Request support**  
- **Rate **  
- **Submit complaints**  
- **Favorites**  
- **Post custom property requests**  
- **View related properties**  
- **360° property view**  

### Office Managers
- Add and edit **office details**  
- Add, update, and manage **properties**  
- View **office statistics**  
- Filter and view **my properties** and **tourist places**  
- Manage **bookings, rents, and fees**  
- Configure **payment methods** (online or manual)  
- Manage **ads** and respond to requests  
- Request **services** and **support**  

### Service Providers
- Add and edit **service details** (e.g., cleaning, maintenance, landscaping)  
- **Activate or deactivate** services  
- Manage **service availability**  
- Handle **support requests** from users and offices  
- View **service-related bookings and requests**  


### Supervisors
- Review requests and approvals  
- Register in the system  
- Review office requests  
- View all offices and services  
- Manage properties, posts, and ads  
- Monitor financial records  
- Handle complaints and support  
- Generate **statistics and reports**  

### Supervisor Permissions
- **Manage offices and service providers**  
  - Global (all regions)  
  - Specific region  
- **Manage finances and ads**  
- **Manage user requests and posts**  
- **Handle complaints and support**  
- **Monitor system statistics**  

### Admin / Manager
- Manage **supervisors**  
- Oversee **financial operations**  

---

## 🏗 Dashboards  

The system provides **3 main web dashboards**:  

1. **Admin & Supervisors Dashboard**  
   - Manage supervisors and permissions  
   - Handle financial operations and advertisements  
   - Review and approve office and property requests  
   - Manage complaints, notifications, and system statistics  

2. **Broker / Office Manager Dashboard**  
   - Add, update, and manage **properties** (for sale, rent, tourist places)  
   - Track bookings, payments, and office statistics  
   - Manage advertisements and respond to user requests  
   - Request support or services and update office details  

3. **Service Providers Dashboard**  
   - Add and manage **service details** (e.g., maintenance, furnishing, cleaning)  
   - Activate or deactivate services  
   - Access **support center** for handling requests and issues  

---

## 🔄 Mobile App Flow  

### 1. User Registration & Authentication
- Users can **create a new account** with email and password.  
- A **verification code** is sent to the email for confirmation.  
- Users can **login** after verifying their email or continue as **guest users**.  

### 2. Browsing & Interaction
- Browse **properties and tourist places**  
- Compare **two properties or places** in terms of details  
- Add **residential or tourist properties** to favorites  
- Browse **service providers** if they offer services related to the property  
- Create a **custom property request** by posting:  
  - Desired **budget**  
  - Preferred **location**  
  - Additional **description/details**  

### 3. Booking / Purchasing Residential Property
- User selects a property and makes a **reservation with a deposit**  
- Payment can be **online** or **manual**, depending on the office configuration  
- If **installments** are allowed, invoices are generated for each installment  
- If paying **full amount**, a **single invoice** is created  
- Property status updates after **last installment or full payment**  

### 4. Notifications & Updates
- Users receive **real-time notifications** for bookings, payments, and property updates  
- Users can mark notifications as **read/unread**  

---

### 🏡 Booking & Rental Scenarios  

#### 1. Buying a Residential Property  
- User selects a **property for sale**.  
- User can pay a **deposit** (online or manual, depending on office settings).  
- If **installments** are supported:  
  - System generates multiple invoices (based on installment count).  
- If **full payment** is chosen:  
  - A single purchase invoice is generated.  
- Property status is updated after the **final payment** is completed.  
- All invoices are available in the **Owned Properties** section.  
- For online payments, the system generates a **PDF invoice** for the user.  

#### 2. Renting a Residential Property  
- User selects a **property for rent** (configured as **monthly** or **yearly** by the office).  
- User specifies the **rental period** (number of months or years).  
- A **deposit invoice** is generated.  
- Additional invoices are created for each **rental month/year**.  
- User can pay invoices **online or manually**, depending on the office settings.  
- Invoices are displayed under the **Rented Properties** section.  
- For online payments, a **PDF invoice** is automatically generated.  

#### 3. Booking a Tourist Place  
- User selects a **tourist place** and chooses a range of **consecutive days**.  
- System generates two invoices:  
  - **Deposit invoice**  
  - **Rental invoice** for the selected days  
- Payments can be processed online or manually.  

---

### 🏢 Office Manager Dashboard  

The **Office Manager Dashboard** provides real estate brokers with a complete control panel to manage their offices, properties, and bookings:  

#### 📊 Dashboard Overview  
- View **office information** and details.  
- Track **number of properties** categorized by **rent, sale, or tourist places**.  
- Monitor **warnings/violations** assigned to the office.  
- View **financial earnings and statistics**.  

#### 🏘️ Property & Tourist Place Management  
- Add a **new property** with detailed information and upload property images.  
  - The property is sent for **Admin review and approval** before being published.  
- Add **new tourist places** with the same approval process.  
- Filter and manage properties by:  
  - **Status** (available, booked, sold, etc.)  
  - **Province**  
  - **Region**  

#### 📅 Bookings & Invoices  
- Track **property bookings** made by users.  
- Upload **manual payment documents** if payment was not electronic.  
- Manage **rental bookings** and upload supporting invoices for manual payments.  
- For **tourist place bookings**:  
  - View details per month.  
  - Track booked vs. available days.  
  - Access related **financial records**.  

#### 📌 Requests & Ads  
- Review **user requests** and suggest suitable properties based on their needs.  
- Submit requests for **advertising campaigns** (image or promotional ads).  
  - Ads require **Admin approval** before publishing.  
  - Payments for ads can be processed electronically.  

#### ⚙️ Office Settings & Notifications  
- Update and manage **office profile details**.  
- Access and manage **office notifications**.  

---

## 🛠️ Admin & Supervisors Dashboard  

### 🔹 Overview Dashboard  
- Accessible only by the **Director (Admin)** or a **Supervisor** with **system monitoring permissions**  
- Displays system-wide statistics:  
  - Total **users**, **supervisors**, **brokers/offices**, and **service providers**  
  - Total number of **properties** (for sale, for rent, tourist places)  
  - Total number of **ads**  
  - **Top-rated offices** and **top-rated service providers**  

---

### 🔹 User Management (Director Only)  
- Add new **supervisors**  
- Assign or edit **permissions** for supervisors  
- Delete supervisors if necessary  

---

### 🔹 Financial Management  
- Accessible by **Director** or **Supervisors** with **financial permissions**  
- Manage and review:  
  - **Advertisement requests** (image-based or promotional)  
  - **Invoices** related to advertisements  
- Approve or reject **ad requests** submitted by offices  

---

### 🔹 Office & Service Providers Management  
- Accessible by **Director** or **Supervisors** with **broker management permissions**  
- Manage **offices** and their submitted content:  
  - Review and approve/reject **new property posts** submitted by offices  
  - View all **offices** with their related properties  
- Manage **service providers**:  
  - View all service providers and their active/inactive services  
- Review **user property requests** (posts created by users requesting properties with budget, location, and details)  

---

### 🔹 Notification Center  
- Accessible by **Director** or **Supervisors** with **system monitoring permissions**  
- View all system notifications  
- Send new notifications to users, offices, or service providers  

---

### 🔹 Complaints Management  
- Accessible by **Director** or **Supervisors** with **complaints management permissions**  
- Review complaints submitted by users against offices  
  - View complaint details (office, user, reason)  
  - Approve or reject the complaint  
  - If approved, the office receives a **warning** (appears in the office dashboard)  

---

### 🔹 Support Center  
- Platform-wide **Q&A management**  
- Add or edit **questions and answers** related to platform usage  
- Provide support resources for users, offices, and service providers  

---

## 🛠 Tech Stack  

- **Backend Framework**: [NestJS](https://nestjs.com/)  
- **Database**: PostgreSQL (via [TypeORM](https://typeorm.io/))  
- **Authentication**: JWT  
- **Mobile App**: Flutter / React Native (based on project setup)  
- **Payments**: Stripe & Manual payments  
- **Notifications**: Firebase  
- **Validation**: Class-validator & Pipes  
- **API Documentation**: Swagger  

---

## ⚙ Installation & Setup  

```bash
# Clone the repository
git clone https://github.com/OnlyAbdullh/Property-Management-System-BackEnd.git

# Navigate into the project
cd Property-Management-System-BackEnd

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database seeder
npm run seed

# Start the application in watch mode
npm run start:dev
```

**## 🔑 Environment Variables  

Create a `.env` file in the root directory and add the following:  

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=yourDatabaseName
DB_SYNCHRONIZE=true

#Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourEmail
SMTP_PASS=YourPassword

# JWT
JWT_TOKEN_SECRET=yourGeneratedToken
JWT_TOKEN_EXPIRES_IN=1h

JWT_REFRESH_TOKEN_SECRET=yourGeneratedToken
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

#Stripe
STRIPE_SECRET_KEY=yourSecretKey
STRIPE_WEBHOOK_SECRET=yourSecretKey

#Firebase Configuration
FIREBASE_CONFIG_PATH=src/infrastructure/config/firebase/your-credential-file-name.json
```
## Api Swagger Documenetation 
http://localhost:3000/api/docs



## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
