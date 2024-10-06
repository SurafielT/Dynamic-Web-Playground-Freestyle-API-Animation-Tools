let currentImageIndex = 0;
let dogImages = [];

function getRandomDogImages() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
        .then((response) => response.json())
        .then((data) => {
            dogImages = data.message;

            displayCurrentImage();

            createBulletPoints();

            highlightBulletPoint(currentImageIndex);
        })
        .catch((error) => {
            console.error('Error fetching dog images:', error);
        });
}

function displayCurrentImage() {
    const imageContainer = document.querySelector('.dog-slider');
    imageContainer.innerHTML = '';
    const imageElement = document.createElement('img');
    imageElement.src = dogImages[currentImageIndex];
    imageContainer.appendChild(imageElement);
}

function navigateImages(offset) {
    currentImageIndex += offset;

    if (currentImageIndex < 0) {
        currentImageIndex = 0;
    } else if (currentImageIndex >= dogImages.length) {
        currentImageIndex = dogImages.length - 1;
    }

    displayCurrentImage();
    highlightBulletPoint(currentImageIndex);
}

function createBulletPoints() {
    const bulletPointsContainer = document.getElementById('bullet-points');
    for (let i = 0; i < dogImages.length; i++) {
        const bulletPoint = document.createElement('div');
        bulletPoint.className = 'bullet-point';
        bulletPoint.setAttribute('data-index', i);
        bulletPoint.addEventListener('click', (event) => {
            const index = parseInt(event.target.getAttribute('data-index'));
            navigateImages(index - currentImageIndex);
        });
        bulletPointsContainer.appendChild(bulletPoint);
    }
}

function highlightBulletPoint(index) {
    const bulletPoints = document.querySelectorAll('.bullet-point');
    bulletPoints.forEach((bulletPoint, i) => {
        if (i === index) {
            bulletPoint.classList.add('active');
        } else {
            bulletPoint.classList.remove('active');
        }
    });
}


window.addEventListener('load', getRandomDogImages);

if (window.annyang) {
    const commands = {
        'navigate to home': function () {
            window.location.href = 'home.html';
        },
        'navigate to stocks': function () {
            window.location.href = 'stocks.html';
        },
        'navigate to dogs': function () {
            window.location.href = 'dogs.html';
        },
        'change the color to :color': function (color) {
            document.body.style.backgroundColor = color;
        },
    };


    annyang.addCommands(commands);

    annyang.start();
}

function getRandomQuote() {
    fetch("https://zenquotes.io/api/random")
        .then((response) => response.json())
        .then((data) => {
            const quoteText = data[0].q;
            const quoteAuthor = data[0].a;

            const quoteContainer = document.querySelector(".quote-container");
            if (quoteContainer) {
                quoteContainer.innerHTML = `<p>"${quoteText}"</p><p>- ${quoteAuthor}</p>`;
            }
        })
        .catch((error) => {
            console.error("Error fetching random quote:", error);
        });
}

window.addEventListener("load", getRandomQuote);

async function fetchData() {
    try {
        const response = await fetch('https://tradestie.com/api/v1/apps/reddit');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function openYahooFinance(ticker) {
    window.open(`https://finance.yahoo.com/quote/${ticker}`, '_blank');
}

async function displayTopStocks() {
    const stocksListElement = document.getElementById('stocks-list');

    const data = await fetchData();

    if (data && data.length > 0) {
        data.sort((a, b) => (b.no_of_comments || 0) - (a.no_of_comments || 0));

        const table = document.createElement('table');
        table.border = '1';

        const headerRow = document.createElement('tr');
        const stockNameHeader = document.createElement('th');
        const commentsHeader = document.createElement('th');
        const sentimentHeader = document.createElement('th');
        stockNameHeader.textContent = 'TICKER';
        commentsHeader.textContent = 'COMMENTS COUNT';
        sentimentHeader.textContent = 'SENTIMENT';
        headerRow.appendChild(stockNameHeader);
        headerRow.appendChild(commentsHeader);
        headerRow.appendChild(sentimentHeader);
        table.appendChild(headerRow);

        for (let i = 0; i < Math.min(5, data.length); i++) {
            const stock = data[i];

            const row = document.createElement('tr');
            const stockNameCell = document.createElement('td');
            const commentsCell = document.createElement('td');
            const sentimentCell = document.createElement('td');
            const tickerLink = document.createElement('a');

            tickerLink.textContent = stock.ticker;
            tickerLink.href = '#'; 
            tickerLink.addEventListener('click', () => openYahooFinance(stock.ticker));

            stockNameCell.appendChild(tickerLink);

            commentsCell.textContent = stock.no_of_comments || 0;
            sentimentCell.textContent = stock.sentiment || 'N/A';
            row.appendChild(stockNameCell);
            row.appendChild(commentsCell);
            row.appendChild(sentimentCell);
            table.appendChild(row);
        }

        stocksListElement.appendChild(table);
    } else {
        stocksListElement.textContent = 'No data available.';
    }
}

displayTopStocks();

document.addEventListener("DOMContentLoaded", function () {
    const breedsList = document.getElementById("breeds-list");
    const breedDetails = document.getElementById("breed-details");

    const apiUrl = "https://dogapi.dog/api/v2/breeds";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const breeds = data.data;

            if (breeds.length > 0) {
                const ul = document.createElement("ul");
                ul.style.display = "flex";

                breeds.forEach(breedData => {
                    const attributes = breedData.attributes;

                    const li = document.createElement("li");
                    const button = document.createElement("button");
                    button.textContent = attributes.name;
                    button.addEventListener("click", function () {
                        displayBreedDetails(attributes);
                    });
                    li.appendChild(button);

                    ul.appendChild(li);
                });

                breedsList.appendChild(ul);
            } else {
                breedsList.textContent = "No breeds found.";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    function displayBreedDetails(attributes) {
        breedDetails.innerHTML = `<h2>${attributes.name}</h2>
                                      <h3>Description: ${attributes.description}</h3>
                                      <h3>Min Life: ${attributes.life.min} years</h3>
                                      <h3>Max Life: ${attributes.life.max} years</h3>`;


        breedDetails.style.border = "2px solid black";
    }
});

function fetchStockInfo() {
    const apiKey = 'OUzetgdsWViIq6czBf1KBfESMcrstbrl';
    const stockSymbol = document.getElementById('stockSymbol').value;
    const date = document.getElementById('date').value;
  
    const apiUrl = `https://api.polygon.io/v1/open-close/${stockSymbol}/${date}?apiKey=${apiKey}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Call a function to update the chart with the fetched data
        updateChart(data);
      })
      .catch(error => console.error('Error:', error));
  }
  
  function updateChart(data) {
    const ctx = document.getElementById('stock-chart').getContext('2d');
  
    // Create a line chart if not already created
    if (!window.myLineChart) {
      window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [data.day],
          datasets: [{
            label: 'Stock Price',
            borderColor: 'rgb(75, 192, 192)',
            data: [data.open],
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      // Update the existing chart with new data
      window.myLineChart.data.labels.push(data.day);
      window.myLineChart.data.datasets[0].data.push(data.open);
      window.myLineChart.update();
    }
  }