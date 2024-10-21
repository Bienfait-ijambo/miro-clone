
self.onmessage = function(event) {
    const array = event.data; // Get the array from the main thread
    const result = processArray(array); // Call the function to process the array
    self.postMessage(result); // Send the result back to the main thread
};

function processArray(array) {
    // Example processing: Sum all elements in the array
    return array.reduce((sum, value) => sum + value, 0);
}
