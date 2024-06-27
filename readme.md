# Invoice Generation System

This project demonstrates a simple invoice generation system using Node.js, Express, Puppeteer for HTML to PDF conversion, and PDFKit for creating PDF documents.

## Description

This project implements a web application using the following technologies:

- **Express**: For setting up the server.
- **EJS**: As the templating language.
- **Puppeteer**: For browser automation to capture screenshots.
- **PDFKit**: For converting images into PDFs.

## Note

- **User Details, Company Details, and Items**: These are currently hardcoded in the backend but can be easily modified to be queried from a database or the front-end.
- **Final Amount Calculation**: The final amount is rounded up to avoid dealing with decimals, making it easier for the customer to pay a rounded value.
- **Logo and Signature Image**: These are provided as examples and can be edited accordingly.

## Prerequisites

Make sure you have Node.js installed. You can check if Node.js is installed by running:

```bash
node -v
```

If Node.js is not installed, download it from [nodejs.org](https://nodejs.org/) and follow the installation instructions.

## Installation

1. Navigate to the project directory using the terminal/command prompt.
2. Install dependencies using npm:

```bash
npm install
```

## Running the Server

Start the Node.js server by running:

```bash
node server.js
```

The server will start running at `http://localhost:3000`.

## Usage

1. Open a web browser of your choice.
2. Visit `http://localhost:3000`.
3. After reaching the site, the server will render an invoice page for demonstration purposes.
4. Check the output directories:

   - `./output/images`: Contains screenshots of the rendered invoice.
   - `./output/pdf`: Contains generated PDF invoices.

**Note:** Before running the server, ensure that `./output/images` and `./output/pdf` directories are empty. Edit the values of `user`, `company`, and `items` in `server.js` to ensure the application is working as expected.

The files are named using the buyer/user's name along with the date of the invoice. You can further improve this naming convention by including the time as well.
