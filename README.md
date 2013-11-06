SofiaParkingHelper
==================

Hybrid mobile app that helps with parking in city of Sofia (Bulgaria)

Parking in the city of Sofia (Bulgaria) in the central parts of the city is devided in two zones,
green zone and blue zone, and payment through sms is required to park there, otherwise the vehicle 
is removed and taken to special parkings and fine is issued. Outside of the green and blue zones parking is free.

The idea behind this application is to help the users identify in which parking zone they are and in the future,
to send sms to the number for the appropriate zone.
User position is aquired through geolocation api, zones are predefined polygons using the google maps static api and
check is performed to identify if user is in some of the zones so it could be useful for other cities in the future, if
there is similar parking zone system.
The application allows the user to remember where he/she has parked and marks that point on the map, also tracks the
current position and points to the parking point in case the user has forgotten where the car is :)
To further ensure easy finding of the vehicle there is option to use the camera to take a picture of the parking position,
which can also be useful in malls and other underground parkings with cell numbers.

This is a hybrid (apache cordova) mobile application written in javascript, html and css, 
with Icenium IDE and kendoui mobile.
