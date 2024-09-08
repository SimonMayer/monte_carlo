Monte Carlo forecasting tool
=======================
A web-based forecasting tool, utilizing the Monte Carlo simulation method to provide probabilistic insights based on historical data. This tool is designed for visualizing outcomes and trends across multiple simulation runs, helping to make data-driven decisions.

Getting Started
---------------

### Prerequisites
*   Node.js 16.x or higher
*   npm (Node Package Manager)
*   Git
*   A modern web browser (Chrome, Firefox, Edge, Safari) that supports ECMAScript 2022 or higher.

Installation and Setup
----------------------

### 1\. Clone the repository

    git clone https://github.com/SimonMayer/monte_carlo.git

### 2\. Navigate to the project directory

    cd monte_carlo

### 3\. Install dependencies

    npm install

### 4\. Run the development server

    npm run serve

This will start a local development server, and typically using port `8080`. Open your browser and go to [http://localhost:8080](http://localhost:8080) to view the app.

### 5\. Build for production

To create a production build, run:

    npm run build

This will generate optimized static files in the `dist` directory.

Usage
-----

1.  Navigate to the simulation input page and provide historical data.
2.  Configure simulation parameters, including the milestone, number of simulated runs and historical data.
3.  Click **Generate Ensemble** to create the ensemble of simulated data.
4.  View the simulated data in charts showing the forecast burn-up, and likelihoods of achieving the milestone at or by specific periods. 


Contributing
------------

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

License
-------

This project is licensed under the MIT License. See the `LICENSE` file for more details.
