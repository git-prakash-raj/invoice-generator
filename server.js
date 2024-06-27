import express from "express";
import numToWords from "./function/numWords.js";
import puppeteer from "puppeteer";
import fs from "node:fs";
import PDFDocument from "pdfkit";

const port = 3000;
const app = express();

app.use(express.static("./public"));
app.set("view engine", "ejs");

// the user details can be queried from database using the some information from the frontend like customer id..
//this is a hard coded value and can be replaced the data from database
const user = {
  name: "Mark ",
  address: {
    building: "Eruofins IT Solutions India Pvt Ltd,, 1st Floor",
    street: "",
    area: "Lakshminarayana Pura,ACES Layout",
    district: "Bengaluru",
    state: "KARNATAKA",
    country: "India",
    pincode: 560037,
    stateCode: "29",
    countryCode: "IN",
  },
  placeOfDelivery: "KARNATAKA",
  customerId: 529312,
};

// the company details can be queried from database using the some information from the frontend like seller id..
//this is a hard coded value and can be replaced the data from database

const company = {
  name: "Varasiddi Silk Exports",
  address: {
    building: "75",
    street: "3rd Cross,Lalbagh Road",
    area: "",
    district: "Bengaluru",
    state: "KARNATAKA",
    country: "India",
    pincode: 560037,
    stateCode: "29",
    countryCode: "IN",
  },
  placeOfSupply: "KARNATAKA",
  sellerId: 112318,
  pan: "AACFV3325K",
  gst: "29AACFV3325K1ZY",
};

// the products details can be queried from database using the some information from the frontend like product id..
//this is a hard coded value and can be replaced the data from database
const items = [
  {
    product_id: "B07KGFF3KW8",
    productName: "Varasiddi Men's Formal Shirt(SH-05-42,Navy Blue,42)",
    unitPrice: 538,
    quantity: 1,
    discount: 0,
  },
  {
    product_id: "B07KGCS2X7",
    productName: "Varasiddi Men's Formal Shirt(SH-05-42,Navy Blue,42)",
    unitPrice: 538,
    quantity: 1,
    discount: 0,
  },
];

let current = new Date();
let day = current.getDate();
let month = current.getMonth();
let year = current.getFullYear();

let finalDate = `${day}.${month}.${year}`;

// the orderNo and details can generated using some random functions and for the time being it is hardcoded
const inv = {
  orderNo: "9871-4890-2377",
  details: "KA-948728-3872",
  date: finalDate,
  num: "IN-776",
};
let totalTax = 0;

const products = items.map((obj) => {
  let discountAmount = obj.unitPrice * (obj.discount / 100);
  let net = obj.quantity * obj.unitPrice - discountAmount;
  let total;
  if (user.placeOfDelivery == company.placeOfSupply) {
    let cgst = net * (9 / 100);
    let sgst = net * (9 / 100);
    totalTax += cgst + sgst;
    total = (net + cgst + sgst).toFixed(2);
    return { ...obj, discountAmount, net, cgst, sgst, total };
  } else {
    igst = net * (18 / 100);
    totalTax = cgst + sgst;
    total = (net + igst).toFixed(2);
    return { ...obj, discountAmount, net, igst, total };
  }
});

let totalAmount = 0;
products.forEach((obj) => {
  totalAmount += parseFloat(obj.total);
});
totalAmount = Math.floor(totalAmount);
let word = numToWords(totalAmount);

let pdfGenerationInProgress = false;

app.get("/", async (req, res) => {
  if (pdfGenerationInProgress) {
    console.log("PDF generation is already in progress.");
    return res.send("PDF generation is already in progress.");
  }
  try {
    await res.render("index.ejs", {
      buyer: user,
      seller: company,
      products: products,
      invoice: inv,
      totalTax: totalTax,
      totalAmount: totalAmount,
      inWords: word,
    });

    const imagePath = `./output/images/${user.name}-invoice-${finalDate}.png`;
    const outputPath = `./output/pdf/${user.name}-invoice-${finalDate}.pdf`;
    await htmlToPdf(imagePath);
    pdfGenerationInProgress = true;

    await createPDF(imagePath, outputPath);
  } catch (error) {
    console.error("Error generating PDF:", error);

    res.status(500).send("Error generating PDF");
  } finally {
    pdfGenerationInProgress = false;
  }
});

async function htmlToPdf(imagePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`http://localhost:${port}`, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: imagePath,
      fullPage: true,
    });
  } catch (error) {
    console.error("Error taking screenshot:", error);
  } finally {
    await browser.close();
  }
}

function createPDF(imagePath, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const img = doc.openImage(imagePath);
    const imageWidth = img.width;
    const imageHeight = img.height;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const scale = 0.9;
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);
    doc.image(imagePath, x, y, { width: scaledWidth, height: scaledHeight });
    doc.end();
    writeStream.on("finish", () => {
      writeStream.close();
      resolve();
    });
    writeStream.on("error", reject);
  });
}
app.listen(port, () => {
  console.log(`The Server is running on port ${port}`);
});
