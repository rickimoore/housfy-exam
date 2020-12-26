# Welcome to Housfy's Mission to Mars

This project was created in response to a test application given by Housfy and developed by Ricki Moore.
Below you will find test instructions and manual for how to build and run the project locally.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##Test instructions

Mars Rover Mission

Your Task

You’re part of the team that explores Mars by sending remotely controlled vehicles to the surface
of the planet. Develop a software that translates the commands sent from earth to instructions
that are understood by the rover.
Requirements

● You are given the initial starting point (x,y) of a rover and the direction (N,S,E,W)
it is facing.

● The rover receives a collection of commands. (E.g.) FFRRFFFRL

● The rover can move forward (f).

● The rover can move left/right (l,r).

● Suppose we are on a really weird planet that is square. 200x200 for example :)

● Implement obstacle detection before each move to a new square. If a given
sequence of commands encounters an obstacle, the rover moves up to the last
possible point, aborts the sequence and reports the obstacle.

Take into account

● Rovers are expensive, make sure the software works as expected.


## Prerequisites
● Project requires node -v 10.10.0

## HOW TO RUN LOCALLY:

● Download Project
`git clone https://github.com/rickimoore/housfy-exam.git`

● Install dependencies
`npm install`

● Run Project
`npm start`
