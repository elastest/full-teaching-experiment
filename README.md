# FULL TEACHING 2.0: AN ONLINE TEACHING PLATFORM WITH VIDEO-CLASSES


![CI](https://github.com/codeurjc-students/2019-FullTeaching/workflows/CI/badge.svg)
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/presentation.png?raw=true"/></p>


## What is FullTeaching?
FullTeaching is an educational web application to make online classes easy for teachers as well as students. Its current main features are the following:

- Teachers can create all the **courses** they want and easily invite their students. Every user will see their courses and sessions well ordered on their dashboards.

- Teachers can stablish an unlimited number of **classes** for each course, indicating the content and date for each one of them.

- A **calendar** view is provided in order to check all your classes at a glance.

- Every course has a **forum** where the users can open entries, write comments and reply others so they can share doubts and knowledge.

- Teachers have an advanced system for attaching **files** to a course. They can customize groups of files, name them as they want and reorder them at any moment. The uploading process has been greatly simplified.

- FullTeaching uses [OpenVidu](http://openvidu.io) technology to provide video-conference capabilities. Teachers can initialize a class and every student invited can connect and see the teacher in real time. FullTeaching also allows students to intervene during the class (the teacher must authorize it first).

*Dashboard: all your courses and your calendar*
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/dashboard.png?raw=true"/></p>

*Calendar: here you have all your sessions, with direct access to their specific course*
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/calendar.png?raw=true"/></p>

*Classes: ordered by date, teachers can easily add new ones and modify existing ones*
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/sessions.png?raw=true"/></p>

*Forum: unlimited entries for posting all your questions*
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/forum.png?raw=true"/></p>

*Files: advanced tree structure to keep all the course's files clear and tidy*
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/files.png?raw=true"/></p>

*Adding students to the course is as simple as pasting their emails. FullTeaching will automatically do the rest*
<p align="center"><img src="https://github.com/codeurjc-students/2019-FullTeaching/blob/master/images/students.png?raw=true"/></p>

# Quick start guide

## How to execute a demo FullTeaching service (Docker)

To get FullTeaching working in the easiest way, you just have to download the file above `docker-compose.yml` and run `docker-compose up` in its directory. This will pull all the necessary images from DockerHub and will execute everything (it will take one minute after the pull ends). Go to `http://localhost:5000/` and there you have it!

You will need some user data to test the features. These are the default users for the demo:
- Email: `teacher@gmail.com`   Pass: `pass`  (Teacher account)
- Email: `student1@gmail.com`  Pass: `pass`  (Student account) 
- Email: `student2@gmail.com`  Pass: `pass`  (Student account)


## How to develop FullTeaching

To get a full development version of the app just execute the following commands:


### Prerequisites

  - **Java 8**

    *Check version*:

        $ java -version

     *Install*:

        $ sudo apt-get install -y default-jdk

  - **AngularCLI** ( which requires  Node.js > 4.x.x  and  npm > 3.x.x )

    *Check versions*:

        $ node -v
        $ npm -v
        $ ng -v

     *Install*:

        $ sudo apt-get install nodejs
        $ sudo apt-get install npm
        $ npm install -g @angular/cli

  - **Gradle**

    *Check version*:

        $ gradle -v

    *Install*:

        $ sudo apt-get install gradle

  - **PostgreSQL**

    *Check version*:

        $ mysql --version

    *Install*:

        $ sudo apt-get update
        $ sudo apt-get install mysql-server
        $ sudo mysql_secure_installation

### Installation and execution

  First of all, it is necessary to create a schema for MySQL:

        $ mysql -u root -p
        $ CREATE DATABASE full_teaching;
        $ exit

  Then we can build and run the project:

        $ git clone https://github.com/elastest/full-teaching-experiment.git
        $ cd full-teaching-experiment/src/main/angular
        $ npm install
        $ cd ../../../
        $ ./BuildFrontWarAndRun.sh

This clones the project in your working directory, installs dependencies with `npm install` and executes the `BuildFrontJarAndRun.sh` script.

This script `BuildFrontJarAndRun.sh` builds the FrontEnd with angular-cli, copies all generated files to the Backend `static` folder, builds and generates the WAR with Maven and runs the WAR file.

Go to `http://localhost:5000/` and there you have it!

### :heavy_exclamation_mark: **IMPORTANT**:

  - Before executing the script to build and run the app, it is necessary to change the following properties of `application.properties` file to match your credentials for MySQL:

        spring.datasource.username=YOUR_USERNAME
        spring.datasource.password=YOUR_PASS

  - You may have to change permissions in order to execute the scripts.

*These instructions have been tested for Ubuntu 14.04 and Ubuntu 16.04*
