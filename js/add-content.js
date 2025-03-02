//
//  js.js
//  
//
//  Created by Mateo Carnavali on 3/1/25.
//
var today = new date();
var hourNow = today.getHours();
var greeting;

if (hourNow > 18) {
    greeting ='Good evening';
} else if (hourNow > 12) {
    greeting = 'Good afternoon!';
} else if (hourNow > 0) {
    greeting = 'Good morning!;
} else {
    greeting = 'Welcome to the LGBTQ+ Project';
}
document.write('<h3>' + greeting + '</h3>');


