# JournalEdit

## Introduction
### About the Project
JournalEdit is a MVP for a web platform that connects scientific journal authors with people looking to offer scientific editing. This ensures two things:
1. An author whose first language is not English can reduce the time to publish their research.
2. An editor with available time (such as a graduate student) can sharpen their editing skills, read more scientific papers and make a bit of money.

### Built With
The backend is built on some of these technologies:
1. Express/Node/Typescript
2. TypeORM
3. Class-Validator
4. APIDoc

The front end (coming soon) will be built with:
1. Typescript/React
2. Some UI library (Material/Bootstrap?)

## Getting Started
### Prerequisites
To run the code in this project, you'll need the latest stable version of NPM. Upgrade using npm itself, or Node Version Manager, or directly download the installer from [npm](https://www.npm.org).

```sh
npm install npm@latest -g
```

### Installation
To get a local copy up and running please follow these steps. Currently, only the backend exists, with a WIP framework to do basic CRUD:
- Creating users with roles (job creator and job seeker roles are supported)
- Creating and deleting jobs (as a job creator)
- Authentication and sign in/sign out
- Searching and applying for jobs (as a job seeker)
- Commenting on a job

To install, use npm:
```bash
npm install
```

Set environment variables (a `.env` file contains basic variables, but some examples follow) for:
- NODE_ENV (eg `development`)
- PORT (eg `7000`)
- JWT_SECRET (really any string)

Compile the Typescript to Javascript using Webpack and run the service locally (in development mode, the compiler runs with a file tree watcher):
```bash
npm run webpack
npm run start
```

## Usage
### API Documentation
For the backend, some of the API methods are annotated with APIDoc. To view documentation:
1. Install APIDocs via:
```bash
npm install -g apidoc
```
2. Navigate to the server directory
```bash
cd server
```
3. Generate the latest docs
```bash
apidoc -i src/ -o doc/
```
4. View the resulting docs
```bash
open server/doc/index.html
```

### Usage
For testing the backend, use Postman or Insomnia.

### Tests
Unit tests and integration tests are coming soon (TM).


## Miscellanea
### Contact
Abid Hasan - [@sabidhasan](http://github.com/sabidhasan)

Project Link: [https://github.com/sabidhasan/JournalEdit](https://github.com/sabidhasan/JournalEdit)

### Contributing
Though the repository is public, pull requests are not welcome at this time.

### License
[MIT](https://choosealicense.com/licenses/mit/)
