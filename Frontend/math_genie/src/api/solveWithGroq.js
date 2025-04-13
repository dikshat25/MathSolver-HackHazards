export const solveWithGroq = async (question) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
  
      const data = await response.json();
      let content = data.answer || "";
  
      // Basic cleanup (optional)
      content = content.replace(/^lution:/i, "Solution:");
      content = content.replace(/\$\$/g, "$"); // Convert double to single $ if needed
  
      return content;
    } catch (error) {
      console.error("Error fetching solution:", error);
      return "Failed to get a solution.";
    }
  };
  