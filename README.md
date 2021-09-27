<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/colin-ho/BetterRadio">
    <img src="images/Logo.png" alt="Logo" width="80" height="80">
  </a>
  <a href="https://better-radio.herokuapp.com">
    <h1 align="center">BetterRadio</h3>
  </a>
  <p align="center">
    Recommendation focused music player powered by Spotify Web API
  </p>
</p>

![Product Name Screen Shot][product-screenshot1]

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

**[BetterRadio](https://better-radio.herokuapp.com)** is an app that finds the songs you love. Customise, create, and discover new playlists based on your favorite artists and genres.

![Product Name Screen Shot][product-screenshot3]

### Key Features
  - **Discover**: Get an array of playlists based on the top genres you listen to. Each playlist will contain 15-20 songs corresponding to a group of similar genres.
  - **Create**: Generate your own playlists based on any number of songs, and customise them with up to 14 different unique track attributes i.e. popularity, energy, danceability.
  - **Browse**: Search for songs, and browse through the top tracks from your favorite artists. Search results are filtered based on your top artists and listening preferences.
  - **My Radio**: See and play all your custom playlists, and get the option to add them to your own Spotify account.

![Product Name Screen Shot][product-screenshot2]

### Built With

* [React](https://reactjs.org/)
* [Django](https://www.djangoproject.com/)
* [Spotify Web API](https://developer.spotify.com/documentation/web-api/)

<!-- GETTING STARTED -->
## Getting Started
Contact colin.ho99@gmail.com to request access for the public version, which is available [here](https://better-radio.herokuapp.com).

To get a local copy up and running follow these simple steps.

### Prerequisites

* Spotify Premium
* Desktop Computer with Chrome/Firefox/Edge/Internet Explorer (required for in-app playback)
* npm
  ```sh
  npm install npm@latest -g
  ```
* Python virtual environment
  ```sh
  python3 -m venv env
  source env/bin/activate
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/colin-ho/BetterRadio.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install Python packages
   ```sh
   pip install -r requirements.txt
   ```
4. Create .env file containing environment variables listed in spotify/credentials.py
   ```sh
   touch .env
   ```
6. Make migrations and run backend server
    ```sh
   python manage.py migrate
   python manage.py runserver
   ```
5. Start frontend
    ```sh
   npm start
   ```

<!-- CONTACT -->
## Contact

- **Colin Ho** - [Linked-In](https://www.linkedin.com/in/colin-ho99/) - colin.ho99@gmail.com

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [React-Spotify-Web-Playback](https://github.com/gilbarbara/react-spotify-web-playback)
* [Material-UI](https://material-ui.com/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot1]: images/Home.png
[product-screenshot2]: images/Browse.png
[product-screenshot3]: images/Mobile.png
