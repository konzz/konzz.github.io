---
layout: post
title:  "AngularJS + Firebase Calendar"
date:   2014-09-15 17:33:31
tags: angularjs firebase
---

[AngularJS][] and [Firebase][] do a very good combo to do real time apps. Since AngularJS ofers you a good framework with double-data-binding Firebase ofers a realtime-database, also firebase has [AngularFire][] to make them work together perfectly.

So I created a calendar that works with Firebase so sync the events between different clients. This is the bower.json with the dependencies.

```javascript
{
  "name": "calendar",
  "version": "1.0.0",
  "dependencies": {
    "angular": "1.2.15",
    "angular-ui-calendar": "latest",
    "angular-ui-date": "latest",
    "jquery": "1.9.0",
    "firebase": "1.0.21",
    "angularfire": "0.8.2",
    "bootstrap": "3.0.3"
  }
}
```

We will use the [angular-ui-calendar][] that mixes [fullcalendar][] with angular, and [angular-ui-date][] for the datepickers.

Lets start by creating an angular controler

```javascript
angular.module('calendar', ['ui.calendar', 'ui.date', 'firebase'])
.controller('calendar', ['$scope', '$firebase', function($scope, $firebase){
    $scope.events = [[]];
}]);
```

angular-ui-calendar expects the events to be an array "event sources", and those event sources can be arrays, functions, or urls thar return a json of events. We will use an array, so for now we set events as an array inside of an array. Add the calendar to the view

```javascript
<div ui-calendar ng-model="events"></div>
```
  
Now, we will a form to add new events, that will look like:

```javascript
<form ng-submit="addEvent()">
  <input ng-model="newEvent.title" type="text" placeholder="Title">
  <input ui-date ui-date-format="DD, d MM, yy" ng-model="newEvent.start">
  <input type="submit" value="Add">
</form>
```
and in the controller a method addEvent()

```javascript
$scope.newEvent = {
  title: '',
  start: ''
};

$scope.addEvent = function(){
  $scope.events[0].push($scope.newEvent)

  $scope.newEvent = {
    title: '',
    start: ''
  };
}
```

We have an object newEvent in the $scope, and our form is bound to it, the addEvent method, pushes that object into our events array, and then clears the values. Right now we have a calendar and a way to add events to it, but we still need to sync with firebase.

So our next step is to create an account in [firebase][firebase_signup], if we dont have one yet, go to your dashboard, and open the app that firebase creates for you, then copy the that url, it will be something like this:

```javascript
"https://scorching-inferno-2434.firebaseio.com/"
```

Inside the controller now we have to create a firebase object like this:

```javascript
var firebaseEvents = new Firebase("https://scorching-inferno-2434.firebaseio.com/");
```

$firebase is the facotry that bounds firebase and angular, now that you have a firebase object, we pass it to $firebase to create an object that comunicates with angular

```javascript
var events = $firebase(firebaseEvents);
```

The next step is to substitute our previous array of events, for the firebase array. The angularfire object knows how to work as an object or as an array, we need an arra of events so we will use $asArray()

```javascript
$scope.events = [events.$asArray()];
```

And as the last step, in our addEvent() method, we will use $push() instead of push

```javascript
events.$push($scope.newEvent);
```

In this demo I dont cover authentication, and any user can modify the events, but you should put authentication and review the user permissions in your app.

You can get the complete demo from my github account [here][githube_project]

[AngularJS]: http://angularjs.org
[Firebase]: http://firebase.com
[firebase_signup]: http://firebase.com/signup/
[AngularFire]: http://firebase.com/docs/web/libraries/angular/
[angular-ui-calendar]: http://github.com/angular-ui/ui-calendar
[fullcalendar]: http://fullcalendar.io
[angular-ui-date]: http://github.com/angular-ui/ui-date
[githube_project]: http://github.com/konzz/angular-firebase-calendar
