# Search and Insert REST API

## Requirement

1. Design database where following user information is stored
- First name and last name (Both are mandatory)
- Email, Mobile number (Both should be unique, Mandatory, Valid Email, Valid 10 digit number)
- Birthdate (Optional)
- Addresses (One user can have multiple addresses, At least one address is mandatory)
    - Address line 1 (Mandatory)
    - Address line 2 (Optional)
    - Pincode (Mandatory, should be min 4 length digit, max 6 length digit)
    - City (Mandatory)
    - State (Mandatory)
    - Type (Home or Office)

2. REST API endpoint to search users (Only endpoint, no need for screen)
- Add search endpoint with following filter (Endpoint should return all users matching filters)
- Search by string (on first name, last name, email).
    - If one of three fields contains a given string as substring record is considered matched
- Search is case insensitive
- Search on Age
    - Ex. should able to search a user with age 25 years greater equal
    - Ex. should able to search users with ageless equal than 21 years
- Search by City
    - Ex. I send “Mumbai” then a user with one of the addresses of Mumbai is returned
- Note: If multiple filters are applied then users matching all filters are returned only.
    - Ex. send “Mumbai” and age greater equal 18. Then all users with “Mumbai” city address and age greater equal to 18 are returned.
- Make sure filters are performed using database query instead of in-memory filter
3. REST API endpoint to update the user information (including address)
    - Proper validation has been done

## Installation

In the project directory, you can run:

### `npm run app.js` OR `nodemon app.js`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `GET` Endpoint:
If you hit the /users endpoint with the query parameters, you'll be able to search for the user information in the connected database. 

***You can you the browser to search for the query and recieve the response in the Network tab. You can also use Postman and form your query.***

***Example:
`localhost:3000/users?searchString=Carilyn&ageMin=2&ageMax=15&city=Mumbai`***

You can pass the following parameters for the search query:\
`searchString` used to search for a keyword in the First Name, Last Name and Email feilds.\
`ageMin` used to find the users above this age limit\
`ageMax` used to find the users below this age limit\
`city` used to search in the City feild

#### `POST` Endpoint:

If you hit the /users endpoint with proper body format, you'd be able to enter a new user in the database.

***You will be using Postman to hit the API, set it to POST mode and go to Body tab and enter the input data in RAW JSON format.***

***Example: 
`{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "mobileNumber": "9876793285",
    "birthdate": "1990-01-01",
    "addresses": [
        {
            "addressLine1": "123 Main St",
            "addressLine2": "Apt 4B",
            "pincode": "12345",
            "city": "New York",
            "state": "NY",
            "type": "home"
        },
        {
            "addressLine1": "456 Market St",
            "addressLine2": null,
            "pincode": "54321",
            "city": "San Francisco",
            "state": "CA",
            "type": "office"
        }
    ]
}`***

You can pass the following parameters in the JSON body:\
`firstName` string, mandatory
`lastName` string, mandatory
`mobileNumber` numeric, mandatory and unique
`birthdate` date in yyyy/mm/dd format, optional
`email` strind, madatory and unique
`addresses` array of JSON used to input multiple addresses for a single user
`addressLine1` string, mandatory
`addressLine2` string, optional
`pincode` numeric, length should be between 4 and 6, mandatory
`city` string, mandatory
`state` string, mandatory
`type` string, mandatory, should be among 'Home' and 'Office'

### `npm install`

Command used to install all the necessary packages on the local machine or the server.