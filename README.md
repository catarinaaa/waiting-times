# Waiting Times

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <p align="center">
    Web app to check the current wait times for the Lisbon underground!
    <br />
    <a href="https://waiting-times-58472.web.app/"><strong>Try it yourself »</strong></a>
    <br />
    <br />
    <a href="https://github.com/catarinaaa/waiting-times">Source Code</a>
    ·
    <a href="https://github.com/catarinaaa/waiting-times/issues">Report Bug</a>
    ·
    <a href="https://github.com/catarinaaa/waiting-times/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Web app to check the current waiting times on Lisbon's metro.
Client, HTML and Javascript based, sends request to a node.js server, that consequently request the Metro API for the information about the queried station and responds with the appropriate time.

Hosted on Firebase Hosting and Functions at: https://waiting-times-58472.web.app/

### Built With

* [EstadoServicoML API](https://api.metrolisboa.pt/store/apis/info?name=EstadoServicoML&version=1.0.1&provider=admin&tag=Estado%20Linha)
* [Node.js](https://nextjs.org/)
* [Express](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [EstadoServicoML API](https://api.metrolisboa.pt/store/apis/info?name=EstadoServicoML&version=1.0.1&provider=admin&tag=Estado%20Linha)
2. Clone the repo
   ```sh
   git clone https://github.com/catarinaaa/waiting-times.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```
5. Change your host in `public/script.js` to your `localhost:port` or other desired host
   ```js
   const host = 'ENTER YOUR HOST'
   ```
7. Run node.js server 
   ```sh
   node functions/index.js
   ```
  


## License

Distributed under the GNU General Public License. See `LICENSE.txt` for more information.


## Contact

Catarina Brás - catarinasaomiguel@gmail.com

Project Link: [https://github.com/catarinaaa/waiting-times](https://github.com/catarinaaa/waiting-times)

