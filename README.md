# Supermonkey's Supermarket Comparison

## Project description
Common items on a family’s weekly grocery list may be available at many stores and retailers, albeit at different price points. A shopper may wish to compare the prices of items on their list across several retailers before going out, such as cross-referencing online catalogs. However, the practice of tracking the prices of items across many websites can get rather disorganized, whereby details are easily forgotten or misplaced among many browser tabs. This application solves the pain point of organization by compiling product listings across several grocers and retailers for an easy display of item prices. 

This project relies on API calls routed through the in-house backend server (see https://github.com/xghouftw/pricecompareserver for details of provided endpoints).

## Detailed workflow
On launch, the website brings you to the Change Location page and automatically prompts a location detection mechanism.

When the location has been set or changed, the site calls the Google Places API and searches for places tagged `grocery_stores`. The search radius can be changed with a slider. If a store has a supported API, we note it and enable searching through that API (The current supported APIs are Kroger and Walmart). Otherwise, we note to the customer that they might want to manually check these stores for lower prices.

Onto the Add Item page, if a location has been selected and the customer types a search term in the box, the site will search through the Kroger and Walmart catalog and retrieve relevant information (name, brand, store, price, and picture). Each item card has a button to click to add to cart. Clicking this multiple times will increment the quantity of the respective item in the cart.

The actions involving API calls to Kroger and Walmart are routed through the in-house server to avoid CORS policy issues.

The See Cart page shows all the items  added in a list and their total price. The customer can remove an item one at a time or clear the entire cart.

## Demo
The application is deployed at https://supermonkey-supermarket.onrender.com//.

**Disclaimer:** The backend is live with Render's free hosting service. The server automatically spins down after a period of inactivity. As a result, the first request while the server is inactive will take 1-2 minutes to wait for the server to spin up. 

Video: [![Watch](https://img.youtube.com/vi/5cOiaVHBS2Y/0.jpg)](https://youtu.be/5cOiaVHBS2Y)

## Running the project locally

The Google Places API key is required to run this project and will not be provided in any `.env` file for privacy reasons.

Clone the repository:
```sh
git clone https://github.com/xghouftw/pricecompare
cd compprice
```

Install dependencies:
```sh
npm install
```

Create a `.env` file in the `compprice` directory with the following content:
```sh
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

Start the frontend:
```sh
npm start
```

## Learning journey
Inspired by the power of Google's Places API and the information it could search for, I became interested in the problem of compiling price information across many retailers to simplify and organize the shopping experience. I aimed to create a tool allowing users to compare prices and find the best deal, and hopefully promoting transparency and competition among supermarkets to the broader community of consumers. I started knowing the basics of HTML/CSS and next to no knowledge of React and Express. 

As I designed the UI and explored possible APIs, I ran into several issues. Many retail chains large enough to maintain APIs would gatekeep access to their official partners or affiliates. As of now, Kroger and Walmart are the only two APIs I found open to the public, but this application could be easily scaled to include more. Another direction I could've taken this is to directly scrape websites for information.

Figuring out the parameters and return types of the APIs was the most fun part. Walmart's authentication process for their API was quite prickly in that they required developers to implement the generation and signature of keys themselves. 

The most difficult issue I faced was being blocked by both grocers by their CORS (cross-origin resource sharing) policies. In order to deploy for a smooth experience, I was forced to create a backend server as an intermediary between the website and APIs.

Overall, this project taught me a great deal about making API requests in JavaScript, as well as building applications with React and Express!