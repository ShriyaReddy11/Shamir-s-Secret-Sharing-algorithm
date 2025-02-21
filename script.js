// Load JSON file dynamically
fetch("testcases.json")
    .then(response => response.json())
    .then(data => {
        let results = [];
        data.test_cases.forEach((test, index) => {
            const secret = solvePolynomial(test);
            results.push(`Test Case ${index + 1}: Secret (c) = ${secret}`);
        });

        // Display results
        document.getElementById("output").innerHTML = results.join("<br>");
    })
    .catch(error => console.error("Error loading JSON:", error));

// Function to decode Y values from different bases
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to solve the polynomial and find constant term (c)
function solvePolynomial(test) {
    let n = test.keys.n;
    let k = test.keys.k;
    
    // Extract (x, y) points
    let points = Object.keys(test)
        .filter(key => key !== "keys")
        .map(key => ({
            x: parseInt(key),
            y: decodeValue(test[key].base, test[key].value)
        }));

    // Sort points by x-value
    points.sort((a, b) => a.x - b.x);

    // Select first k points for interpolation
    let selectedPoints = points.slice(0, k);

    return lagrangeInterpolation(selectedPoints, 0);  // Get f(0) = c
}

// Lagrange Interpolation function to find f(0) = c
function lagrangeInterpolation(points, xTarget) {
    let c = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term *= (xTarget - points[j].x) / (points[i].x - points[j].x);
            }
        }
        c += term;
    }

    return Math.round(c);  // Round to nearest integer
}
