if (!req.file) {
    console.log("No file received or invalid file type");
    return res.status(400).send({
        message: "No file received or invalid file type",
        success: false
    });
}