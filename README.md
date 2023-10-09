# User Routes

## ./users/register: POST

body should include: fullName, email, password, phoneNumber & address. Only status and message returned as response

## ./users/login: POST

body should include: email, password. status, message, 'token' and 'redirectUrl' returned. USE TOKEN FOR USER/ADMIN Specific routes. token should be in authorization header when sent. Use redirectUrl to redirect user from login page to the url provided in response.

## ./users/logout: GET

logout button only to show if user/admin is logged in. 'redirectUrl' will be returned to client to login page to redirect client
INVALIDATE/REMOVE THE JWT FROM LOCAL STORAGE OR COOKIES UPON SENDING THIS REQUEST (CLIENT SIDE) 

## ./users/user-details: GET

details will be in body key name 'data'
token missing = redirectUrl to login page

## ./users/update-user-details: PUT

token missing = redirectUrl to login page
Updates to be done one by one. meaning if phone number is to be updated the put request should include 'phoneNumber'.
If password then 'oldpassword' 'newpassword'. for name use 'fullName'. 'address' for address

LOGIN SAME FOR BOTH ADMIN AND USER

# Admin Routes

## ./admin/admin-dashboard: GET

returns user and restaurant tables json like:
    'data': {
         'users': userData,
         'restaurants': restaurantData,
    }
    display in tables.

## ./admin/search-user: GET

search by email or phone_number include either in json body

## ./admin/search-restaurant: GET

same as above

## ./admin/add-restaurant: POST

request body must include {email, password, restaurantName, address, phone_number, website}

## ./admin/remove-user: DELETE

include {UserID} in request body. recommended to search first and then delete.

## ./admin/remove-restaurant: DELETE

include {RestaurantID} in req body. recommended to search first then delete.

# Restaurant Routes

## ./restaurants/restaurantLogin: POST

