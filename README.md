> Static http server and base task packages. 
> By default WebSocket client tries to connect to the 3000 port.

## Installation
1. Download repo
2. `npm install`

## Usage
**Development**

`npm run start-tsx`

* App served @ `http://localhost:3000` with tsx

**Production**

`npm run start-webpack-tsx`

* App served @ `http://localhost:3000` with tsx

---

**All commands**

| Command                     | Description                                   |
|-----------------------------|-----------------------------------------------|
| `npm run start-tsx`         | App served @ `http://localhost:3000` with tsx |
| `npm run start-webpack-tsx` | App served @ `http://localhost:3000` with tsx |

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

---

### Frontend 
Frontend for this task based in the `/front` directory.
To start the application you should open `/front/index.html` file in your browser.
