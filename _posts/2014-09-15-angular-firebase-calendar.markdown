---
layout: post
title:  "AngularJS + Firebase Calendar"
date:   2014-09-15 17:33:31
tags: angularjs firebase
---
<p>
    <a href="http://angularjs.org/">AngularJS</a> and <a href="http://firebase.com">Firebase</a> do a very good combo to do real time apps. Since AngularJS ofers you a good framework with double-data-binding Firebase ofers a realtime-database, also firebase has <a href="http://firebase.com/docs/web/libraries/angular/">AngularFire</a> to make them work together perfectly.
  </p>
  <p>So I created a calendar that works with Firebase so sync the events between different clients. This is the bower.json with the dependencies.</p>

<pre><code class="prism language-javascript">{
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
}</code></pre>

  <p>We will use the <a href="http://github.com/angular-ui/ui-calendar">angular-ui-calendar</a> that mixes <a href="http://fullcalendar.io">fullcalendar</a> with angular, and <a href="http://github.com/angular-ui/ui-date">angular-ui-date</a> for the datepickers.</p>
  <p>Lets start by creating an angular controler</p>
  <pre><code class="prism language-javascript">angular.module('calendar', ['ui.calendar', 'ui.date', 'firebase'])
.controller('calendar', ['$scope', '$firebase', function($scope, $firebase){
    $scope.events = [[]];
}]);</code></pre>

  <p>angular-ui-calendar expects the events to be an array "event sources", and those event sources can be arrays, functions, or urls thar return a json of events. We will use an array, so for now we set events as an array inside of an array. Add the calendar to the view</p>
  <pre><code class="prism language-javascript">&lt;div ui-calendar ng-model="events">&lt;/div></code></pre>
  
  <p>Now, we will a form to add new events.</p>
  <p>So the form will look like:</p>
  <pre><code class="prism language-javascript">&lt;form ng-submit="addEvent()">
  &lt;input ng-model="newEvent.title" type="text" placeholder="Title">
  &lt;input ui-date ui-date-format="DD, d MM, yy" ng-model="newEvent.start">
  &lt;input type="submit" value="Add">
&lt;/form></code></pre>
<p>and in the controller a method addEvent()</p>
<pre><code class="prism language-javascript">$scope.newEvent = {
  title: '',
  start: ''
};

$scope.addEvent = function(){
  $scope.events[0].push($scope.newEvent)

  $scope.newEvent = {
    title: '',
    start: ''
  };
}</code></pre>

<p>We have an object newEvent in the $scope, and our form is bound to it, the addEvent method, pushes that object into our events array, and then clears the values. Right now we have a calendar and a way to add events to it, but we still need to sync with firebase.</p>

<p>So our next step is to create an account in <a href="http://firebase.com/signup/">firebase</a>, if we dont have one yet, go to your dashboard, and open the app that firebase creates for you, then copy the that url, it will be something like this:</p>
<pre><code class="prism language-javascript">"https://scorching-inferno-2434.firebaseio.com/"</code></pre>

<p>Inside the controller now we have to create a firebase object like this</p>
<pre><code class="prism language-javascript">var firebaseEvents = new Firebase("https://scorching-inferno-2434.firebaseio.com/");</code></pre>

<p>$firebase is the facotry that bounds firebase and angular, now that you have a firebase object, we pass it to $firebase to create an object that comunicates with angular</p>
<pre><code class="prism language-javascript">var events = $firebase(firebaseEvents);</code></pre>

<p>The next step is to substitute our previous array of events, for the firebase array. The angularfire object knows how to work as an object or as an array, we need an arra of events so we will use $asArray()</p>
<pre><code class="prism language-javascript">$scope.events = [events.$asArray()];</code></pre>

<p>And as the last step, in our addEvent() method, we will use $push() instead of push</p>
<pre><code class="prism language-javascript">events.$push($scope.newEvent);</code></pre>

<p>In this demo I dont cover authentication, and any user can modify the events, but you should put authentication and review the user permissions in your app</p>
<p>You can get the complete demo from my github account <a href="http://github.com/konzz/angular-firebase-calendar">here</a></p>

