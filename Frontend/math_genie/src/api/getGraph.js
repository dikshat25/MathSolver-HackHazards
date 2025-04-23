export const getGraph = async (question) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
  
      const data = await response.json();
      console.log("Graph API response:", data); // 👈 DEBUG LOG
      const graphBase64 = data.chart || "";
  
      return graphBase64;
    } catch (error) {
      console.error("Error fetching graph:", error);
      return "";
    }
  };