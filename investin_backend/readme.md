# User Schema

The `User` schema represents the essential information about users in the system. Users can be either founders or investors.

## Schema Fields

| Field Name  | Type     | Description                                     | Required | Unique | Default   |
|-------------|----------|-------------------------------------------------|----------|--------|-----------|
| `username`  | String   | The name of the user.                           | Yes      | No     |           |
| `email`     | String   | The user's email address.                      | Yes      | Yes    |           |
| `password`  | String   | The user's password (hashed).                  | Yes      | No     |           |
| `role`      | String   | The role of the user, either "founder" or "investor". | No       | No     | "investor" |
| `timestamps`| Date     | Automatically managed creation and update timestamps. | No | No   |           |

## Schema Description

- **username**: This field stores the name of the user. It is a required field and must be a string.
- **email**: This field stores the user's email address. It is required, must be unique, and is used as a primary means of identifying users.
- **password**: This field stores the user's password. The password is required and should be stored in a hashed format for security.
- **role**: This field defines the role of the user within the system. It can either be "founder" or "investor", with a default value of "investor".
- **timestamps**: These fields (`createdAt` and `updatedAt`) are automatically managed by Mongoose and track when the user document was created and last updated.

## Enum Description for `role` Field

- `"founder"`: Indicates that the user is a founder of a startup.
- `"investor"`: Indicates that the user is an investor. This is the default value if no role is specified.

## Example Document

```json
{
  "username": "JohnDoe",
  "email": "johndoe@example.com",
  "password": "$2b$10$EixZaYVK1fsbw1Zfbx3OXePaWxn96p36e3Z4E.ycvz1gB9Jbf8yQC", // hashed password
  "role": "founder",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```
<br>
<br>

# Investor Schema

The `Investor` schema represents a collection of information about investors and their associated details.

## Schema Fields

| Field Name            | Type                         | Description                         | Required | Default      |
|-----------------------|------------------------------|-------------------------------------|----------|--------------|
| `admin_id`            | ObjectId (Reference)         | References a user ID                | No       |              |
| `companyName`         | String                       | Name of the company                 | Yes      |              |
| `companyGovtVerifiedNo`| String                      | Government verified number of the company | Yes  |              |
| `logo`                | String                       | URL or path to the company's logo   | No       |              |
| `keyPeople`           | Array of Objects             | Key people in the company           | No       |              |
| - `name`              | - String                     | Name of the key person              | Yes      |              |
| - `position`          | - String                     | Position in the company             | No       |              |
| - `role`              | - String                     | Role in the company                 | No       |              |
| - `info`              | - String                     | Additional information              | No       |              |
| `companiesInvested`   | Array of Objects             | Companies invested in by the investor | No    |              |
| - `cname`             | - String                     | Name of the invested company        | Yes      |              |
| - `cimages`           | - Array of Strings           | Images related to the invested company | No  |              |
| - `info`              | - String                     | Information about the investment    | No       |              |
| - `holdingShare`      | - Number                     | Shareholding percentage             | No       |              |
| `briefInfo`           | String                       | Brief information about the investor | No      |              |
| `contact`             | String                       | Contact number                      | Yes      |              |
| `email`               | String                       | Email address (unique)              | Yes      |              |
| `address`             | Object                       | Address information                 | Yes      |              |
| - `city`              | - String                     | City of residence                   | Yes      |              |
| - `state`             | - String                     | State of residence                  | Yes      |              |
| - `country`           | - String                     | Country of residence                | Yes      |              |
| - `pincode`           | - String                     | Postal code                         | Yes      |              |
| `likes`               | Number                       | Number of likes                     | No       | 0            |
| `createdAt`           | Date                         | Timestamp of creation               | No       | Auto-set     |
| `updatedAt`           | Date                         | Timestamp of last update            | No       | Auto-set     |

## Schema Description

- **admin_id**: This field is a reference to a user's ID, linking the investor to a specific administrator.
- **companyName**: The name of the investor's company.
- **companyGovtVerifiedNo**: A government-issued number verifying the company.
- **logo**: The logo of the company, stored as a string which could be a URL or file path.
- **keyPeople**: An array of objects containing information about key people in the company.
  - **name**: The name of the key individual.
  - **position**: Their position in the company.
  - **role**: Their role within the company.
  - **info**: Additional information about the individual.
- **companiesInvested**: An array of objects detailing companies in which the investor has invested.
  - **cname**: The name of the company.
  - **cimages**: An array of strings representing images related to the company.
  - **info**: Information about the investment in the company.
  - **holdingShare**: The percentage shareholding in the company.
- **briefInfo**: A brief description of the investor.
- **contact**: The contact number for the investor.
- **email**: The unique email address of the investor.
- **address**: An object containing the address details of the investor.
  - **city**: The city where the investor is based.
  - **state**: The state where the investor is based.
  - **country**: The country where the investor is based.
  - **pincode**: The postal code of the investor's address.
- **likes**: A number representing how many likes the investor has received.
- **timestamps**: Automatically managed fields indicating when the document was created and last updated.




<br>
<br>

# Startup Schema

The `Startup` schema represents a collection of information about startup companies and their associated details.

## Schema Fields

| Field Name          | Type                         | Description                                     | Required | Default      |
|---------------------|------------------------------|-------------------------------------------------|----------|--------------|
| `admin_id`          | ObjectId (Reference)         | References the user ID of the admin             | No       |              |
| `logo`              | String                       | URL or path to the startup's logo               | No       |              |
| `email`             | String                       | Unique email address of the startup             | Yes      |              |
| `keyPeople`         | Array of Objects             | Key individuals in the startup                  | No       |              |
| - `name`            | - String                     | Name of the key individual                      | Yes      |              |
| - `position`        | - String                     | Position in the startup                         | No       |              |
| - `role`            | - String                     | Role in the startup                             | No       |              |
| - `info`            | - String                     | Additional information about the individual     | No       |              |
| `companyInfo`       | String                       | Detailed information about the startup          | No       |              |
| `shareholderPattern`| Array of Objects             | Information about shareholders                  | No       |              |
| - `investor`        | - String                     | Name of the investor firm                       | Yes      |              |
| - `holdingPercentage` | - Number                   | Percentage of shares held by the investor       | Yes      |              |
| `domain`            | String                       | The business domain or industry of the startup  | Yes      |              |
| `clients`           | Array of Objects             | Clients of the startup                          | No       |              |
| - `clientName`      | - String                     | Name of the client                              | Yes      |              |
| - `work`            | - String                     | Description of work done for the client         | No       |              |
| - `images`          | - Array of Strings           | Images related to the client                    | No       |              |
| - `info`            | - String                     | Additional information about the client         | No       |              |
| `interestedVC`      | Array of Objects             | Venture capitalists interested in the startup   | No       |              |
| - `investorId`      | - ObjectId (Reference)       | Reference to the `Investor` schema              | No       |              |
| `pitch`             | String                       | Pitch or presentation information               | No       |              |
| `contact`           | String                       | Contact number for the startup                  | Yes      |              |
| `equityOffered`     | Number                       | Percentage of equity offered                    | Yes      |              |
| `likes`             | Number                       | Number of likes received by the startup         | No       | 0            |
| `createdAt`         | Date                         | Timestamp of creation                           | No       | Auto-set     |
| `updatedAt`         | Date                         | Timestamp of last update                        | No       | Auto-set     |

<br>
<br>

## Schema Description

- **admin_id**: This field references the user ID of the admin managing the startup.
- **logo**: This field stores the URL or path to the startup's logo.
- **email**: This field is the unique email address of the startup.
- **keyPeople**: This field is an array of objects representing the key individuals in the startup.
  - **name**: The name of the individual.
  - **position**: Their position in the startup.
  - **role**: Their role within the startup.
  - **info**: Additional information about the individual.
- **companyInfo**: This field contains detailed information about the startup.
- **shareholderPattern**: This field is an array of objects detailing the shareholder pattern.
  - **investor**: The name of the investor firm.
  - **holdingPercentage**: The percentage of shares held by the investor, ranging from 0 to 100.
- **domain**: This field indicates the business domain or industry of the startup.
- **clients**: This field is an array of objects representing the clients of the startup.
  - **clientName**: The name of the client.
  - **work**: A description of the work done for the client.
  - **images**: An array of strings representing images related to the client.
  - **info**: Additional information about the client.
- **interestedVC**: This field is an array of objects representing venture capitalists interested in the startup.
  - **investorId**: A reference to the `Investor` schema.
- **pitch**: This field contains information related to the pitch or presentation of the startup.
- **contact**: This field is the contact number for the startup.
- **equityOffered**: This field indicates the percentage of equity offered by the startup, ranging from 0 to 100.
- **likes**: This field represents the number of likes received by the startup.
- **timestamps**: Automatically managed fields indicating when the document was created and last updated.

<br>
<br>

# Partnership Schema
The `Partnership` schema represents the details of partnerships or agreements between startups and investors.

## Schema Fields

| Field Name           | Type                         | Description                                                     | Required | Default  |
|----------------------|------------------------------|-----------------------------------------------------------------|----------|----------|
| `startupId`          | ObjectId (Reference)         | References the ID of the startup involved in the partnership    | Yes      |          |
| `investorId`         | ObjectId (Reference)         | References the ID of the investor involved in the partnership   | Yes      |          |
| `equity`             | Object                       | Details about the equity offered in the partnership             | Yes      |          |
| - `offered_percentage` | - Number                   | Percentage of equity offered in the partnership                 | Yes      |          |
| - `amount`           | - Number                     | Monetary amount of the equity offered                           | Yes      |          |
| `date_of_agreement`  | Date                         | Date when the partnership agreement was made                    | Yes      |          |
| `company_agreed`     | Boolean                      | Whether the investor company has agreed to the partnership      | No       | false    |
| `startup_agreed`     | Boolean                      | Whether the startup has agreed to the partnership               | No       | false    |

## Schema Description

- **startupId**: This field references the ID of the startup involved in the partnership. It links to the `startups` collection.
- **investorId**: This field references the ID of the investor involved in the partnership. It links to the `investor` collection.
- **equity**: This is an embedded object detailing the equity aspects of the partnership.
  - **offered_percentage**: The percentage of equity being offered in the partnership. This is a required field and must be a numeric value.
  - **amount**: The monetary value of the equity offered. This is a required field and must be a numeric value.
- **date_of_agreement**: The date on which the partnership agreement was formalized. This is a required field and should be a date object.
- **company_agreed**: A boolean flag indicating whether the investor company has agreed to the terms of the partnership. The default value is `false`.
- **startup_agreed**: A boolean flag indicating whether the startup has agreed to the terms of the partnership. The default value is `false`.

## Example Document

```json
{
  "startupId": "60a7c5f9b0e2d834dcd2f8e5",
  "investorId": "60a7c5f9b0e2d834dcd2f8e6",
  "equity": {
    "offered_percentage": 10,
    "amount": 500000
  },
  "date_of_agreement": "2023-05-15T00:00:00.000Z",
  "company_agreed": true,
  "startup_agreed": false
}

