# smart-dorm
Code for my 'smart home' dorm room projects.

## CellWall
A multi-device display for showing interactive data,
such as photos, weather information, calendar appointments, and
more.

Android devices are controlled through an external computer running
ADB, and `adbkit` provides an interface to use ADB through Node.
Other actions may be triggered with Tasker and IFTTT.

A remote interface will also be provided through
a website dashboard, which will take advantage of the
Physical Web to broadcast a beacon link to the
dashboard (via PyBeacon).

## Dash buttons
Amazon dash buttons will be used as physical controls.
One button is for use as a doorbell, and the second's purpose
is to be determined.
