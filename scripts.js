const apiEndpoint = "https://e0gge1gv52.execute-api.us-east-2.amazonaws.com/prod/visitorcount"; 

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