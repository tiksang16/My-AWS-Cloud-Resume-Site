const apiEndpoint = "https://byonwtume8.execute-api.us-east-2.amazonaws.com/prod/visitor-count"; 

async function updateVisitorCount() {
  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    document.getElementById("view-count").textContent = data.count;
  } catch (error) {
    console.error("Error fetching visitor count:", error);
  }
}
updateVisitorCount();