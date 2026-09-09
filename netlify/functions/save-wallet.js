exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const data = JSON.parse(event.body);
        const walletAddress = data.address;

        if (!walletAddress) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Wallet address is required" }),
            };
        }

        console.log("Received Wallet Address:", walletAddress);
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ status: "success", message: "Wallet saved successfully" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.toString() }),
        };
    }
};
